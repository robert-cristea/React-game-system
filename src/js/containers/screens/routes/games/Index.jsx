import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

/** @type {IoC} */
import IoC from '@aedart/js-ioc';

import Component from '../../../../components/screens/routes/games/Index';
import UI from '../../../../app/UI';
import Authentication from '../../../../app/Authentication';
import Config from '../../../../app/Config';
import DownloadManager from '../../../../../brwc/DownloadManager';

@inject('ui', 'auth', 'config', 'downloadManager')
@observer
class Index extends ReactComponent {
	static propTypes = {};
	static defaultProps = {
		downloadManager: null,
	};

	/**
	 * True when loading the user games
	 * @type {boolean}
	 */
	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.loading = true;
		this.user = this.props.auth.getUser();
		this.loadGames();
	}

	loadGames() {
		const gameAttributes = this.props.config.get('gameAttributes.userGames');

		// For now, we force a reload (until we have the async update)
		this.user.loadUserGames(gameAttributes, true).then(games => {
			this.props.downloadManager.loadGames(games).then(() => {
				this.loading = false;
			});
		});
	}

	handleGameClick = gameId => {
		this.props.ui.router.goTo(`/dashboard/games/details/${gameId}`);
	};

	/**
	 * TODO: Move this server request to the download manager.
	 */
	handleDownloadComplete = gameId => {
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		server.completeGameDownload(gameId);
	};

	handlePauseClick = () => {
		this.props.downloadManager.pause();
	};

	handleResumeClick = () => {
		this.props.downloadManager.resume();
	};

	handleCancelClick = gameId => this.props.downloadManager.stopDownload(gameId);

	handleUninstallClick = gameId => this.props.downloadManager.uninstallGame(gameId);

	handleOpenStore = () => {
		this.props.ui.router.goTo('/dashboard/shop/index');
	};

	handlePlayGame = gameId => {
		this.props.ui.router.goTo(`/launch/index/${gameId}`);
	};

	render() {
		return (
			<Fragment>
				<Component
					loading={this.loading}
					userGames={this.user.userGames}
					onOpenStore={this.handleOpenStore}
					onGameClick={this.handleGameClick}
					onPlayGame={this.handlePlayGame}
					onDownloadComplete={this.handleDownloadComplete}
					onPauseClick={this.handlePauseClick}
					onResumeClick={this.handleResumeClick}
					onCancelClick={this.handleCancelClick}
					onUninstallClick={this.handleUninstallClick}
				/>
			</Fragment>
		);
	}
}

// Injected props
Index.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	downloadManager: PropTypes.instanceOf(DownloadManager),
};

export default Index;
