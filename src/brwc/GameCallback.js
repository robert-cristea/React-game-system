class GameCallback {
	// This is the game id not the package id.
	id = null;

	callback = null;

	/**
	 *
	 * @param {Game.id} gameId
	 * @param {Event Callback} cb
	 */
	constructor(gameId, cb) {
		this.id = gameId;
		this.callback = cb;
	}
}

export default GameCallback;
