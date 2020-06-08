/* eslint-disable no-console */
import _ from 'lodash';
import GameInstall from './GameInstall';
import ini from './node-ini/node-ini';

import { checkPackage } from './Packages';

const BITRAIDER_PATH = 'C:\\ProgramData\\Bitraider\\';
const BR_CONFIG_PATH = 'bitraider\\config\\';
const BR_CONFIG = 'BRConfig_';
const PACKAGE = 'Package';
const COMMON = 'common';
const LAUNCH_EXE = 'LAUNCH_EXE';
const INI_EXT = '.ini';
const BITRAID_EXT = '.bitraid';

class InstallRepository {
	/**
	 * @type {Array<GameInstall>}
	 */
	gameInstalls = [];

	/**
	 * @type {GameInstall}
	 */
	currentDownload = null;

	/**
	 * Searches User's local machine for existing installs and populate the game list.
	 * Note that id is not known yet here, only bitraiderId, installPath and the current state.
	 * @param {UserGames} userGames
	 * @return {Promise}
	 */
	// eslint-disable-next-line no-unused-vars
	loadInstalls(userGames) {
		return new Promise(resolve => {
			// checks if DownloadManager's first load then do a scan of user's machine for any download.
			this.scanInstalls().then(() => {
				// iterate through userGames building your Install Repo

				userGames.forEach(userGame => {
					const game = userGame.game;
					checkPackage(game);
					this.addOrUpdateInstall(game);
					/**
					 * commented for now. It seems other screens are pulling directly from the server and setting this here
					 * doesn't do anything to reflect it.
					 */
					/*
    				const gameInstall = this.addOrUpdateInstall(game);
					if(game.userPurchased) {
    					game.userDownloaded = gameInstall.checkFlag(GameInstall.DOWNLOADED); // we set the proper value, we might need to do a server request to toggle this on/off.
					}
				*/
				});

				resolve();
			});
		});
	}

	/**
	 * scans local machine for existing install to build our game install list.
	 * @return {Promise}
	 */
	scanInstalls() {
		return new Promise(resolve => {
			try {
				const commonIni = ini.parseSync(`${BITRAIDER_PATH}${COMMON}${INI_EXT}`);
				Object.keys(commonIni).forEach(gameId => {
					if (gameId.length === 0) return;
					try {
						const installPath = commonIni[gameId].Path;
						const brConfig = ini.parseSync(`${installPath}${BR_CONFIG_PATH}${BR_CONFIG}${gameId}${INI_EXT}`);
						const packageIni = ini.parseSync(`${installPath}${BR_CONFIG_PATH}${PACKAGE}${INI_EXT}`);
						const bitraidFile = ini.parseSync(`${installPath}${BR_CONFIG_PATH}${gameId}${BITRAID_EXT}`);
						const installSize = bitraidFile.Package.InstallSize;

						this.gameInstalls.push(
							new GameInstall({
								id: null,
								bitraiderId: gameId,
								installPath,
								installSize,
								gameExe: packageIni[LAUNCH_EXE].Name,
								state: brConfig[''].InitialInstall !== undefined ? GameInstall.DOWNLOADED : GameInstall.INSTALLED,
							}),
						);
					} catch (err) {
						console.error(`failed parsing : ${err.path}`);
					}
				});
			} catch (err) {
				console.error(`failed parsing : ${err.path}`);
			}
			resolve();
		});
	}

	/**
	 * rescan local machine for missing data. For now only gameEXE as all info can be obtained via API.
	 * @param {string|GameInstall} gameId
	 * @return {Promise}
	 */
	reScanGameInstall(gameId) {
		const gameObject =
			gameId instanceof GameInstall ? gameId : this.gameInstalls.find(gameInstall => gameInstall.id === gameId);
		if (gameObject !== undefined) {
			if (gameObject.gameExe === null) {
				// if there is a need to scan other properties just add it here.
				return new Promise(resolve => {
					try {
						const packageIni = ini.parseSync(`${gameObject.installPath}${BR_CONFIG_PATH}${PACKAGE}${INI_EXT}`);
						gameObject.gameExe = packageIni[LAUNCH_EXE].Name;
					} catch (err) {
						console.error(`failed parsing : ${err.path}`);
					}
					resolve();
				});
			}
		}

		return Promise.resolve();
	}

