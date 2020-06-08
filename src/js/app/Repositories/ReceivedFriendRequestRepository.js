/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';
import { observable } from 'mobx';
import FriendRequest from '../FriendRequest';

class ReceivedFriendRequestRepository {
	/**
	 * Internal list of the user's friend requests
	 * @protected
	 * @type {ObservableArray<FriendRequest>}
	 */
	@observable
	friendRequests = [];

	/**
	 * Flag indicating if we loaded data at least once by calling `loadAll()`
	 * @type {boolean}
	 */
	dataLoaded = false;

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
		return server.getReceivedFriendRequests(userAttributes).then(data => {
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
	 * Returns true if this repo has a request from the specified user. Only checks in the loaded
	 * requests, will not load requests from the server.
	 *
	 * @param {User} user
	 * @return {boolean}
	 */
	hasRequestFromUser(user) {
		return this.friendRequests.findIndex(request => request.user === user) !== -1;
	}

	/**
	 * Returns the FriendRequest sent by the specified user. Only looks in the already loaded requests,
	 * does not search on the server. Returns undefined if not found.
	 *
	 * @param {User} user
	 * @return {FriendRequest}
	 */
	getRequestFromUser(user) {
		return this.friendRequests.find(request => request.user === user);
	}

	/**
	 * Accepts a friend request. It will immediately be removed from
	 * `this.friendRequests` and then the server will be called. If `doAccept` is true, the friend
	 * will also immediately be added to the user's friends. In case of error on the server,
	 * the request is put back in this.friendRequests and the added friend is removed. Returns a
	 * promise that resolves once the request is removed from the server. If `doAccept` is false,
	 * the request will be rejected (same as calling `reject()` with the same request)
	 *
	 * @param {FriendRequest} request
	 * @param {boolean} doAccept
	 * @return {Promise}
	 */
	accept(request, doAccept = true) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		/** @type {User} */
		const user = IoC.make('auth').getUser();

		// We remove the request and save it in case of error
		// If we accept the request, we add the friend and save it in case of error
		let requestRemoved = false;
		let addedFriend = null;

		if (this.friendRequests.remove(request)) {
			requestRemoved = true; // true only if it was found and removed, will stay false if not found
		}

		if (doAccept && user.addFriends(request.user)) {
			addedFriend = request.user;
		}

		/** @type {function} */
		const serverCall = doAccept ? server.approveFriendRequest : server.rejectFriendRequest;

		return serverCall.call(server, request).catch(e => {
			if (requestRemoved) {
				// In case of error, we restore the friend requests array and the added friends
				this.friendRequests.push(request);
			}

			if (addedFriend) {
				user.removeFriends(addedFriend);
			}

			return Promise.reject(e);
		});
	}

	/**
	 * Rejects a request. Calling this function is the same as calling
	 * `accept(request, false)`. See `accept()` for details.
	 *
	 * @param {FriendRequest} request
	 * @return {Promise}
	 */
	reject(request) {
		return this.accept(request, false);
	}

	/**
	 * Clear the ReceivedFriendRequestRepository. Called during `logout`.
	 */
	clear() {
		this.friendRequests = [];
	}
}

export default ReceivedFriendRequestRepository;
