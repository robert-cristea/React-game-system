/**
 * Represents an error returned by a socket
 *
 * @property {string} code
 * @property {string} message
 * @property {string} userMessage
 */
class SocketError extends Error {
	static SEND_FAILED = 'sendFailed';
	static NETWORK_ERROR = 'networkError';
	static ERROR = 'error';

	/**
	 * @param {string|null} code
	 * @param {string|null} message
	 * @param {string|null} userMessage
	 */
	constructor(code = null, message = null, userMessage = null) {
		// TODO: Following line does not seem to work: the message is not displayed in the console
		super(`Socket Error (${code})${message ? `: ${message}` : ''}`);
		this.code = code;
		this.message = message;
		this.userMessage = userMessage;
	}
}

export default SocketError;
