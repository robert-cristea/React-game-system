/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Order from '../ECommerce/Order';
import OrderSearchResult from '../ECommerce/OrderSearchResult';

class OrderRepository {
	/**
	 * @protected
	 * @type {Map<string, Order>}
	 */
	orders = new Map();

	/**
	 * Loads a specific Order from the server by its id. Returns a
	 * Promise that resolves with the Order instance. The Order will be filled with the
	 * specified `attributes`.
	 *
	 * @param {string} id
	 * @param {string[]} attributes
	 * @return {Promise<Order>}
	 */
	load(id, attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server
			.getOrders([id], attributes)
			.then(data => (data.entries.length === 0 ? null : this.update(data.entries[0])));
	}

	/**
	 * From an array of serialized Order objects, update the internal Orders list. If a Order already
	 * exists, it will be updated, else a new Order will be created. The list of updated Order
	 * instances will be returned in the same order. `data` can also be a single serialized Order
	 * object; in that case, the updated Order will be returned. If the `cacheNew` parameter is false,
	 * new Order objects will not be saved (cached) internally (already cached Order will still be
	 * cached and updated).
	 *
	 * @param {Object[]|Object} data
	 * @param {bool} cacheNew
	 * @return {Order[]|Order}
	 */
	update(data, cacheNew = true) {
		if (!Array.isArray(data)) {
			return this.update([data], cacheNew)[0];
		}

		const updated = [];

		data.forEach(orderData => {
			const id = orderData.id;
			const isNewOrder = !this.orders.has(id);
			/** @type {Order} */
			const order = isNewOrder ? new Order() : this.orders.get(id);

			if (isNewOrder && cacheNew === true) {
				this.orders.set(id, order);
			}

			order.update(orderData);
			updated.push(order);
		});

		return updated;
	}

	/**
	 * Fills all the specified Orders with the requested attributes. If one or more Order don't have
	 * all the attributes, the server is used to get the missing attributes. Returns promise that
	 * resolves with the Order instances when they are all filled.
	 *
	 * @param {Order[]} orders
	 * @param {string[]} attributes
	 * @return {Promise<Order[]>}
	 */
	fill(orders, attributes) {
		const incomplete = orders.filter(order => !order.hasAttributes(attributes));
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		// All Orders have the requested attributes
		if (!incomplete.length) {
			return Promise.resolve(orders);
		}

		const incompleteIds = incomplete.map(order => order.id);
		const page = 1;
		const pageSize = incompleteIds.length;

		return server.getOrders(incompleteIds, attributes, page, pageSize).then(ordersData => {
			this.update(ordersData.entries);
		});
	}

	/**
	 * Retrieves from the list of already loaded Orders the one with the specified id. Returns null
	 * if not found.
	 *
	 * @param {string} id
	 * @return {Order|null}
	 */
	retrieve(id) {
		return this.orders.has(id) ? this.orders.get(id) : null;
	}

	/**
	 * Loads Orders from the server by `page` and `pageSize`. Returned Orders will be filled with
	 * the specified attributes. If `cacheNew` is false, returned Orders will not be cached. Returns
	 * a Promise that resolves with a OrderSearchResult.
	 *
	 * @param {string[]} attributes
	 * @param {number} page Page number
	 * @param {number} pageSize
	 * @param {boolean} cacheNew
	 * @return {Promise<OrderSearchResult>}
	 */
	loadPage(attributes, page = 1, pageSize = 10, type, cacheNew = false) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getOrders(null, attributes, page, pageSize, type).then(data => {
			const result = new OrderSearchResult();
			const pagination = {
				page: data.pageNumber,
				pageSize: data.pageSize,
				hasNext: data.totalPages > data.pageNumber,
			};
			result.update(data.entries, pagination, cacheNew);
			return result;
		});
	}

	/**
	 * Refunds items from the Order by its id. Returns a
	 * Promise that resolves with the Order instance.
	 *
	 * @param {string} id
	 * @param {string[]} items
	 * @param {string[]} attributes
	 * @return {Promise<Order>}
	 */
	refund(id, items, attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.refundOrder(id, items, attributes).then(data => (data ? this.update(data) : null));
	}

	/**
	 * Clear the OrderRepository. Called during `logout`.
	 */
	clear() {
		this.orders.clear();
	}
}

export default OrderRepository;
