import _ from 'lodash';
import GameInstall from './GameInstall';

/**
 * Holds all queued download.
 */
class DownloadQueue {
	/**
	 * @type {Array<GameInstall>}
	 */
	downloadQueue = [];

	/**
	 * @type {InstallRepository}
	 */
	installRepo = null;

	constructor(repo) {
		this.installRepo = repo;
	}

	/**
	 * Add game to download queue.
	 * @param {string|GameInstall} game
	 */
	enqueue(game) {
		const gameInstall = game instanceof GameInstall ? game : this.installRepo.getGameInstall(game);
		const download = this.downloadQueue.find(d => d.id === gameInstall.id);
		if (download === undefined) {
			this.downloadQueue.push(gameInstall);
			this.installRepo.toggleGameFlag(GameInstall.QUEUED, gameInstall);
		}
	}

	/**
	 * Pop the first game in download queue.
	 * @return {Promise}
	 */
	dequeue() {
		if (this.downloadQueue.length > 0) {
			return Promise.resolve(this.downloadQueue.shift());
		}
		return Promise.resolve(null);
	}

	/**
	 * push game to front of download queue.
	 * @param {string|GameInstall} game
	 */
	unshift(game) {
		const gameInstall = game instanceof GameInstall ? game : this.installRepo.getGameInstall(game);
		const download = this.downloadQueue.find(d => d.id === gameInstall.id);
		if (download === undefined) {
			this.downloadQueue.unshift(gameInstall);
			this.installRepo.toggleGameFlag(GameInstall.QUEUED, gameInstall);
		}
	}

	/**
	 * Remove download based on the id.
	 * @param {string} gameId
	 */
	remove(gameId) {
		_.remove(this.downloadQueue, download => download.id === gameId);
	}

	/**
	 * checks if id is in queue
	 * @param {*} gameId
	 */
	inQueue(gameId) {
		if (gameId !== null) return this.downloadQueue.find(download => download.id === gameId) !== undefined;

		return false;
	}
}

export default DownloadQueue;
