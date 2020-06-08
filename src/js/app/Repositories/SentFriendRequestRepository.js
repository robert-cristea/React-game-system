/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';
import { observable } from 'mobx';
import moment from 'moment';
import FriendRequest from '../FriendRequest';

class SentFriendRequestRepository {
	/**
	 * Internal list of the user's friend requests
	 * @protected
	 * @type {ObservableArray<FriendRequest>}
	 */
	@observable
	friendRequests = [];

	nextId = 0;

	/**
	 * Returns a promise that resolves will all the current user's friend requests
	 *
	 * @param {string[]} userAttributes
	 * @param {boolean} forceReload
	 * @return {Promise<ObservableArray<FriendRequest>>}
	 */
	loadAll(userAttributes, forceReload = true) {
		if (this.dataLoaded && !forceReload) {
			return this.fillUsers(userAttributes).then(() => this.friendRequests);
		}

		this.dataLoaded = false;
		this.friendRequests.clear();

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getSentFriendRequests(userAttributes).then(data => {
			this.dataLoaded = true;
			return this.replace(data);
		});
	}

	/**
	 * Replace the friend requests in this.friendRequests with the ones in the data. They will be
	 * added in the same order as the data.
	 *
	 * @param {object[]} friendRequestsData
	 * @return {ObservableArray<FriendRequest>} The updated value of this.friendRequests
	 */
	replace(friendRequestsData) {
		const newFriendRequests = [];

		friendRequestsData.forEach(friendRequestData => {
			const id = friendRequestData.id;
			/** @type {FriendRequest} */
			const friendRequest = this.retrieve(id) || new FriendRequest();
			friendRequest.update(friendRequestData);
			newFriendRequests.push(friendRequest);
		});

		this.friendRequests.replace(newFriendRequests);
		return this.friendRequests;
	}

	/**
	 * Fills all users of all currently loaded friend requests with the specified `attributes`.
	 * Returns a Promise that resolves with the users once they are all filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User[]>}
	 */
	fillUsers(attributes) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		const users = this.friendRequests.map(/** @type {FriendRequest} */ request => request.user);
		return repo.fill(users, attributes);
	}

	/**
	 * Returns the friend request instance with the specified id from the list of already loaded
	 * friend requests. If it is not found, returns undefined (this method doesn't query the
	 * server).
	 *
	 * @param {string} id
	 * @return {Conversation|undefined}
	 */
	retrieve(id) {
		return this.friendRequests.find(c => c.id === id);
	}

	/**
	 * Returns the observable `friendRequests` array. This array can be used even before the
	 * friend requests are loaded (will be empty). It is observable and will be filled once the
	 * friend requests are loaded.
	 *
	 * @return {ObservableArray<FriendRequest>}
	 */
	getFriendRequests() {
		return this.friendRequests;
	}

	/**
	 * Returns true if this repo has a request for the specified user. Only checks in the loaded
	 * requests, will not load requests from the server.
	 *
	 * @param {User} user
	 * @return {boolean}
	 */
	hasRequestForUser(user) {
		return this.friendRequests.findIndex(request => request.user === user) !== -1;
	}

	/**
	 * Returns the FriendRequest sent to the specified user. Only looks in the already loaded requests,
	 * does not search on the server. Returns undefined if not found.
	 *
	 * @param {User} user
	 * @return {FriendRequest}
	 */
	getRequestForUser(user) {
		return this.friendRequests.find(request => request.user === user);
	}

	/**
	 * Sends a friend request to the specified user. It will immediately be added to
	 * `this.friendRequests` and then the server will be called. In case of error on the server,
	 * the request is removed from this.friendRequests. Returns a promise that resolves once the
	 * request is sent on the server.
	 *
	 * @param {User} user
	 */
	invite(user) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		const request = new FriendRequest();
		// eslint-disable-next-line no-plusplus
		request.id = `_app-temp_${this.nextId++}`;
		request.user = user;
		request.date = moment();

		this.friendRequests.push(request);

		return server
			.inviteUser(user)
			.then(newId => {
				request.id = newId;
			})
			.catch(e => {
				this.friendRequests.remove(request);
				return Promise.reject(e);
			});
	}

	/**
	 * Cancels on the server a sent friend ship invitation. Will be immediately removed from
	 * `friendShipRequests`. Return a promise that resolves once the invitation was removed. If an
	 * error occurs on the server, we re-add it to `friendShipRequests`.
	 *
	 * @param {FriendRequest} request
	 * @return {Promise}
	 */
	cancel(request) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		// We remove the request and save it in case of error
		// If we accept the request, we add the friend and save it in case of error
		let requestRemoved = false;

		if (this.friendRequests.remove(request)) {
			requestRemoved = true; // true only if it was found and removed, will stay false if not found
		}

		return server.cancelSentFriendRequest(request).catch(e => {
			if (requestRemoved) {
				// In case of error, we restore the friend requests array and the added friends
				this.friendRequests.push(request);
			}

			return Promise.reject(e);
		});
	}

	/**
	 * Clear the SentFriendRequestRepository. Called during `logout`.
	 */
	clear() {
		this.friendRequests = [];
	}
}

export default SentFriendRequestRepository;
