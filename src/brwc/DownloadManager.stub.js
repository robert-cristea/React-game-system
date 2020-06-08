import { UI_CMD, CUSTOM_CMD } from './brextdef';
import GameInstall from './GameInstall';
import InstallRepository from './InstallRepository';
import EventHandler from './EventHandler';
import DownloadQueue from './DownloadQueue';

class DownloadManager {
	/**
	 * @type {InstallRepository}
	 */
	installRepo = null;

	/**
	 * Takes care of event callbacks
	 * @type {EventHandler}
	 */
	eventHandler = null;

	/**
	 * @type {DownloadQueue}
	 */
	downloadQueue = null;

	/**
	 * @type {bool}
	 */
	inDequeue = false;

	isDownloadInProgress = false;
	isDownloadPaused = false;
	downloadProgress = 0;
	timerId = null;

	loadingTimer = null;
	loadProgress = 0;

	launchTimer = null;
	launchProgress = 0;

	stopTimer = null;
	stopProgress = 0;

	stopper() {
		if (this.stopProgress === 100) {
			clearInterval(this.stopTimer);
			this.stopTimer = null;
			this.stopProgress = 0;
			this.eventHandler.broadcast(UI_CMD.UI_CMD_QUIT, 0, 0);
			this.onQuitEvent();
		} else {
			let result = this.stopProgress + Math.floor(Math.random() * 5) + 1;
			if (result > 100) result = 100;
			this.stopProgress = result;
		}
	}

	launcher() {
		if (this.launchProgress === 100) {
			clearInterval(this.launchTimer);
			this.launchTimer = null;
			this.launchProgress = 0;
		} else {
			let result = this.launchProgress + Math.floor(Math.random() * 5) + 1;
			if (result > 100) result = 100;
			this.launchProgress = result;
		}
	}

	loader() {
		if (this.loadProgress === 100) {
			clearInterval(this.loadingTimer);
			this.loadingTimer = null;
			if (!this.timerId) {
				this.timerId = setInterval(this.timer.bind(this), 150);
			}
			this.eventHandler.broadcast(CUSTOM_CMD.UI_RESET, 0, 0);
			this.eventHandler.broadcast(UI_CMD.UI_CMD_START_TIMER, 0, 0);
			this.loadProgress = 0;
		} else {
			let result = this.loadProgress + Math.floor(Math.random() * 5) + 1;
			if (result > 100) result = 100;
			this.loadProgress = result;
		}
	}

	timer() {
		if (!this.isDownloadPaused) {
			if (this.downloadProgress === 100) {
				this.isDownloadInProgress = false;
				this.isDownloaded = true;
				clearInterval(this.timerId);
				this.checkDownloadState();
				this.downloadProgress = 0;
				this.timerId = null;
			} else {
				let result = this.downloadProgress + Math.floor(Math.random() * 3) + 1;
				if (result > 100) result = 100;
				this.downloadProgress = result;
			}
		}
	}

	constructor() {
		this.init();
	}

	/**
	 * Setup everything we need
	 */
	init() {
		this.installRepo = new InstallRepository();
		this.eventHandler = new EventHandler(this.installRepo);
		this.downloadQueue = new DownloadQueue(this.installRepo);
	}

	/**
	 * Parses all games in user's machine.
	 * @return {Promise}
	 */
	loadGames(userGames) {
		return this.installRepo.loadInstalls(userGames);
	}

	/**
	 * Cleanup
	 */
	shutdown() {}

	/**
	 * Registers the class that called to the EventHandler and returns a GameInstall object if there is one.
	 * @param {*} id
	 * @param {*} callback
	 */
	registerEventCB(id, callback) {
		this.eventHandler.registerEventCallback(id, callback);
		return this.installRepo.getGameInstall(id);
	}

	unregisterEventCB(id) {
		this.eventHandler.unregisterEventCallback(id);
	}

	// eslint-disable-next-line no-unused-vars
	doDownload(game, autoLaunch, auditMode) {
		const gameInstall = game instanceof GameInstall ? game : this.installRepo.getGameInstall(game);
		this.installRepo.setCurrentDownload(autoLaunch ? null : gameInstall);

		this.eventHandler.broadcast(CUSTOM_CMD.UI_STARTING, 0, 0);

		this.isDownloadInProgress = true;
		this.isDownloadPaused = false;

		this.installRepo.toggleGameFlag(GameInstall.INSTALLED | GameInstall.DOWNLOADING); // eslint-disable-line no-bitwise
		this.installRepo.clearGameFlag(GameInstall.QUEUED);
		this.inDequeue = false;

		if (!this.loadingTimer) {
			this.loadingTimer = setInterval(this.loader.bind(this), 150);
		}
	}

