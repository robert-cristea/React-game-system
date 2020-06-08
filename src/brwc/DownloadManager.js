import { remote as electronRemote } from 'electron';
import NBRExtPIpe from './ebrextpipe';
import { UI_CMD, EXT_UI_CTRL, CUSTOM_CMD, AUDIT_MODE, STAGE } from './brextdef';
import { waitForAppExit, launchProcAsync, launchDirectAsync } from './ProcessUtils';
import GameInstall from './GameInstall';
import InstallRepository from './InstallRepository';
import EventHandler from './EventHandler';
import DownloadQueue from './DownloadQueue';
import { formatFileSize } from '../js/app/utils';

class DownloadManager {
	static TIMER_TIMEOUT = 10000;
	static REPAIR_TIMEOUT = 15000;

	/**
	 * @type {NBRExtPIpe}
	 */
	extpipeObj = null;

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

	/**
	 * This tells us that streaming or download is ready. Initially BRWC will do initialization and audit before
	 * it can safely resume streaming.
	 * @type {boolean}
	 */
	resumeDownload = false;

	pendingQuit = false;

	isPaused = false;

	launchInProgress = false;

	launchProgress = 0;

	currentStage = 0;

	timeoutTimer = null;

	startTime = 0;

	constructor() {
		this.init();
	}

	/**
	 * Setup everything we need
	 */
	init() {
		if (process.env.NODE_ENV === 'production') {
			const { app } = electronRemote;
			app.on('before-quit', () => {
				// NOTE: need a class that will check first if an ongoing download/stream is happening.
				this.shutdown();
			});
		}

		this.installRepo = new InstallRepository();
		this.eventHandler = new EventHandler(this.installRepo);
		this.downloadQueue = new DownloadQueue(this.installRepo);

		this.extpipeObj = new NBRExtPIpe();
		this.extpipeObj.Initialize(this.logCallback, this.eventCallback);
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
	shutdown() {
		this.stopDownload(null, false);
		this.extpipeObj.Shutdown();
	}

	// eslint-disable-next-line no-unused-vars
	logCallback = logMsg => {};

	eventCallback = (cmdName, focusCtrl, baCommandData) => {
		this.eventHandler.broadcast(cmdName, focusCtrl, baCommandData);

		switch (cmdName) {
			case UI_CMD.UI_CMD_QUIT:
			case UI_CMD.UI_CMD_QUITONLAUNCH:
				if (focusCtrl === 0) {
					// there are two quit events passed, we need to catch the main one.
					this.onQuitEvent();
				} else if (focusCtrl === 5) {
					this.setPendingQuit(true);
				}

				this.resumeDownload = false;
				break;
			case UI_CMD.UI_CMD_ENABLECTRL:
				if (focusCtrl === EXT_UI_CTRL.extern_RELAUNCHBTN || focusCtrl === CUSTOM_CMD.UI_CTRL_RELAUNCH) {
					this.installRepo.toggleGameFlag(GameInstall.PLAYABLE);
				} else if (focusCtrl === EXT_UI_CTRL.extern_PAUSEBTN || focusCtrl === EXT_UI_CTRL.extern_REPAIRBTN) {
					// there are two quit events passed, we need to catch the main one.
					this.repairInitiated = false; // make sure this is set to false.
					this.checkDownloadState();
					this.eventHandler.broadcast(CUSTOM_CMD.UI_RESET, 0, 0);
				}
				break;
			case UI_CMD.UI_CMD_DISABLECTRL:
				this.checkDownloadState();
				break;
			case UI_CMD.UI_CMD_HEARTBEAT:
				this.extpipeObj.UIHeartbeat();
				break;
			default:
				break;
		}

		this.checkLaunchProgress();

		// reset the timeout timer.
		this.resetTimeoutTImer();
	};

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

	setTimeoutTimer(timeout = DownloadManager.TIMER_TIMEOUT) {
		this.startTime = new Date().getTime();
		this.timeoutTimer = setTimeout(() => {
			this.eventHandler.broadcast(CUSTOM_CMD.UI_CMD_QUIT, 0, 0);
			this.onQuitEvent();
		}, timeout);
	}

	resetTimeoutTImer() {
		if (this.timeoutTimer === null) return;

		const curTime = new Date().getTime();
		if (curTime - this.startTime > 3000) {
			clearTimeout(this.timeoutTimer);
			this.setTimeoutTimer(this.repairInitiated ? DownloadManager.REPAIR_TIMEOUT : DownloadManager.TIMER_TIMEOUT);
			this.extpipeObj.UIHeartbeat();
		}
	}

	/**
	 *
	 * @param {string|GameInstall} game
	 * @param {bool} autoLaunch
	 * @param {bool} auditMode
	 */
	doDownload(game, autoLaunch, auditMode = AUDIT_MODE.MODE_AUDIT_NONE) {
		const gameInstall = game instanceof GameInstall ? game : this.installRepo.getGameInstall(game);

		if (gameInstall.bitraiderId === null) return;

		this.installRepo.setCurrentDownload(autoLaunch ? null : gameInstall);
		this.eventHandler.broadcast(CUSTOM_CMD.UI_STARTING, 0, 0);

		const gameID = gameInstall.bitraiderId;
		const installPath = gameInstall.installPath;
		const parameters = [
			`id=${gameID}`,
			'-brnouinoexit',
			`${autoLaunch ? '' : '-brnolaunch'}`,
			`${auditMode === AUDIT_MODE.MODE_AUDIT_NONE ? '' : `brauditonly=${auditMode}`}`,
			`brdestpath=${installPath}`,
		];
		launchProcAsync('brwc/BRWC.exe', parameters)
			.then(() => {
				this.setTimeoutTimer(
					auditMode === AUDIT_MODE.MODE_AUDIT_NONE ? DownloadManager.TIMER_TIMEOUT : DownloadManager.REPAIR_TIMEOUT,
				);
				this.installRepo.toggleGameFlag(GameInstall.INSTALLED | GameInstall.DOWNLOADING); // eslint-disable-line no-bitwise
				this.installRepo.clearGameFlag(GameInstall.QUEUED);
				this.inDequeue = false;
			})
			.catch(() => {
				this.eventHandler.broadcast(CUSTOM_CMD.UI_CMD_QUIT, 0, 0);
				this.onQuitEvent();
			});
	}

	/**
	 * Starts the download logic.
	 * @param {string|GameInstall} game
	 * @param {bool} autoLaunch
	 */
	startDownload(game, autoLaunch = true) {
		const gameInstall = game instanceof GameInstall ? game : this.installRepo.getGameInstall(game);
		if (gameInstall === undefined || gameInstall.bitraiderId === null) {
			// eslint-disable-next-line no-console
			console.warn(`can't get GameInstall object. Please check the server response..`);
			return false;
		}

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

		return true;
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
			this.extpipeObj.Quit();
			this.setPendingQuit(true);
			return new Promise(resolve => {
				const interval = setInterval(() => {
					if (!this.installRepo.isDownloading()) {
						if (checkQueue) this.checkQueuedGames();
						clearInterval(interval);
						resolve();
					}
				}, 150);
			});
		}

		return Promise.resolve();
	}

