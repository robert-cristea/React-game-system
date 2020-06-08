/* eslint-disable no-plusplus */
import AbstractSocketConnector from '../app/Server/SocketConnector/AbstractSocketConnector';

class MockUserUpdatesSocketConnector extends AbstractSocketConnector {
	/**
	 * @type {User}
	 * @protected
	 */
	user;

	loggingEnabled = true;

	constructor(user) {
		super();
		this.user = user;
		this.log('MockUserUpdatesSocketConnector: created');
	}

	open() {
		this.log('MockUserUpdatesSocketConnector: open');
		this.emit('open');
	}

	/**
	 * Close the socket
	 */
	close() {
		this.log('MockUserUpdatesSocketConnector: close');
	}

	log(...args) {
		if (this.loggingEnabled) {
			// eslint-disable-next-line no-console
			console.debug(...args);
		}
	}
}

export default MockUserUpdatesSocketConnector;