	/**
	 * Starts the download logic.
	 * @param {string|GameInstall} game
	 * @param {bool} autoLaunch
	 * @param {bool} onCompleted
	 */
	startDownload(game, autoLaunch = true) {
		if (!this.installRepo.isDownloading()) {
			this.doDownload(game, autoLaunch);
		} else if (this.installRepo.isDownloaded()) {
			this.stopDownload(null, false).then(() => {
				this.doDownload(game, autoLaunch);
			});
		} else {
			// if download is in progress push it to download queue.
			this.downloadQueue.enqueue(game);
			this.eventHandler.broadcast(CUSTOM_CMD.UI_QUEUED, 0, 0, game);
		}
	}

	/**
	 * Stops current download, if id is passed it will remove the game from the queue list.
	 * @param {string} id
	 * @param {bool} checkQueue defaults to true, which checks if there is a queue
	 * @return {Promise}
	 */
	stopDownload(id = null, checkQueue = true) {
		if (this.downloadQueue.inQueue(id)) {
			this.downloadQueue.remove(id);
		} else if (this.installRepo.isDownloading() && !this.pendingQuit) {
			// TODO: Replace mock method
			clearInterval(this.timerId);
			this.timerId = null;
			if (!this.stopTimer) {
				this.stopTimer = setInterval(this.stopper.bind(this), 150);
			}
			this.setPendingQuit(true);

			return new Promise(resolve => {
				const interval = setInterval(() => {
					if (!this.installRepo.isDownloading()) {
						this.isDownloadInProgress = false;
						this.downloadProgress = 0;

						if (checkQueue) this.checkQueuedGames();
						clearInterval(interval);
						resolve();
					}
				}, 150);
			});
		}

		return Promise.resolve();
	}

	// eslint-disable-next-line no-unused-vars
	uninstallGame(id) {
		return Promise.resolve();
	}

	/**
	 * This launches the game depending of the current state
	 * @param {string} id
	 */
	// eslint-disable-next-line no-unused-vars
	launchGame(id) {
		if (!this.launchTimer) {
			this.launchTimer = setInterval(this.launcher.bind(this), 150);
		}
	}

	/**
	 * Repairs the game.
	 * @param {string} gameId
	 */
	// eslint-disable-next-line no-unused-vars
	repairGame(gameId) {}

	setPendingQuit(flag) {
		this.pendingQuit = flag;
		this.eventHandler.broadcast(CUSTOM_CMD.UI_PENDING_QUIT, flag, 0);
		if (flag) this.eventHandler.broadcast(UI_CMD.UI_CMD_QUIT, 5, 0);
	}

	onQuitEvent() {
		this.setPendingQuit(false);
		this.installRepo.clearGameFlag(GameInstall.DOWNLOADING);
		this.installRepo.setCurrentDownload(null);

		if (this.launchInProgress) {
			this.launchProgress = 100;
			this.launchInProgress = false;
		}
	}

	checkQueuedGames() {
		if (this.inDequeue) return; // if we are waiting

		this.downloadQueue.dequeue().then(gameInstall => {
			if (gameInstall !== null) {
				this.inDequeue = true;
				this.stopDownload(null, false).then(() => {
					this.doDownload(gameInstall, false);
				});
			}
		});
	}

	getPctDone() {
		return this.downloadProgress;
	}

	getDownloadedBytes() {
		return 0;
	}

	getTotalNetworkBytes() {
		return 0;
	}

	// eslint-disable-next-line no-unused-vars
	getGameFileSize(id) {
		return 123456789;
	}

	getDownloadSpeed() {
		return 12345;
	}

	packageComplete() {
		return this.isDownloaded;
	}

	initialComplete() {
		return this.isDownloaded;
	}

	pause() {
		this.isDownloadPaused = true;
	}

	resume() {
		this.isDownloadPaused = false;
	}

	checkDownloadState() {
		if (this.installRepo.isDownloading()) {
			if (!this.installRepo.isDownloaded()) {
				let flag;
				if (this.initialComplete()) {
					flag = GameInstall.PLAYABLE;
				}
				if (this.packageComplete()) {
					flag |= GameInstall.DOWNLOADED; // eslint-disable-line no-bitwise
					this.eventHandler.broadcast(CUSTOM_CMD.UI_DOWNLOADED_COMPLETED, 0, 0);
				}
				this.installRepo.toggleGameFlag(flag);
			}

			if (this.packageComplete()) {
				this.checkQueuedGames();
			}
		}
	}

	getLaunchProgress() {
		return this.launchProgress;
	}
}

export default DownloadManager;
