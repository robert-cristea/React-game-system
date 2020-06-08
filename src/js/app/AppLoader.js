/** @type {IoC} */
import IoC from '@aedart/js-ioc';

/**
 * Class responsible to load all data required for the app to start.
 */
class AppLoader {
	loadingPromise = null;

	/**
	 * Starts the loading process and returns a Promise that resolves when all required data is
	 * loaded. Calling this method again will only return the same promise object.
	 * @return {Promise}
	 */
	load() {
		if (this.loadingPromise === null) {
			this.loadingPromise = this.loadServer().then(() => this.tryReauthentication());
		}

		return this.loadingPromise;
	}

	/**
	 * Tells the server to load
	 */
	loadServer() {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.load();
	}

	/**
	 * Tries to recreate the last authentication session. Returns a promise that resolves after the
	 * try. If authentication fails, the promise will still resolve.
	 * @return {Promise}
	 */
	tryReauthentication() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		/** @type {Config} */
		const config = IoC.make('config');

		return auth.reload(config.get('auth.user.baseAttributes', [])).catch(() => {
			// Do nothing
		});
	}
}

export default AppLoader;
