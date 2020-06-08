import merge from 'lodash/merge';
import { generateRef } from '../utils';

/**
 * @property {string} id
 * @property {string} type
 * @property {string} ref Internal unique reference number
 */
class AbstractCartItem {
	constructor() {
		this.ref = generateRef();
	}

	/**
	 * Updates this item with the serialized object
	 * @param {object} data
	 */
	update(data) {
		merge(this, data);
	}

	/**
	 * Returns the price of this item as a BigNumber
	 * @return {BigNumber}
	 */
	getPrice() {}

	/**
	 * Returns a serialized version of this instance
	 *
	 * @return {object}
	 */
	serialize() {
		return {
			id: this.id,
			type: this.type,
		};
	}
}

export default AbstractCartItem;
