// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from 'history';
// eslint-disable-next-line no-unused-vars
import { RouterStore, syncHistoryWithStore, SynchronizedHistory } from 'mobx-react-router';
import { matchPath } from 'react-router-dom';

/**
 * Class providing methods and utilities for routing. It is mainly a wrapper around react-router,
 * but also contains app specific methods.
 */
class Router {
	/**
	 * React router object
	 * @type {object}
	 */
	store = null;
	/**
	 * @type {SynchronizedHistory}
	 */
	history = null;

	init() {
		const history = createBrowserHistory();
		this.store = new RouterStore();
		this.history = syncHistoryWithStore(history, this.store);
	}

	/**
	 * @return {SynchronizedHistory}
	 */
	getHistory() {
		return this.history;
	}

	/**
	 * Accepts the same arguments as history.push()
	 * https://www.npmjs.com/package/history
	 */
	goTo() {
		// eslint-disable-next-line prefer-rest-params
		this.history.push(...arguments);
	}

	/**
	 * Returns true if the current location matches the specified `path`
	 * @param {string} path
	 * @return {bool}
	 */
	matchesPath(path) {
		return !!matchPath(this.store.location.pathname, { path });
	}

	/**
	 * Goes back n steps in the history
	 */
	goBack(n = 1) {
		this.history.go(n * -1);
	}

	/**
	 * Receives an object where the key is a path. For the first path that matches against the
	 * current path, its value is returned. If none match, the default is returned
	 * @param {object} map
	 * @param {*} defaultValue
	 * @return {*}
	 */
	switch(map, defaultValue = null) {
		const found = Object.keys(map).find(path => this.matchesPath(path));

		if (found === undefined) {
			return defaultValue;
		}

		return map[found];
	}
}

export default Router;
