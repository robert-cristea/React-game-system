import { Socket } from 'phoenix-socket';
import { autorun } from 'mobx';

/**
 * Returns a function that can be passed to the socket as a logger. If `doLog` is false, null is
 * returned.
 *
 * @param {bool} doLog
 * @return {function|null}
 */
function createLogFunction(doLog) {
	if (doLog) {
		return (kind, msg, data) => {
			// eslint-disable-next-line no-console
			console.log(`${kind}: ${msg}`, data);
		};
	}

	return null;
}

/**
 * Disconnects automatically the socket when the user logs out.
 *
 * @param {Socket} socket
 * @param {IoC} iocInstance
 */
function autoCloseSocketOnLogOut(socket, iocInstance) {
	/** @type {Authentication} */
	const auth = iocInstance.make('auth');

	autorun(() => {
		if (!auth.isAuthenticated() && socket.isConnected()) {
			socket.disconnect();
		}
	});
}

/**
 * When the user logs in, we update the `params.token` that will be used next time socket.open() is
 * called.
 *
 * @param {Socket} socket
 * @param {IoC} iocInstance
 */
function updateSocketOnAuthentication(socket, iocInstance) {
	/** @type {ApiServer} */
	const server = iocInstance.make('server');
	/** @type {Authentication} */
	const auth = iocInstance.make('auth');

	autorun(() => {
		if (auth.isAuthenticated()) {
			socket.params.token = server.getAuthenticationKey();
		}
	});
}

class PhoenixSocketCreator {
	/**
	 * @param {IoC} iocInstance
	 */
	static create(iocInstance) {
		const config = iocInstance.make('config');
		/** @type {ApiServer} */
		const server = iocInstance.make('server');

		const logEnabled = config.get('phoenixSocket.logEnabled', false);
		const socket = new Socket(config.get('phoenixSocket.path'), {
			logger: createLogFunction(logEnabled),
			params: {
				token: server.getAuthenticationKey(),
			},
		});

		autoCloseSocketOnLogOut(socket, iocInstance);
		updateSocketOnAuthentication(socket, iocInstance);

		return socket;
	}
}

export default PhoenixSocketCreator;
