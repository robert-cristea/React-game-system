import EventEmitter from 'wolfy87-eventemitter';
import AbstractSocketConnector from './SocketConnector/AbstractSocketConnector';

/**
 * Class that listens to a user updates socket connector. When new
 * updates are received on socket, will create a new `UserUpdateEvent` instance and emit it.
 */
class UserUpdatesSocket extends EventEmitter {
	static EVENTS = {
		FRIENDSHIP_RECEIVED: 'friendship_request:received',
		FRIENDSHIP_ACCEPTED: 'friendship_request:accepted',
		TOKEN_RECEIVED: 'token:received',
	};

	/**
	 * @type {AbstractSocketConnector}
	 */
	connector = null;

	/**
	 * @param {AbstractSocketConnector} connector
	 */
	setConnector(connector) {
		if (this.connector !== connector) {
			this.stopListening();
		}
		this.connector = connector;
	}

	startListening() {
		this.setListeners();
		this.connector.open();
	}

	stopListening() {
		if (this.connector) {
			this.connector.close();
			this.clearListeners();
		}
	}

	clearListeners() {
		this.connector.off(AbstractSocketConnector.EVENT_DATA, this.handleConnectorData);
		this.connector.off(AbstractSocketConnector.EVENT_ERROR, this.handleConnectorError);
	}

	setListeners() {
		this.connector.on(AbstractSocketConnector.EVENT_DATA, this.handleConnectorData);
		this.connector.on(AbstractSocketConnector.EVENT_ERROR, this.handleConnectorError);
	}

	handleConnectorData = data => {
		this.emit('event', data);
	};

	handleConnectorError = error => {
		// eslint-disable-next-line no-console
		console.error('UserUpdatesSocket, error received:', error);
	};
}

export default UserUpdatesSocket;
