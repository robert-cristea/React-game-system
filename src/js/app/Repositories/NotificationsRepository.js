import { observable } from 'mobx';

/**
 * Repository to access the user's notifications. The `getNotifications()` returns an observable
 * arra of `Notification`.
 */
class NotificationRepository {
	/**
	 * Internal list of notifications
	 * @type {ObservableArray}
	 */
	@observable
	notifications = [];

	getNotifications() {
		return this.notifications;
	}

	clear() {
		this.notifications.clear();
	}

	remove(notification) {
		this.notifications.remove(notification);
	}

	add(notification) {
		this.notifications.push(notification);
	}
}

export default NotificationRepository;
