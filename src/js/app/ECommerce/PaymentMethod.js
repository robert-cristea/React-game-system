import merge from 'lodash/merge';

/**
 * Payment method that can be saved on the server and then used to buy tokens
 */
class PaymentMethod {
	/**
	 * @property {string} id
	 */

	/**
	 * True if this payment method is saved on the server
	 * @type {boolean}
	 */
	saved = false;

	/**
	 * Update the attributes of this CreditCard with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, data);
	}

	isSaved() {
		return this.saved;
	}
}

export default PaymentMethod;
