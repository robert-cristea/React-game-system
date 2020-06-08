/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { autorun } from 'mobx';
import UserUpdatesSocket from './Server/UserUpdatesSocket';
import TokenReceived from './Notification/TokenReceived';
import FriendRequestReceived from './Notification/FriendRequestReceived';
import FriendRequestAccepted from './Notification/FriendRequestAccepted';

/**
 * Class that listens to the user updates sockets and creates notifications in the
 * NotificationRepository for some events. Also clears the notifications when the user logs out.
 */
class NotificationsLiveUpdater {
	idCounter = 0;

	start() {
		this.clearOnLogOut();
		this.listenToSocket();
	}

	clearOnLogOut() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		const repo = IoC.make('notificationRepository');

		autorun(() => {
			// When the user logs out, we stop listening to the user updates socket
			if (!auth.isAuthenticated()) {
				repo.clear();
			}
		});
	}

	listenToSocket() {
		const socket = IoC.make('userUpdatesSocket');
		const repo = IoC.make('notificationRepository');

		socket.on('event', event => {
			if (this.shouldMakeNotification(event)) {
				const notification = this.createNotification(event);
				if (notification) {
					repo.add(notification);
				}
			}
		});
	}

	shouldMakeNotification(event) {
		return (
			[
				UserUpdatesSocket.EVENTS.TOKEN_RECEIVED,
				UserUpdatesSocket.EVENTS.FRIENDSHIP_ACCEPTED,
				UserUpdatesSocket.EVENTS.FRIENDSHIP_RECEIVED,
			].indexOf(event.type) >= 0
		);
	}

	createNotification(event) {
		let notification = null;

		switch (event.type) {
			case UserUpdatesSocket.EVENTS.TOKEN_RECEIVED:
				notification = new TokenReceived();
				break;
			case UserUpdatesSocket.EVENTS.FRIENDSHIP_ACCEPTED:
				notification = new FriendRequestAccepted();
				break;
			case UserUpdatesSocket.EVENTS.FRIENDSHIP_RECEIVED:
				notification = new FriendRequestReceived();
				break;
			default:
				return null;
		}

		notification.update(event.data);
		// eslint-disable-next-line no-plusplus
		notification.id = `n_${this.idCounter++}`;
		return notification;
	}
}

export default NotificationsLiveUpdater;
