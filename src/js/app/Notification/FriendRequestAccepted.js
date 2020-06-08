/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Notification from './Notification';

class FriendRequestAccepted extends Notification {
	/**
	 * @type {string}
	 */
	toId = null;
	/**
	 * @type {User}
	 */
	to = null;

	/**
	 * Expected format:
	 * {
	 * 	to: {
	 * 		id: string
	 * 	}
	 * }
	 * @param data
	 */
	update(data) {
		if (data.to && data.to.id) {
			this.toId = data.to.id;
			/** @type {UserRepository} */
			const repo = IoC.make('userRepository');
			// We already set the user if already loaded
			this.to = repo.retrieve(this.toId);
		}
	}

	/**
	 * Load the user with the attributes. Resolves with the user.
	 * @param {string} attributes
	 * @return {Promise<User>}
	 */
	loadUser(attributes) {
		if (this.to) {
			return this.to.fill(attributes);
		}

		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.load(this.toId, attributes).then(user => {
			this.to = user;
			return user;
		});
	}
}

export default FriendRequestAccepted;
