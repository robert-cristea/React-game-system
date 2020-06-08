import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Component from '../../components/shop/Game';
import Authentication from '../../app/Authentication';
import UI from '../../app/UI';
import Game from '../../app/Game';
import GameItem from '../../app/CartItem/GameItem';
import DownloadManager from '../../../brwc/DownloadManager';

@inject('ui', 'auth')
class GameContainer extends ReactComponent {
	static propTypes = {
		featured: PropTypes.bool,
		game: PropTypes.instanceOf(Game).isRequired,
	};
	static defaultProps = {
		featured: false,
		downloadManager: null,
	};

	handleGameClick = gameId => {
		this.props.ui.router.goTo(`/dashboard/shop/details/${gameId}`);
	};

	handleAddToCart = game => {
		if (game instanceof Game && this.props.ui.loggedIn) {
			this.props.auth
				.getUser()
				.getCart()
				.addItem(new GameItem(game));
			this.props.ui.call('cartShow');
		}
	};

	handlePlayGame = gameId => {
		this.props.ui.router.goTo(`/launch/index/${gameId}`);
	};

	handleDownloadGame = gameId => {
		this.props.downloadManager.startDownload(gameId, false);
		this.props.ui.router.goTo(`/dashboard/games/index`);
	};

	handleLogin = () => {
		this.props.ui.router.goTo('/welcome/login');
	};

	render() {
		return (
			<Component
				game={this.props.game}
				loggedIn={this.props.ui.loggedIn}
				featured={this.props.featured}
				onGameClick={this.handleGameClick}
				onAddToCart={this.handleAddToCart}
				onLogin={this.handleLogin}
				onPlayGame={this.handlePlayGame}
				onDownloadGame={this.handleDownloadGame}
			/>
		);
	}
}

// Injected props
GameContainer.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	downloadManager: PropTypes.instanceOf(DownloadManager),
};

export default GameContainer;
