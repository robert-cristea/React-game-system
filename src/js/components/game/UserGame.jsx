import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { get } from 'lodash';
import UserGame from '../../app/UserGame';
import Icon from '../icons/Icon';
import ProgressBar from '../ProgressBar';
import DownloadManager from '../../../brwc/DownloadManager';
import { UI_CMD, CUSTOM_CMD } from '../../../brwc/brextdef';
import { formatDownloadSpeed } from '../../app/utils';
import GameInstall from '../../../brwc/GameInstall';

@inject('downloadManager')
@observer
class UserGameComponent extends Component {
	/**
	 * states
	 */
	static UI_INIT = 'init';
	static UI_QUEUED = 'queued';
	static UI_UNINSTALL = 'uninstall';
	static UI_PAUSED = 'paused';
	static UI_EXIT = 'exit';

	static propTypes = {
		timerInterval: PropTypes.number,
		displayFormat: PropTypes.string.isRequired,
		userGame: PropTypes.instanceOf(UserGame).isRequired,
		onGameClick: PropTypes.func,
		onPlayGame: PropTypes.func,
		onDownloadComplete: PropTypes.func,
		onPauseClick: PropTypes.func,
		onResumeClick: PropTypes.func,
		onCancelClick: PropTypes.func,
		onUpdateClick: PropTypes.func,
		onUninstallClick: PropTypes.func,
	};

	static defaultProps = {
		timerInterval: 250,
		onGameClick: null,
		onPlayGame: null,
		onDownloadComplete: null,
		onPauseClick: null,
		onResumeClick: null,
		onCancelClick: null,
		onUpdateClick: null,
		onUninstallClick: null,
		downloadManager: null,
	};

	@observable
	uiState = UserGameComponent.UI_INIT;

	@observable
	loading = false;

	@observable
	overlayShown = false;

	@observable
	isDownloaded = false;

	@observable
	isInstalled = false;

	@observable
	isDownloadInProgress = false;

	@observable
	downloadProgress = 0;

	@observable
	downloadSpeed = '0 KB/s';

	// TODO: Remove mock data
	timerId = null;

	componentWillMount() {
		// commented this for now. Since DownloadManager will scan local machine for downloaded games.
		// this.isDownloaded = this.props.userGame.game.userDownloaded;
		const gameInstall = this.props.downloadManager.registerEventCB(this.props.userGame.game.id, this.eventCallback);
		if (gameInstall !== undefined) {
			if (gameInstall.checkFlag(GameInstall.QUEUED)) {
				this.uiState = UserGameComponent.UI_QUEUED;
				this.isDownloadInProgress = true;
			} else if (gameInstall.checkFlag(GameInstall.DOWNLOADED)) {
				this.isDownloaded = true;
			} else if (gameInstall.checkFlag(GameInstall.DOWNLOADING)) {
				this.isDownloadInProgress = true;
				this.uiState = UserGameComponent.UI_INIT;
				this.timerId = setInterval(this.handleTimer, this.props.timerInterval); // start the handleTimer to receive progress again.
			}
			// else if(gameInstall.checkFlag(GameInstall.PLAYABLE)) {
			// }

			if (gameInstall.checkFlag(GameInstall.INSTALLED)) {
				this.isInstalled = true;
			}
		}
	}

	componentDidMount() {}

	componentWillUnmount() {
		this.props.downloadManager.unregisterEventCB(this.props.userGame.game.id);
	}

	// eslint-disable-next-line no-unused-vars
	eventCallback = (cmdName, focusCtrl, baCommandData) => {
		// console.log(`${this.props.userGame.game.shopDetails.package.externalId} cmdName = ${cmdName} focusCtrl = ${focusCtrl} baCommandData = ${baCommandData}`);

		switch (cmdName) {
			case UI_CMD.UI_CMD_QUIT:
			case UI_CMD.UI_CMD_QUITONLAUNCH:
				if (focusCtrl === 0) {
					this.resetValues();
				}
				break;
			case CUSTOM_CMD.UI_RESET:
				this.loading = false;
				break;
			case CUSTOM_CMD.UI_QUEUED:
				this.loading = false;
				this.isDownloadInProgress = true;
				this.uiState = UserGameComponent.UI_QUEUED;
				break;
			case CUSTOM_CMD.UI_REPAIR:
				this.loading = true;
				this.repairOngoing = true;
				break;
			case UI_CMD.UI_CMD_START_TIMER:
				{
					this.uiState = UserGameComponent.UI_INIT;
					const alreadyStarted = !!this.timerId;
					if (alreadyStarted) {
						clearInterval(this.timerId);
					}
					this.timerId = setInterval(this.handleTimer, this.props.timerInterval);
					this.isInstalled = true;
				}
				break;
			case CUSTOM_CMD.UI_DOWNLOADED_COMPLETED:
				this.isDownloaded = this.props.downloadManager.initialComplete();
				if (this.props.onDownloadComplete) {
					this.props.onDownloadComplete(this.props.userGame.game.id);
				}
			// eslint-disable-next-line no-fallthrough
			case UI_CMD.UI_CMD_STOP_TIMER:
				if (!this.timerId) {
					clearInterval(this.timerId);
				}
				this.timerId = null;
				break;
			case CUSTOM_CMD.UI_STARTING:
				this.uiState = UserGameComponent.UI_INIT;
				this.loading = true;
				break;
			case CUSTOM_CMD.UI_PENDING_QUIT:
				if (focusCtrl) {
					this.uiState = UserGameComponent.UI_EXIT;
					this.loading = true;
				}
				break;
			default:
				break;
		}
	};