	uninstallGame(id) {
		let retPromise = null;
		if (!this.installRepo.isDownloading()) {
			retPromise = this.internalUninstallGame(id);
		} else {
			const currentId = this.installRepo.currentDownload.id;
			retPromise = new Promise((resolve, reject) => {
				this.stopDownload(null, false).then(() => {
					this.downloadQueue.unshift(currentId);
					this.eventHandler.broadcast(CUSTOM_CMD.UI_QUEUED, 0, 0, currentId);
					this.internalUninstallGame(id)
						.then(() => {
							resolve();
						})
						.catch(() => {
							reject();
						});
				});
			});
		}
		return retPromise;
	}

	internalUninstallGame(id) {
		const gameInstall = this.installRepo.getGameInstall(id);
		if (gameInstall === undefined || gameInstall.bitraiderId === null) return Promise.resolve();

		const parameters = [`id=${gameInstall.bitraiderId}`, `-brusethiscopy`, `-bruninstall`];
		return new Promise((resolve, reject) => {
			launchProcAsync('brwc/BRWC.exe', parameters)
				.then(() => {
					waitForAppExit('BRWC.exe', () => {
						if (!this.installRepo.scanIfInstalled(gameInstall)) {
							gameInstall.state = GameInstall.UNKNOWN;
							resolve();
						} else {
							reject();
						}
						this.checkQueuedGames();
					});
				})
				.catch(() => {
					reject();
				});
		});
	}

	launchGameDirect(gameInstall) {
		launchDirectAsync(gameInstall.installPath, gameInstall.gameExe, [])
			.then(stdout => {
				// eslint-disable-next-line no-console
				console.log(stdout);
			})
			.catch(e => {
				// eslint-disable-next-line no-console
				console.error(e);
			});
		this.launchProgress = 100;
		this.launchInProgress = false;
	}

