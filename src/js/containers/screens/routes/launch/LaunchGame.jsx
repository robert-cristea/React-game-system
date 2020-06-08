import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';

/** @type {IoC} */
import IoC from '@aedart/js-ioc';

import GameRepository from '../../../../app/Repositories/GameRepository';
import Config from '../../../../app/Config';
import UI from '../../../../app/UI';
import Loading from '../../../../components/Loading';
import ProgressBar from '../../../../components/ProgressBar';
import DownloadManager from '../../../../../brwc/DownloadManager';

@inject('ui', 'config', 'gameRepository', 'downloadManager')
@observer
class LaunchGame extends Component {
	static propTypes = {
		computedMatch: PropTypes.object.isRequired,
	};
	static defaultProps = {
		downloadManager: null,
	};

	@observable
	loading = true;

	@observable
	gameId = null;

	@observable
	game = null;

	@observable
	progress = 0;

	// TODO: Remove mock data
	timerId = null;

	componentWillMount() {
		this.gameId = this.extractGameFromPath();
		this.loadGame(this.gameId);
	}

	componentWillUnmount() {
		// TODO: Remove mock data
		clearInterval(this.timerId);
	}

	// TODO: Remove mock data
	timer() {
		if (this.progress === 100) {
			clearInterval(this.timerId);
			this.handleLaunchComplete();
			this.props.ui.router.goTo(`/dashboard/games/index`);
		} else {
			let result = this.props.downloadManager.getLaunchProgress();
			if (result > 100) result = 100;
			this.progress = result;
		}
	}

	extractGameFromPath = () => {
		const { gameId } = this.props.computedMatch.params;

		if (typeof gameId === 'string') {
			return gameId;
		}

		this.props.ui.router.goTo(`/dashboard/games/index`);
		return null;
	};

	loadGame(gameId) {
		this.loading = true;

		/** @type {GameRepository} */
		const repo = this.props.gameRepository;
		const attributes = this.props.config.get('gameAttributes.launch');

		repo
			.load(gameId, attributes)
			.then(game => {
				this.loading = false;
				this.game = game;
				/*
				 * PONDER: maybe we need to call this in UserGame coz it
				 * might fail and we don't need to launch this screen.
				 */
				this.props.downloadManager.launchGame(game.id);

				// TODO: get return first if it succeeded launching before running timer.
				this.timerId = setInterval(this.timer.bind(this), 150);
			})
			.catch(e => {
				this.props.ui.router.goTo(`/dashboard/games/index`);
				return Promise.reject(e);
			});
	}

	/**
	 * TODO: Move this logic to a service.
	 */
	handleLaunchComplete = () => {
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		server.completeGameLaunch(this.game.id);
	};

	handleCancel = () => {
		// TODO: Add cancel logic
		this.props.ui.router.goTo('/dashboard/games/index');
	};

	// NOTE: when game is launched there's no cancelling it.
	renderCover(game) {
		const cover = get(game, 'shopDetails.banners', [])[0];

		return (
			cover && (
				<div className="launchGame__image">
					<img src={cover.thumb} alt={cover.name} />
				</div>
			)
		);
	}

	renderProgress() {
		return (
			<div className="launchGame__progress">
				<ProgressBar value={this.progress} text="LAUNCHING..." />
				{/* <button
					className="btn btn--link launchGame__button"
					onClick={this.handleCancel}
					type="button"
				>
					<span>Cancel &amp; play later</span>
				</button> */}
			</div>
		);
	}

	render() {
		const game = this.game;

		return (
			<div className="launchGame">
				{this.loading || !game ? (
					<div className="launchGame__loading">
						<Loading />
					</div>
				) : (
					<Fragment>
						{this.renderCover(game)}
						{this.renderProgress()}
					</Fragment>
				)}
			</div>
		);
	}
}

// Injected props
LaunchGame.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	gameRepository: PropTypes.instanceOf(GameRepository).isRequired,
	downloadManager: PropTypes.instanceOf(DownloadManager),
};

export default LaunchGame;
