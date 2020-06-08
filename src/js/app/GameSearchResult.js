/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';

/**
 * @property {{page: number, hasNext: boolean}} pagination
 * @property {Game[]} games
 */
class GameSearchResult {
	/**
	 * @type {Game[]}
	 */
	games = [];

	/**
	 * Updates this instance with the serialized `data` object. If `cacheNewGames` is true, new
	 * games will be cached in the GameRepository.
	 *
	 * @param {object} data
	 * @param {boolean} cacheNewGames
	 */
	update(data, cacheNewGames = false) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		Object.assign(this, data);

		if (data) {
			this.games = repo.update(data, cacheNewGames);
		}
	}
}

export default GameSearchResult;
