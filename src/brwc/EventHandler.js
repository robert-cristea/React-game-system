import _ from 'lodash';
import GameCallback from './GameCallback';

class EventHandler {
	/**
	 * stores all links to each objects/classes that registers for event callbacks.
	 * @type {Array<GameCallback>}
	 */
	callbacks = [];

	/**
	 * @type {InstallRepository}
	 */
	installRepo = null;

	constructor(repo) {
		this.installRepo = repo;
	}

	registerEventCallback(gameId, callback) {
		let gameCallback = this.callbacks.find(cb => cb.id === gameId);
		if (gameCallback === undefined) {
			gameCallback = new GameCallback(gameId, callback);
			this.callbacks.push(gameCallback);
		}
	}

	unregisterEventCallback(gameId) {
		_.remove(this.callbacks, cb => cb.id === gameId);
	}

	/**
	 * Broadcast event to a specific registered callback.
	 * @param {UI_CMD|CUSTOM_CMD} cmdName
	 * @param {EXT_UI_CTRL} focusCtrl
	 * @param {any} baCommandData
	 * @param {string|GameInstall} gameId
	 */
	broadcast(cmdName, focusCtrl, baCommandData, gameId = null) {
		let matchedId = null;
		if (this.installRepo.isDownloading()) {
			matchedId = this.installRepo.currentDownload.id;
		}

		if (gameId !== null) {
			matchedId = typeof gameId === 'string' ? gameId : gameId.id;
		}

		if (matchedId == null) return;

		const gameCb = this.callbacks.find(gameCallback => gameCallback.id === matchedId);

		if (gameCb !== undefined) gameCb.callback(cmdName, focusCtrl, baCommandData);
	}
}

export default EventHandler;
