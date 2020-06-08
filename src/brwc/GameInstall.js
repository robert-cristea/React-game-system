class GameInstall {
	/**
	 * first 3 bits are for the installation status. next 2 bits are for download/queue status.
	 */
	static UNKNOWN = 0;
	static INSTALLED = 1;
	static PLAYABLE = 3;
	static DOWNLOADED = 7;
	static DOWNLOADING = 8;
	static QUEUED = 16;

	/**
	 * @type {UNKNOWN|INSTALLED|PLAYABLE|DOWNLOADED|DOWNLOADING|QUEUED}
	 */
	state = GameInstall.UNKNOWN;

	/**
	 * @type {{Game}.id}
	 */
	id = null;

	/**
	 * @type {{Game}.shopDetails.package.externalId}
	 */
	bitraiderId = null;

	/**
	 * Where the game is installed.
	 * @type {string}
	 */
	installPath = null;

	/**
	 * @type {BigNumber}
	 */
	installSize = 0;

	/**
	 * Game's executable file.
	 */
	gameExe = null;

	constructor(data = {}) {
		this.id = data.id;
		this.bitraiderId = data.bitraiderId;
		this.installPath = data.installPath;
		if (this.installPath !== null) {
			if (!this.installPath.endsWith('\\')) {
				// make sure installPath has an ending backslash.
				this.installPath += '\\';
			}

			if (this.id !== null) {
				this.installPath += `${this.id}\\`;
			}
		}

		this.installSize = data.installSize;
		this.gameExe = data.gameExe;
		if (data.state !== null) {
			this.state = data.state;
		}
	}

	/**
	 *
	 * @param {Game} game
	 * @return {GameInstall}
	 */
	static create(game) {
		return new GameInstall({
			id: game.id,
			bitraiderId: game.shopDetails.package !== null ? game.shopDetails.package.externalId : null,
			installPath: game.shopDetails.package !== null ? game.shopDetails.package.defaultDest : null,
			installSize: game.shopDetails.package !== null ? game.shopDetails.package.installSize : 0,
			gameExe: null,
			state: null,
		});
	}

	/**
	 * Checks the flag if set in the GameInstall's state.
	 * @param {number} flag
	 */
	checkFlag(flag) {
		// eslint-disable-next-line no-bitwise
		return (this.state & flag) === flag;
	}
}

export default GameInstall;
