import IoC from '@aedart/js-ioc/index';

/**
 * @property {string} id
 * @property {string} title
 * @property {Game[]} games
 */
class CategorySection {
	games = [];

	/**
	 * Updates the attributes of the current section with the data object. If cacheNewGames is true,
	 * the game objects it contains will be cached by the GameRepository.
	 *
	 * @param {object} data
	 * @param {bool} cacheNewGames
	 */
	update(data, cacheNewGames) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		Object.assign(this, data);

		if (data.games) {
			this.games = repo.update(data.games, cacheNewGames);
		}
	}
}

export default CategorySection;
