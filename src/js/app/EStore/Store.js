/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Category from './Category';

class Store {
	/**
	 * @protected
	 * @type {Category}
	 */
	category = null;

	/**
	 * Updates the current category with new data.
	 *
	 * @param {object} data
	 */
	update(data) {
		if (data) {
			this.category = data;
			return Promise.resolve(data);
		}

		return Promise.reject();
	}

	/**
	 * Loads from the server the root category. Returns a Promise that resolves with the Category.
	 * Games have the requested game attributes. By default, loaded games will not be cached. Set
	 * cacheNewGames to true if you want to cache the new ones.
	 *
	 * @param {string[]} gameAttributes
	 * @param {bool} cacheNewGames
	 * @param {bool} authenticated
	 * @return {Promise<Category>}
	 */
	loadFrontPage(gameAttributes, cacheNewGames = false, authenticated = false) {
		// TODO: Temporary caching. Update with proper cache handling.
		// if (this.category) return Promise.resolve(this.category);

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server
			.getStoreFrontPage(gameAttributes, authenticated)
			.then(data => this.update(Category.create(data, cacheNewGames)));
	}
}

export default Store;
