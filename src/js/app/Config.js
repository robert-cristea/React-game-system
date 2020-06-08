import lodashGet from 'lodash/get';

/**
 * Simple class to access a config object
 */
class Config {
	/**
	 * @protected
	 * @type {{}}
	 */
	config = {};

	constructor(config = {}) {
		this.config = config;
	}

	/**
	 * Returns the config at `path`. `path` is the path to the attribute. Example: 'api.server.url'. If not found, defaultValue is returned.
	 *
	 * @param {string} path
	 * @param {*} defaultValue
	 * @return {*}
	 */
	get(path, defaultValue = undefined) {
		return lodashGet(this.config, path, defaultValue);
	}
}

export default Config;
