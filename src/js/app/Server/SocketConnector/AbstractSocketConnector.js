/* eslint-disable no-unused-vars */
import EventEmitter from 'wolfy87-eventemitter';

/**
 * Implementation should emit the following events:
 * - 'data' when data is received with the data object
 * - 'error' when an error occurs with a SocketError instance
 */
class AbstractSocketConnector extends EventEmitter {
	static EVENT_DATA = 'data';
	static EVENT_ERROR = 'error';

	/**
	 * Open the socket
	 */
	open() {}

	/**
	 * Send the data on the socket. Data must be ready for JSON encoding. If an error occurs, should emit the 'error' event.
	 * @param {*} data
	 */
	send(data) {}

	/**
	 * Close the socket
	 */
	close() {}
}

export default AbstractSocketConnector;
