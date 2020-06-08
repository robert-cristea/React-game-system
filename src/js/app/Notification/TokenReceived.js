/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import BigNumber from 'bignumber.js';
import Notification from './Notification';

class TokenReceived extends Notification {
	/**
	 * @type {string}
	 */
	fromId = null;
	/**
	 * @type {User}
	 */
	from = null;
	amount = new BigNumber(0);

	/**
	 * Expected format:
	 * {
	 * 	amount: number
	 * 	from: string
	 * 	content: string
	 * }
	 * @param data
	 */
	update(data) {
		if (data.amount) {
			this.amount = new BigNumber(data.amount);
		}

		if (data.content) {
			this.setMessage(data.content);
		}

		if (data.from) {
			this.fromId = data.from;
			/** @type {UserRepository} */
			const repo = IoC.make('userRepository');
			// We already set the user if already loaded
			this.from = repo.retrieve(this.fromId);
		}
	}

	isReceivedFromUser() {
		return this.fromId !== null;
	}

	/**
	 * Load the user with the attributes. Resolves with the user.
	 * @param {string} attributes
	 * @return {Promise<User>}
	 */
	loadSenderUser(attributes) {
		if (this.from) {
			return this.from.fill(attributes);
		}

		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.load(this.fromId, attributes);
	}
}

export default TokenReceived;
