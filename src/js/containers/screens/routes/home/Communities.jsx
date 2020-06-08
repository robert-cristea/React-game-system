import React, { Component as ReactComponent, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Component from '../../../../components/screens/routes/home/Communities';
import currentUser, { isSubscribed, subscribe, unsubscribe } from '../../../../mock/currentUser';
import PanelModal from '../../../../components/modals/PanelModal';
import UI from '../../../../app/UI';
import sampleCommunities, { findCommunityById } from '../../../../mock/sampleCommunities';
import CommunityModal from '../../../../components/communities/CommunityModal';

@inject('ui')
@observer
class Communities extends ReactComponent {
	static propTypes = {};
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
	communityModalVisible = false;

	@observable
	displayedCommunity = null;

	componentWillMount() {
		this.didMount = false;
		this.updateCommunityModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateCommunityModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	updateCommunityModal(props = this.props) {
		const communityId = props.match.params.community;
		const community = findCommunityById(communityId);

		if (community) {
			this.displayedCommunity = community;
			this.openCommunityModal();
		} else {
			this.closeCommunityModal();
		}
	}

	getAllCommunities() {
		const userCommunities = currentUser.subscriptions.map(s => s.community);
		return sampleCommunities.filter(c => userCommunities.indexOf(c) === -1);
	}

	closeCommunityModal() {
		this.communityModalVisible = false;
	}

	openCommunityModal() {
		this.communityModalVisible = true;
	}

	handleCommunityModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/communities');
	};

	handleCommunityClick = () => {
		window.open('https://forums.turboplay.com', '_blank');
		// TODO: Enable community preview
		// this.props.ui.router.goTo(`/dashboard/communities/${community.id}`);
	};

	// eslint-disable-next-line no-unused-vars
	handleMessage = message => {
		// TODO
	};

	handleSubscribe = () => {
		subscribe(this.displayedCommunity);
	};

	handleUnsubscribe = () => {
		unsubscribe(this.displayedCommunity);
	};

	isUserSubscribed() {
		return isSubscribed(this.displayedCommunity);
	}

	renderCommunityModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		if (!this.displayedCommunity) {
			return null;
		}

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.communityModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleCommunityModalClose}
			>
				<CommunityModal
					currentUser={currentUser}
					community={this.displayedCommunity}
					onBack={this.handleCommunityModalClose}
					onMessage={this.handleMessage}
					onSubscribe={this.handleSubscribe}
					onUnsubscribe={this.handleUnsubscribe}
					userIsSubscribed={this.isUserSubscribed()}
				/>
			</PanelModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					currentUserSubscriptions={currentUser.subscriptions}
					allCommunities={this.getAllCommunities()}
					onCommunityClick={this.handleCommunityClick}
				/>
				{/* {this.renderCommunityModal()} */}
			</Fragment>
		);
	}
}

// Injected props
Communities.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Communities;