	resetValues = () => {
		this.uiState = UserGameComponent.UI_INIT;
		this.loading = false;
		this.repairOngoing = false;
		this.isDownloadInProgress = false;
		this.downloadProgress = 0;
		this.downloadSpeed = '';
	};

	handleTimer = () => {
		if (this.props.downloadManager.getPctDone() > this.downloadProgress)
			this.downloadProgress = this.props.downloadManager.getPctDone();

		this.downloadSpeed = formatDownloadSpeed(this.props.downloadManager.getDownloadSpeed() * 1024);
	};

	handleGameClick = () => {
		if (this.props.onGameClick) {
			this.props.onGameClick(this.props.userGame.game.id);
		}
	};

	handlePlayGame = () => {
		if (this.props.onPlayGame) {
			this.props.onPlayGame(this.props.userGame.game.id);
		}
	};

	handleDownloadClick = () => {
		if (this.props.downloadManager.startDownload(this.props.userGame.game.id, false)) {
			this.isDownloadInProgress = true;
		}
	};

	handleUpdateClick = () => {
		if (this.props.onUpdateClick) {
			this.props.onUpdateClick(this.props.userGame.game.id);
		}
	};

	handleUninstallClick = () => {
		if (this.props.onUninstallClick) {
			this.loading = true;
			this.uiState = UserGameComponent.UI_UNINSTALL;
			this.handleOverlayClose();
			this.props
				.onUninstallClick(this.props.userGame.game.id)
				.then(() => {
					this.isDownloaded = false;
					this.resetValues();
					this.isInstalled = false;
				})
				.catch(() => {
					this.resetValues();
				});
		}
	};

	handlePauseDownload = () => {
		this.uiState = UserGameComponent.UI_PAUSED;
		if (this.props.onPauseClick) {
			this.props.onPauseClick();
		}
	};

	handleResumeDownload = () => {
		this.uiState = UserGameComponent.UI_INIT;
		if (this.props.onResumeClick) {
			this.props.onResumeClick();
		}
	};

	handleCancelDownload = () => {
		if (this.props.onCancelClick) {
			this.uiState = UserGameComponent.UI_EXIT;
			this.loading = true;
			this.props.onCancelClick(this.props.userGame.game.id).then(() => {
				this.resetValues();
			});
		}
	};

	handleOverlayClose = () => {
		this.overlayShown = false;
	};

	handleOverlayToggle = () => {
		this.overlayShown = !this.overlayShown;
	};

	getDownloadOverlayText = () => {
		let text = 'Initializing';

		// eslint-disable-next-line default-case
		switch (this.uiState) {
			case UserGameComponent.UI_QUEUED:
				text = 'Queued';
				break;
			case UserGameComponent.UI_EXIT:
				text = 'Exiting';
				break;
			case UserGameComponent.UI_UNINSTALL:
				text = 'Uninstalling';
				break;
		}
		return text;
	};

	renderActions() {
		const actions = [];
		if (this.uiState !== UserGameComponent.UI_EXIT) {
			if (this.isDownloaded) {
				actions.push(
					<button
						key="playGame"
						disabled={this.loading}
						className="userGame__action btn btn--transparent"
						onClick={this.handlePlayGame}
						type="button"
						data-tip="Play Game"
						data-for="tooltip-user-game-action"
					>
						<Icon icon="playGame" />
					</button>,
				);
			} else if (this.isDownloadInProgress) {
				if (this.uiState !== UserGameComponent.UI_QUEUED) {
					if (this.uiState === UserGameComponent.UI_PAUSED) {
						actions.push(
							<button
								key="play"
								disabled={this.loading}
								className="userGame__action userGame__action--small btn btn--transparent"
								onClick={this.handleResumeDownload}
								type="button"
								data-tip="Resume Download"
								data-for="tooltip-user-game-action"
							>
								<Icon icon="play" />
							</button>,
						);
					} else {
						actions.push(
							<button
								key="pause"
								disabled={this.loading}
								className="userGame__action userGame__action--small btn btn--transparent"
								onClick={this.handlePauseDownload}
								type="button"
								data-tip="Pause Download"
								data-for="tooltip-user-game-action"
							>
								<Icon icon="pause" />
							</button>,
						);
					}
				}

				actions.push(
					<button
						key="cancel"
						disabled={this.loading}
						className="userGame__action userGame__action--small btn btn--transparent"
						onClick={this.handleCancelDownload}
						type="button"
						data-tip="Cancel Download"
						data-for="tooltip-user-game-action"
					>
						<Icon icon="cancel" />
					</button>,
				);
			} else {
				actions.push(
					<button
						key="download"
						disabled={this.loading}
						className="userGame__action btn btn--transparent"
						onClick={this.handleDownloadClick}
						type="button"
						data-tip="Download"
						data-for="tooltip-user-game-action"
					>
						<Icon icon="download" />
					</button>,
				);
			}
		}

		return actions.length ? <div className="userGame__actions">{actions}</div> : null;
	}

