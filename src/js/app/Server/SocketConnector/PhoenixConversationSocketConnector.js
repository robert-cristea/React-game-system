/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import AbstractSocketConnector from './AbstractSocketConnector';
import SocketError from '../SocketError';

/**
 * Conversation socket for the Phoenix API. The Phoenix socket opens a single socket but uses
 * different channels. A conversation will use a single channel.
 */
class PhoenixConversationSocketConnector extends AbstractSocketConnector {
	/**
	 * @type {Socket}
	 */
	socket;
	/**
	 * @type {Conversation}
	 */
	conversation;
	/**
	 * @type {Channel}
	 */
	channel;

	channelJoined = false;

	/**
	 * @param {Conversation} conversation
	 */
	constructor(conversation) {
		super();
		this.conversation = conversation;
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
	}

	close() {
		this.leaveChannel();
	}

	/**
	 * Creates the channel and saves it in this.channel
	 */
	setupChannel() {
		this.channel = this.socket.channel(`conversation.socket/${this.conversation.id}`);
		this.channel.on('event', data => {
			this.emitData(data);
		});
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
		this.channelJoined = true;
	}

	leaveChannel() {
		if (!this.channel) {
			return;
		}

		this.channel.leave();
	}

	/**
	 * Sends the data on the channel. In case of error, emits an 'error' event.
	 * @param {*} data
	 */
	send(data) {
		this.channel
			.push('event', data)
			.receive('error', reasons => {
				const message = Array.isArray(reasons) ? reasons.join(', ') : reasons;
				this.emitError(SocketError.SEND_FAILED, message);
			})
			.receive('timeout', () => {
				this.emitError(SocketError.NETWORK_ERROR, `Timed out while pushing data (${JSON.stringify(data)})`);
			});
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

export default PhoenixConversationSocketConnector;
