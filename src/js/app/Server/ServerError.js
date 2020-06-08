/**
 * Represents an error returned by the server
 *
 * @property {string} code
 * @property {string} message
 * @property {string} userMessage
 */
class ServerError extends Error {
	static SERVER_ERROR = 'server.error';
	static NOT_FOUND = 'request.notFound';
	static INVALID_RESPONSE = 'response.invalid';
	static NETWORK_ERROR = 'request.networkError';
	static UNKNOWN_ERROR = 'unknown';
	static NOT_AUTHENTICATED = 'auth.notAuthenticated';
	static INVALID_TOKEN = 'auth.invalidToken';
	static AUTH_FAILED = 'auth.failed';
	static AUTH_DENIED = 'auth.denied';
	static RESTORE_FAILED = 'restore.failed';
	static RESTORE_LIMIT_REACHED = 'restore.limitReached';

	/**
	 * @param {string|null} code
	 * @param {string|null} message
	 */
	constructor(code = null, message = null) {
		super(message || code);
		this.code = code;
	}

	/**
	 * Returns true if this error is the same error code.
	 * @param {string} code
	 */
	is(code) {
		return this.code === code;
	}
}

export default ServerError;