	/**
	 * checks local machine if a specific game is installed.
	 * @param {string|GameInstall} gameId
	 */
	scanIfInstalled(gameId) {
		const gameObject =
			gameId instanceof GameInstall ? gameId : this.gameInstalls.find(gameInstall => gameInstall.id === gameId);
		if (gameObject !== undefined) {
			try {
				const commonIni = ini.parseSync(`${BITRAIDER_PATH}${COMMON}${INI_EXT}`);
				return Object.keys(commonIni).find(key => key === gameObject.bitraiderId) !== undefined;
			} catch (err) {
				console.error(`failed parsing : ${err.path}`);
			}
		}

		return false;
	}

	isDownloading() {
		return this.currentDownload !== null;
	}

	/**
	 * Adds a non existing Game or update it based on the externalId.
	 * @param {Game} game
	 * @return {GameInstall}
	 */
	addOrUpdateInstall(game) {
		if (game.shopDetails.package === null) return null;
		let gameObject = this.gameInstalls.find(
			gameInstall => gameInstall.bitraiderId === game.shopDetails.package.externalId,
		);
		if (gameObject !== undefined && gameObject !== null) {
			if (gameObject.id === null) gameObject.id = game.id;
		} else {
			gameObject = GameInstall.create(game);
			this.gameInstalls.push(gameObject);
		}

		return gameObject;
	}

	/**
	 * Gets a GameInstall object if exist.
	 * @param {string} id
	 * @return {GameInstall}
	 */
	getGameInstall(id) {
		return this.gameInstalls.find(gameInstall => gameInstall.id === id);
	}

	/**
	 * Usually called when uninstall happens.
	 * @param {Game} game
	 */
	removeInstall(game) {
		_.remove(this.gameInstalls, gameInstall => gameInstall.id === game.id);
	}

	/**
	 *
	 * @param {string|GameInstall} id
	 */
	setCurrentDownload(id) {
		if (id === null) {
			this.currentDownload = null;
		} else {
			// eslint-disable-next-line no-lonely-if
			if (id instanceof GameInstall) this.currentDownload = id;
			else this.currentDownload = this.gameInstalls.find(gameInstall => gameInstall.id === id);
		}
	}

	/**
	 * By Default sets currentDownload's flag
	 * if id is passed, GameInstall that matches the id gets set.
	 * @param {number} flag
	 * @param {string|GameInstall} id
	 */
	setGameFlag(flag, id = null) {
		let installObj = this.currentDownload;
		if (id !== null) {
			installObj = typeof id === 'string' ? this.gameInstalls.find(gameInstall => gameInstall.id === id) : id;
		}

		if (installObj !== null) installObj.state = flag;
	}

	/**
	 * By Default toggles currentDownload's flag
	 * if id is passed, GameInstall that matches the id gets toggled.
	 * @param {number} flag
	 * @param {string|GameInstall} id
	 */
	toggleGameFlag(flag, id = null) {
		let installObj = this.currentDownload;
		if (id !== null) {
			installObj = typeof id === 'string' ? this.gameInstalls.find(gameInstall => gameInstall.id === id) : id;
		}

		if (installObj !== null) installObj.state |= flag; // eslint-disable-line no-bitwise
	}

	/**
	 * By Default clears currentDownload's flag
	 * if id is passed, GameInstall that matches the id gets cleared.
	 * @param {number} flag
	 * @param {string|GameInstall} id
	 */
	clearGameFlag(flag, id = null) {
		let installObj = this.currentDownload;
		if (id !== null) {
			installObj = typeof id === 'string' ? this.gameInstalls.find(gameInstall => gameInstall.id === id) : id;
		}

		if (installObj !== null) installObj.state &= ~flag; // eslint-disable-line no-bitwise
	}

	/**
	 * By default checks the currentDownload if already downloaded
	 * if id is passed, GameInstall that matches the id gets checked instead.
	 * @param {string|GameInstall} id
	 */
	isDownloaded(id = null) {
		let installObj = this.currentDownload;
		if (id !== null) {
			installObj = typeof id === 'string' ? this.gameInstalls.find(gameInstall => gameInstall.id === id) : id;
		}

		// eslint-disable-next-line no-bitwise
		return (installObj.state & GameInstall.DOWNLOADED) === GameInstall.DOWNLOADED;
	}
}

export default InstallRepository;
