/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Game from '../Game';
import GameSearchResult from '../GameSearchResult';

class GameRepository {
	/**
	 * @protected
	 * @type {Map<string, Game>}
	 */
	games = new Map();

	/**
	 * Loads a specific game from the server by its id. Returns a
	 * Promise that resolves with the Game instance. The game will be filled with the
	 * specified `attributes`.
	 *
	 * @param {string} id
	 * @param {string[]} attributes
	 * @param {boolean} authenticated
	 * @return {Promise<Game>}
	 */
	load(id, attributes, authenticated = false) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getGame(id, attributes, authenticated).then(data => this.update(data));
	}

	/**
	 * From an array of serialized game objects, update the internal games list. If a game already
	 * exists, it will be updated, else a new Game will be created. The list of updated game
	 * instances will be returned in the same order. `data` can also be a single serialized game
	 * object; in that case, the updated game will be returned. If the `cacheNew` parameter is false,
	 * new game objects will not be saved (cached) internally (already cached games will still be
	 * cached and updated).
	 *
	 * @param {Object[]|Object} data
	 * @param {bool} cacheNew
	 * @return {Game[]|Game}
	 */
	update(data, cacheNew = true) {
		if (!Array.isArray(data)) {
			return this.update([data], cacheNew)[0];
		}

		const updated = [];

		data.forEach(gameData => {
			const id = gameData.id;
			const isNewGame = !this.games.has(id);
			/** @type {Game} */
			const game = isNewGame ? new Game() : this.games.get(id);

			if (isNewGame && cacheNew === true) {
				this.games.set(id, game);
			}

			game.update(gameData);
			updated.push(game);
		});

		return updated;
	}

	/**
	 * Fills all the specified games with the requested attributes. If one or more game don't have
	 * all the attributes, the server is used to get the missing attributes. Returns promise that
	 * resolves with the game instances when they are all filled.
	 *
	 * @param {Game[]} games
	 * @param {string[]} attributes
	 * @return {Promise<Game[]>}
	 */
	fill(games, attributes, authenticated = false) {
		const incomplete = games.filter(game => !game.hasAttributes(attributes));
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		// All games have the requested attributes
		if (!incomplete.length) {
			return Promise.resolve(games);
		}

		const incompleteIds = incomplete.map(game => game.id);

		return server.getGames(incompleteIds, attributes, authenticated).then(gamesData => {
			this.update(gamesData.entries);
		});
	}

	/**
	 * Retrieves from the list of already loaded games the one with the specified id. Returns null
	 * if not found.
	 *
	 * @param {string} id
	 * @return {Game|null}
	 */
	retrieve(id) {
		return this.games.has(id) ? this.games.get(id) : null;
	}

	/**
	 * Searches on the server for user with the specified query. Returned games will be filled with
	 * the specified attributes. If `cacheNew` is false, returned games will not be cached. Returns a Promise that resolves with a UserSearchResult.
	 *
	 * @param {string} query
	 * @param {string[]} attributes
	 * @param {boolean} authenticated
	 * @param {number} page Page number
	 * @param {boolean} cacheNew
	 * @return {Promise<GameSearchResult>}
	 */
	search(query, attributes, authenticated, page = 1, cacheNew = false) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.searchGames(query, attributes, authenticated, page).then(games => {
			const result = new GameSearchResult();
			result.update(games.entries, cacheNew);
			return result;
		});
	}

	/**
	 * Clear the GameRepository. Called during `logout`.
	 */
	clear() {
		this.games.clear();
	}
}

export default GameRepository;
