/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import AbstractSocketConnector from './AbstractSocketConnector';
import SocketError from '../SocketError';
import UserUpdatesSocket from '../UserUpdatesSocket';

/**
 * User updates socket connector for the Phoenix API. Opens a socket to the specified user's
 * updates channel. This channel is read only, so `send()` does nothing.
 */
class PhoenixUserUpdatesSocketConnector extends AbstractSocketConnector {
	/**
	 * @type {Socket}
	 */
	socket;
	/**
	 * @type {User}
	 */
	user;

	listenersRef = [];

	/**
	 * @param {User} user
	 */
	constructor(user) {
		super();
		this.user = user;
		this.socket = IoC.make('phoenixSocket');
		this.setupChannel();
	}

	/**
	 * Open the socket if not already opened then joins the channel.
	 */
	open() {
		if (!this.socket.isConnected()) {
			this.socket.connect();
		}

		this.joinChannel();
		this.setupListeners();
	}

	close() {
		this.clearListeners();
		this.leaveChannel();
	}

	/**
	 * Creates the channel and saves it in this.channel
	 */
	setupChannel() {
		this.channel = this.socket.channel(`user.socket/${this.user.id}`);
	}

	send() {
		// Do nothing, read only
	}

	/**
	 * Joins the channel and adds error listeners on it.
	 */
	joinChannel() {
		if (this.channelJoined) {
			this.channel.rejoin();
			return;
		}

		this.channel
			.join()
			.receive('error', reasons => {
				const message = Array.isArray(reasons) ? reasons.join(', ') : reasons;
				this.emitError(SocketError.ERROR, message);
			})
			.receive('timeout', () => {
				this.emitError(SocketError.NETWORK_ERROR, 'Timed out while joining the channel');
			});
	}

	setupListeners() {
		const channelEvents = Object.values(UserUpdatesSocket.EVENTS);

		channelEvents.forEach(eventName => {
			const ref = this.channel.on(eventName, data => {
				const event = {
					type: eventName,
					data,
				};

				this.emitData(event);
			});

			this.listenersRef.push({
				type: eventName,
				ref,
			});
		});

		this.channelJoined = true;
	}

	leaveChannel() {
		if (!this.channel) {
			return;
		}

		this.channel.leave();
	}

	clearListeners() {
		this.listenersRef.forEach(({ eventName, ref }) => {
			this.channel.off(eventName, ref);
		});

		this.listenersRef = [];
	}

	/**
	 * Emits the 'error' event with a SocketError filled with the specified code and message.
	 *
	 * @param {string} code
	 * @param {string} message
	 */
	emitError(code, message) {
		this.emit(AbstractSocketConnector.EVENT_ERROR, new SocketError(code, message));
	}

	/**
	 * Emits the 'data' event with the received data.
	 *
	 * @param {*} data
	 */
	emitData(data) {
		this.emit(AbstractSocketConnector.EVENT_DATA, data);
	}
}

export default PhoenixUserUpdatesSocketConnector;
