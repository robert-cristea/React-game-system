import IoC from '@aedart/js-ioc';
import merge from 'lodash/merge';
import BigNumber from 'bignumber.js';
import { hasAllProperties } from '../utils';

/**
 * @property {string} id
 * @property {BigNumber} total
 * @property {"pending"|"completed"|"rejected"} status
 */
class Order {
	static STATUS = {
		PENDING: 'pending',
		COMPLETED: 'completed',
		REJECTED: 'rejected',
	};

	items = [];

	/**
	 * Update the attributes of this Order with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, data);

		// The total is a BigNumber
		if (data.total || data.total === 0) {
			this.total = new BigNumber(data.total);
		}

		// Item prices are BigNumber
		this.items.forEach(item => {
			if (typeof item.price === 'number') {
				item.price = new BigNumber(item.price);
			}
		});
	}

	/**
	 * Fills this Order with the specified attributes. If the Order doesn't have all the attributes,
	 * the server will be queried for them. Returns a promise that resolves when the Order has the
	 * attributes filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise}
	 */
	fill(attributes) {
		/** @type {OrderRepository} */
		const repo = IoC.make('orderRepository');
		return repo.fill([this], attributes);
	}

	/**
	 * Returns true if this Order has all the specified `attributes`.
	 * @param {string[]} attributes
	 * @return {boolean}
	 */
	hasAttributes(attributes) {
		return hasAllProperties(this, attributes);
	}
}

export default Order;
