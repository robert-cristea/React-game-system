import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../components/screens/routes/GameDetails';
import GameRepository from '../../../app/Repositories/GameRepository';
import Authentication from '../../../app/Authentication';
import Config from '../../../app/Config';
import UI from '../../../app/UI';
import Game from '../../../app/Game';
import GameItem from '../../../app/CartItem/GameItem';
import DownloadManager from '../../../../brwc/DownloadManager';
import GameBackButton from '../../../components/game/GameBackButton';

@inject('ui', 'auth', 'config', 'gameRepository')
@observer
class GameDetails extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
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

	componentWillMount() {
		this.gameId = this.extractGameFromPath();
		this.loadGame(this.gameId);
	}

	componentWillReceiveProps(newProps) {
		const gameId = this.extractGameFromPath(newProps);

		if (this.gameId !== gameId) {
			this.gameId = gameId;
			this.loadGame(gameId);
		}
	}

	get previousLocation() {
		const current = this.props.location.pathname;
		let location = null;

		if (current.startsWith('/dashboard/games')) {
			location = {
				path: '/dashboard/games/index',
				title: 'My Games',
			};
		} else if (current.startsWith('/dashboard/shop')) {
			location = {
				path: '/dashboard/shop/index',
				title: 'Shop',
			};
		}

		return location;
	}

	extractGameFromPath = (props = this.props) => {
		const { gameId } = props.match.params;

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
		const loggedIn = this.props.ui.loggedIn;
		const attributes = this.props.config.get('gameAttributes.details')(loggedIn);

		repo
			.load(gameId, attributes, loggedIn)
			.then(game => {
				this.loading = false;
				this.game = game;
			})
			.catch(e => {
				this.props.ui.router.goTo(`/dashboard/games/index`);
				return Promise.reject(e);
			});
	}

	handleAddToCart = game => {
		if (game instanceof Game && this.props.ui.loggedIn) {
			this.props.auth
				.getUser()
				.getCart()
				.addItem(new GameItem(game));
			this.props.ui.call('cartShow');
		}
	};

	handleLogin = () => {
		this.props.ui.router.goTo(`/welcome/login`);
	};

	handleGoBack = () => {
		const location = this.previousLocation;
		if (location) this.props.ui.router.goTo(this.previousLocation.path);
	};

	handlePlayGame = gameId => {
		this.props.ui.router.goTo(`/launch/index/${gameId}`);
	};

	handleDownloadGame = gameId => {
		this.props.downloadManager.startDownload(gameId, false);
		this.props.ui.router.goTo(`/dashboard/games/index`);
	};

	render() {
		return (
			<div className="gameDetails">
				{this.previousLocation && <GameBackButton title={this.previousLocation.title} callback={this.handleGoBack} />}
				<Component
					game={this.game}
					loggedIn={this.props.ui.loggedIn}
					loading={this.loading}
					onAddToCart={this.handleAddToCart}
					onLogin={this.handleLogin}
					onPlayGame={this.handlePlayGame}
					onDownloadGame={this.handleDownloadGame}
				/>
			</div>
		);
	}
}

// Injected props
GameDetails.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	gameRepository: PropTypes.instanceOf(GameRepository).isRequired,
	downloadManager: PropTypes.instanceOf(DownloadManager),
};

export default GameDetails;
