/** @type {IoC} */
import IoC from '@aedart/js-ioc';

/**
 * @property {{page: number, pageSize: number, hasNext: boolean}} pagination
 * @property {Order[]} orders
 */
class OrderSearchResult {
	/**
	 * @type {Order[]}
	 */
	orders = [];
	pagination = {};

	/**
	 * Updates this instance with the serialized `data` object. If `cacheNewOrders` is true, new
	 * Orders will be cached in the OrderRepository.
	 *
	 * @param {object} data
	 * @param {boolean} cacheNewOrders
	 */
	update(data, pagination, cacheNewOrders = false) {
		/** @type {OrderRepository} */
		const repo = IoC.make('orderRepository');

		// We get Order objects from the serialized `data.orders`
		if (data) {
			this.orders = repo.update(data, cacheNewOrders);
		}

		if (pagination) {
			this.pagination = { ...pagination };
		}
	}
}

export default OrderSearchResult;
