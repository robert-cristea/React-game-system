import moment from 'moment';

/**
 * Token that represents a credit card that can be sent to the server as a credit card. Returned by
 * Paymentwall.requestToken()
 *
 * @property {string} value
 * @property {moment} expirationDate
 */
class CreditCardToken {
	/**
	 * Returns true if the token is expired
	 * @return {boolean}
	 */
	isExpired() {
		return this.expirationDate && this.expirationDate.diff(moment()) > 0;
	}
}

export default CreditCardToken;
