/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import UserUpdatesSocket from './Server/UserUpdatesSocket';

/**
 * Class that listens to the user updates sockets and updates user data based on the events received
 */
class UserDataLiveUpdater {
	start() {
		this.listenToSocket();
	}

	listenToSocket() {
		const socket = IoC.make('userUpdatesSocket');
		socket.on('event', event => {
			this.handleEvent(event);
		});
	}

	handleEvent(event) {
		const auth = IoC.make('auth');

		if (!auth.isAuthenticated()) {
			return;
		}

		if (event.type === UserUpdatesSocket.EVENTS.TOKEN_RECEIVED) {
			this.updateTokensBalance();
		}

		if (event.type === UserUpdatesSocket.EVENTS.FRIENDSHIP_RECEIVED) {
			this.updateReceivedFriendRequests();
		}

		if (event.type === UserUpdatesSocket.EVENTS.FRIENDSHIP_ACCEPTED) {
			this.updateSentFriendRequests();
			this.updateFriends();
		}
	}

	updateTokensBalance() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		// We update from the server instead of adding to the user's tokenBalance to be sure to
		// show the real amount
		auth.getUser().fill(['id', 'tokenBalance'], true);
	}

	updateReceivedFriendRequests() {
		/** @type {ReceivedFriendRequestRepository} */
		const repo = IoC.make('receivedFriendRequestRepository');
		repo.loadAll(['id'], true);
	}

	updateSentFriendRequests() {
		/** @type {SentFriendRequestRepository} */
		const repo = IoC.make('sentFriendRequestRepository');
		repo.loadAll(['id'], true);
	}

	updateFriends() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		auth.getUser().loadFriends(['id'], true);
	}
}

export default UserDataLiveUpdater;
