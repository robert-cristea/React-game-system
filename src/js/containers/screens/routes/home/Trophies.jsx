import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../../../components/screens/routes/home/Trophies';
import UI from '../../../../app/UI';
import PanelModal from '../../../../components/modals/PanelModal';
import { getGameById } from '../../../../mock/sampleGames';
import GameTrophiesModal from '../../../../components/trophy/GameTrophiesModal';
import currentUser from '../../../../mock/currentUser';

@inject('ui')
@observer
class Trophies extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	gameModalVisible = false;

	@observable
	displayedGame = null;

	componentWillMount() {
		this.didMount = false;
		this.updateGameModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateGameModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	updateGameModal(props = this.props) {
		const gameId = props.match.params.game;

		if (!gameId) {
			this.closeGameModal();
			return;
		}

		const game = getGameById(gameId);

		if (!game) {
			this.closeGameModal();
			return;
		}

		this.displayedGame = game;
		this.openGameModal();
	}

	closeGameModal() {
		this.gameModalVisible = false;
	}

	openGameModal() {
		this.gameModalVisible = true;
	}

	handleGameModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/trophies');
	};

	renderGameModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		if (!this.displayedGame) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.gameModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleGameModalClose}
			>
				<GameTrophiesModal game={this.displayedGame} onBack={this.handleGameModalClose} />
			</PanelModal>
		);
	}

	handleGameClick = game => {
		this.props.ui.router.goTo(`/dashboard/trophies/${game.id}`);
	};

	render() {
		return (
			<Fragment>
				<Component onGameClick={this.handleGameClick} trophies={currentUser.trophies} />
				{this.renderGameModal()}
			</Fragment>
		);
	}
}

// Injected props
Trophies.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Trophies;
