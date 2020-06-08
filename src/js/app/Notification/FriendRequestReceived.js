/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Notification from './Notification';

class FriendRequestReceived extends Notification {
	/**
	 * @type {string}
	 */
	fromId = null;
	/**
	 * @type {User}
	 */
	from = null;

	/**
	 * Expected format:
	 * {
	 * 	from: {
	 * 		id: string
	 * 	}
	 * }
	 * @param data
	 */
	update(data) {
		if (data.from && data.from.id) {
			this.fromId = data.from.id;
			/** @type {UserRepository} */
			const repo = IoC.make('userRepository');
			// We already set the user if already loaded
			this.from = repo.retrieve(this.fromId);
		}
	}

	/**
	 * Load the user with the attributes. Resolves with the user.
	 * @param {string} attributes
	 * @return {Promise<User>}
	 */
	loadUser(attributes) {
		if (this.from) {
			return this.from.fill(attributes);
		}

		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.load(this.fromId, attributes).then(user => {
			this.from = user;
			return user;
		});
	}
}

export default FriendRequestReceived;