	/**
	 * This launches the game depending of the current state
	 * @param {string} id
	 */
	launchGame(id) {
		// TODO: return a Promise so the caller gets notified.

		const gameInstall = this.installRepo.getGameInstall(id);

		// TODO: change how launch progress is tracked.
		this.launchProgress = 0;
		this.launchInProgress = true;

		if (this.installRepo.isDownloading()) {
			if (this.installRepo.currentDownload.id === gameInstall.id) {
				// BRWC is already ready for play.
				this.extpipeObj.Play('-brnolaunch');
			} else {
				// eslint-disable-next-line no-lonely-if
				if (gameInstall.checkFlag(GameInstall.DOWNLOADED)) {
					this.installRepo.reScanGameInstall(gameInstall).then(() => {
						this.launchGameDirect(gameInstall);
					});
				} else {
					this.startDownload(gameInstall, false);
				}
			}
		} else {
			// TODO: this means startDownload needs to return a Promise as well.
			this.startDownload(gameInstall);
		}
	}

	/**
	 * Repairs the game.
	 * @param {string} gameId
	 */
	repairGame(gameId) {
		if (!this.repairInitiated) {
			const gameInstall = this.installRepo.getGameInstall(gameId);
			const auditMode = AUDIT_MODE.MODE_AUDIT_FULL;
			if (gameInstall.checkFlag(GameInstall.DOWNLOADING)) {
				this.extpipeObj.Reaudit(auditMode);
				clearTimeout(this.timeoutTimer);
				this.setTimeoutTimer(DownloadManager.REPAIR_TIMEOUT); // use a longer timeout since repair takes a while
			} else {
				this.doDownload(gameInstall, true, auditMode);
			}
			this.eventHandler.broadcast(CUSTOM_CMD.UI_REPAIR, 0, 0);
			this.repairInitiated = true;
		}
	}

	setPendingQuit(flag) {
		this.pendingQuit = flag;
		this.eventHandler.broadcast(CUSTOM_CMD.UI_PENDING_QUIT, flag, 0);
	}

	onQuitEvent() {
		clearTimeout(this.timeoutTimer);
		this.timeoutTimer = null;
		this.repairInitiated = false;
		this.setPendingQuit(false);
		this.installRepo.clearGameFlag(GameInstall.DOWNLOADING);
		this.installRepo.setCurrentDownload(null);

		this.currentStage = 0;
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
		if (this.installRepo.isDownloading()) {
			const pct = this.extpipeObj.GetPctDone();
			return this.extpipeObj.GetStage() === STAGE.STAGE_REQUIREDASSETS ||
				this.extpipeObj.GetStage() === STAGE.STAGE_REMAININGASSETS
				? pct.toFixed(2)
				: 0.0;
		}

		return 0;
	}

	getDownloadedBytes() {
		if (this.installRepo.isDownloading()) {
			return this.extpipeObj.GetDownloadedBytes();
		}
		return 0;
	}

	getTotalNetworkBytes() {
		if (this.installRepo.isDownloading()) {
			return this.extpipeObj.GetTotalNetworkBytes();
		}
		return 0;
	}

	getGameFileSize(id) {
		return formatFileSize(this.installRepo.getGameInstall(id).installSize);
	}

	getDownloadSpeed() {
		if (this.installRepo.isDownloading()) {
			return this.extpipeObj.GetKBytesPerSec();
		}
		return 0;
	}

	packageComplete() {
		return this.extpipeObj.GetPackageComplete();
	}

	initialComplete() {
		return this.extpipeObj.GetInitialComplete();
	}

	pause() {
		if (this.installRepo.isDownloading() && !this.isPaused) {
			this.extpipeObj.TogglePause();
			this.isPaused = true;
		}
	}

	resume() {
		if (this.installRepo.isDownloading() && this.isPaused) {
			this.extpipeObj.TogglePause();
			this.isPaused = false;
		}
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

	checkLaunchProgress() {
		if (!this.launchInProgress) return;

		const stage = this.extpipeObj.GetStage();
		if (this.currentStage !== stage && this.launchProgress < 100) {
			switch (stage) {
				case STAGE.STAGE_INITIALIZING:
					this.launchProgress = 15;
					break;
				case STAGE.STAGE_AUDITING:
					this.launchProgress = 30;
					break;
				case STAGE.STAGE_MIGRATING:
					this.launchProgress = 45;
					break;
				case STAGE.STAGE_REQUIREDASSETS:
					this.launchProgress = 65;
					break;
				case STAGE.STAGE_REMAININGASSETS:
					this.launchProgress = 75;
					break;
				case STAGE.STAGE_UNINITIALIZING:
					this.launchProgress = 90;
					break;
				default:
					break;
			}

			this.currentStage = stage;
		}
	}
}

export default DownloadManager;
