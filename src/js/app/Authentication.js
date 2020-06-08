/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { observable } from 'mobx';

class Authentication {
	/**
	 * Currently authenticated user. `null` if not authenticated
	 * @type {User|null}
	 */
	user = null;

	/**
	 * Observable property that other classes can watch to know if a user is currently
	 * authenticated.
	 * @type {boolean}
	 */
	@observable
	authenticated = false;

	/**
	 * New user object created during registration.
	 * @type {object}
	 */
	@observable
	newUser = {};

	/**
	 * Count of restore password attempts
	 * @type {number}
	 */
	@observable
	restorePasswordAttempts = 0;

	login(username, password, attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		/** @type {UserRepository} */
		const userRepo = IoC.make('userRepository');

		this.invalidate();

		return server
			.login(username, password)
			.then(() => server.getAuthenticatedUser(attributes))
			.then(data => {
				this.setUser(userRepo.update(data));
				return this.user;
			});
	}

	/**
	 * Logs out the user on the server. Returns a promise that resolve or rejects based on the
	 * server response (but in any case, the user will be logged out in the app).
	 *
	 * @return {Promise<any>}
	 */
	logout() {
		this.invalidate();

		IoC.make('gameRepository').clear();
		IoC.make('conversationRepository').clear();
		IoC.make('notificationRepository').clear();
		IoC.make('orderRepository').clear();
		IoC.make('receivedFriendRequestRepository').clear();
		IoC.make('sentFriendRequestRepository').clear();
		IoC.make('userRepository').clear();

		return IoC.make('server').logout();
	}

	/**
	 * Sends a restore password request. Returns a promise that resolve or rejects based on the
	 * server response.
	 *
	 * @return {Promise<any>}
	 */
	restorePassword(email) {
		this.restorePasswordAttempts += 1;

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.restorePassword(email);
	}

	/**
	 * Set the user as the authenticated user. Set `authenticated` as true.
	 * @param {User} user
	 */
	setUser(user) {
		// IMPORTANT: order is important since `authenticated` is observable. When it changes, we
		// want `user` to be already set so code observing `authenticated` can have access to it.
		this.user = user;
		this.authenticated = true;
	}

	/**
	 * Update the newUser information.
	 * @param {User} user
	 */
	setNewUser(user) {
		this.newUser = { ...this.newUser, ...user };
	}

	/**
	 * Reloads from the server the currently authenticated user with the specified user attributes.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User>}
	 */
	reload(attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		/** @type {UserRepository} */
		const userRepo = IoC.make('userRepository');

		return server.getAuthenticatedUser(attributes).then(userData => {
			this.setUser(userRepo.update(userData));
			return this.user;
		});
	}

	/**
	 * Invalidates the current connection. Does not logout on the server, logouts internally.
	 * Updates `this.authenticated`.
	 */
	invalidate() {
		this.user = null;
		this.authenticated = false;
	}

	/**
	 * Returns the currently authenticated user
	 * @return {User}
	 */
	getUser() {
		return this.user;
	}

	/**
	 * Returns the currently registration information
	 * @return {User}
	 */
	getNewUser() {
		return this.newUser;
	}

	/**
	 * @return {boolean}
	 */
	isAuthenticated() {
		return this.authenticated;
	}
}

export default Authentication;
