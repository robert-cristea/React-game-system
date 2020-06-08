export const TYPES = {
	UNKNOWN: 'unknown',
	NETWORK: 'network',
	REQUEST: 'request',
	RESPONSE: 'response',
	SERVER: 'server',
};

class PaymentwallError extends Error {
	type = TYPES.UNKNOWN;
	code: -1;

	constructor(type, message, code) {
		super(message);
		this.type = type;
		this.code = code;
	}
}

export default PaymentwallError;