	renderDownloadProgress() {
		return (
			<div className="userGame__download">
				<ProgressBar
					value={this.downloadProgress}
					size="cover"
					text={this.props.displayFormat === 'grid' ? 'Installing' : ''}
				/>
				{/* TODO: Add download speed if needed. */}
				{/* <div>{this.downloadSpeed}</div> */}
			</div>
		);
	}

	// TODO: style this better.
	renderDownloadOverlay() {
		return (
			<div className="userGame__dl-overlay">
				<div className="userGame__dl-overlay-text">{this.getDownloadOverlayText()}</div>
			</div>
		);
	}

	renderOverlay() {
		return (
			<div className="userGame__overlay">
				{this.isInstalled && (
					<Fragment>
						<div className="userGame__overlay-group">
							<button className="userGame__overlay-btn btn btn--link" type="button" disabled={!this.isDownloaded}>
								UPDATE
							</button>
						</div>
						<div className="userGame__overlay-group">
							<button className="userGame__overlay-btn btn btn--link" onClick={this.handleUninstallClick} type="button">
								UNINSTALL
							</button>
						</div>
					</Fragment>
				)}
				<dl className="userGame__overlay-group userGame__overlay-params">
					<dt>File Size</dt>
					<dd>{this.props.downloadManager.getGameFileSize(this.props.userGame.game.id)}</dd>
				</dl>
				<dl className="userGame__overlay-group userGame__overlay-params">
					<dt>Version</dt>
					{/* TODO: Add real data */}
					<dd>Game - Release - 7.30 - CL - 4823554 - MAC</dd>
				</dl>
				<button
					className="userGame__overlay-close btn btn--transparent"
					onClick={this.handleOverlayClose}
					type="button"
				>
					<Icon icon="cancel" />
				</button>
			</div>
		);
	}

	renderOverlayToggle() {
		return (
			<button
				className={`userGame__overlay-toggle btn btn--transparent ${
					this.overlayShown ? 'userGame__overlay-toggle--active' : ''
				}`}
				onClick={this.handleOverlayToggle}
				type="button"
				disabled={this.loading || this.uiState === UserGameComponent.UI_UNINSTALL}
			>
				<Icon icon="ellipsisV" />
			</button>
		);
	}

	renderCover(game) {
		const covers = get(game, 'shopDetails.covers');
		const cover = covers && covers.length && covers[0];

		return cover ? <img src={cover.thumb} alt={cover.title} /> : null;
	}

	render() {
		const game = this.props.userGame.game;
		const uiState = this.uiState;

		return (
			<div className={`userGame userGame--${this.props.displayFormat}`}>
				{this.props.displayFormat === 'list' && this.renderOverlayToggle()}
				<button
					className={`userGame__image ${!this.isDownloaded ? 'userGame__image--disabled' : ''}`}
					onClick={this.handleGameClick}
					type="button"
				>
					{this.renderCover(game)}
				</button>
				<div className="userGame__wrap">
					{this.props.displayFormat === 'grid' && this.renderOverlayToggle()}
					<button className="userGame__title" onClick={this.handleGameClick}>
						{game.name}
					</button>
					{this.renderActions()}
				</div>
				{this.isDownloadInProgress &&
					!this.isDownloaded &&
					!this.loading &&
					uiState !== UserGameComponent.UI_QUEUED &&
					this.renderDownloadProgress()}
				{(this.loading || uiState === UserGameComponent.UI_QUEUED) && this.renderDownloadOverlay()}
				{this.overlayShown && this.renderOverlay()}
			</div>
		);
	}
}

// Injected props
UserGameComponent.wrappedComponent.propTypes = {
	downloadManager: PropTypes.instanceOf(DownloadManager),
};

export default UserGameComponent;
