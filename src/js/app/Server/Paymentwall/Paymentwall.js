/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import moment from 'moment';
import get from 'lodash/get';
import pick from 'lodash/pick';
import CreditCardToken from '../../ECommerce/CreditCardToken';
import PaymentwallError, { TYPES as ERROR_TYPES } from './PaymentwallError';

/**
 * Class used to request a credit card token from Paymentwall
 */
class Paymentwall {
	/**
	 * Requests Paymentwall a unique token for the specified credit card. Returns a promise that resolves with the token
	 * data. If an error occured, rejects with an error.
	 *
	 * @param {{
	 *     number: {string} credit card number without spaces (ex: "4123456789101112"),
	 *     expirationMonth: {string} 2 numbers month (ex: "02"),
	 *     expirationYear: {string} full year (ex: "2025"),
	 *     cvv: {string},
	 * }} cardData
	 * @return {Promise<CreditCardToken>}
	 */
	requestToken(cardData) {
		return this.doRequest({
			'card[number]': cardData.number,
			'card[exp_month]': cardData.expirationMonth,
			'card[exp_year]': cardData.expirationYear,
			'card[cvv]': cardData.cvv,
		}).then(tokenData => {
			const cardToken = new CreditCardToken();
			cardToken.value = tokenData.token;
			cardToken.expirationDate = moment().add(tokenData.expires_in, 's');
			return cardToken;
		});
	}

	/**
	 * Does the actual request. Returns an object containing data about the token
	 *
	 * @param {Object} params POST params to send in the request
	 * @return {Promise<object>}
	 */
	doRequest(params) {
		const config = IoC.make('config');
		const url = config.get('paymentwall.url');
		const publicKey = config.get('paymentwall.publicKey');

		const body = new FormData();
		Object.entries(params).forEach(([key, value]) => {
			body.append(key, value);
		});
		body.append('public_key', publicKey);

		const request = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body,
		};

		return (
			fetch(url, request)
				// 1. Check if we were simply not able to connect to the server
				.catch(e => {
					if (e instanceof TypeError) {
						return Promise.reject(new PaymentwallError(ERROR_TYPES.NETWORK, e.message));
					}

					return Promise.reject(e);
				})
				// 3. Parse JSON
				.then(response => response.json())
				// 4. If JSON parsing failed
				.catch(e => {
					// Invalid JSON
					if (e instanceof SyntaxError) {
						return Promise.reject(new PaymentwallError(ERROR_TYPES.SERVER, e.message));
					}

					return Promise.reject(e);
				})
				.then(json => this.validateResponseBody(json))
				.then(data => this.getTokenData(data))
		);
	}

	validateResponseBody(data) {
		const type = get(data, 'type');

		if (type !== 'token' && type !== 'Error') {
			throw new PaymentwallError(ERROR_TYPES.SERVER, '`type` attribute not found or invalid');
		}

		if (type === 'Error') {
			const code = get(data, 'code', '[no code]');
			const message = get(data, 'error', '[no message]');
			throw new PaymentwallError(ERROR_TYPES.RESPONSE, `${message} (${code})`);
		}

		return data;
	}

	getTokenData(data) {
		return pick(data, ['token', 'expires_in']);
	}
}

export default Paymentwall;
