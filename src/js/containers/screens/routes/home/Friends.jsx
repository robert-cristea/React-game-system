import React, { Component as ReactComponent, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Component from '../../../../components/screens/routes/home/Friends';
import UI from '../../../../app/UI';
import FullModal from '../../../../components/modals/FullModal';
import UserProfileModal from '../../../user/UserProfileModal';
import ReceivedFriendRequestRepository from '../../../../app/Repositories/ReceivedFriendRequestRepository';
import Authentication from '../../../../app/Authentication';
import Config from '../../../../app/Config';
import SentFriendRequestRepository from '../../../../app/Repositories/SentFriendRequestRepository';
import ToastManager from '../../../../app/ToastManager';

@inject('ui', 'auth', 'receivedFriendRequestRepository', 'sentFriendRequestRepository', 'config', 'toast')
@observer
class Friends extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
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
	friendModalVisible = false;

	// For the modal
	@observable
	displayedUser = null;

	/**
	 * True if friends and requests are currently being loaded
	 * @type {boolean}
	 */
	@observable
	loadingFriendsAndRequests = false;

	/**
	 * When a start view is passed as the `startView` URL query param, will hold it
	 * @type {null}
	 */
	@observable
	startView = null;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.didMount = false;
		this.startView = null;
		this.user = this.props.auth.getUser();
		this.loadFriendsAndRequests();
		this.updateViewFromLocation();
	}

	componentWillReceiveProps(newProps) {
		this.updateFriendModal(newProps);
		this.updateViewFromLocation(newProps);
	}

	componentDidMount() {
		this.didMount = true;
		this.updateFriendModal();
	}

	/**
	 * Update `this.startView` from the `startView` URL query parameter, if present. Then redirects to the same page
	 * without the param in the URL.
	 * @param {object} newProps
	 */
	updateViewFromLocation(newProps = this.props) {
		const search = newProps.location.search;

		if (!search) {
			return;
		}

		const searchParams = queryString.parse(search);

		if (searchParams.startView) {
			this.startView = searchParams.startView;
		}

		// We remove the search query
		const newLocation = {
			...newProps.location,
			search: '',
		};

		this.props.ui.router.goTo(newLocation);
	}

	loadFriendsAndRequests() {
		this.loadingFriendsAndRequests = true;
		return this.loadFriends()
			.then(this.loadRequests())
			.then(() => {
				this.loadingFriendsAndRequests = false;
			})
			.catch(e => {
				this.props.toast.error('Error while loading your friends and friend requests');
				return Promise.reject(e);
			});
	}

	loadRequests() {
		/** @type {ReceivedFriendRequestRepository} */
		const receivedRepo = this.props.receivedFriendRequestRepository;
		/** @type {SentFriendRequestRepository} */
		const sentRepo = this.props.sentFriendRequestRepository;
		// Same attributes as the list, since they will be added there once accepted
		const attributes = this.props.config.get('userAttributes.friendsList');
		// For now, we force a reload (until we have the async update)
		return receivedRepo.loadAll(attributes, true).finally(() => sentRepo.loadAll(attributes, true));
	}

	loadFriends() {
		const attributes = this.props.config.get('userAttributes.friendsList');
		// For now, we force a reload (until we have the async update)
		return this.user.loadFriends(attributes, true);
	}

	updateFriendModal(props = this.props) {
		const id = props.computedMatch.params.friend;

		if (typeof id !== 'string') {
			this.closeFriendModal();
			return;
		}

		this.displayedUserId = id;
		this.openFriendModal();
	}

	handleFriendModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/friends');
	};

	closeFriendModal() {
		this.friendModalVisible = false;
	}

	openFriendModal() {
		this.friendModalVisible = true;
	}

	renderFriendModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation || !this.displayedUserId) {
			return null;
		}

		return (
			<FullModal
				isOpen={this.friendModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleFriendModalClose}
			>
				<UserProfileModal userId={this.displayedUserId} onBack={this.handleFriendModalClose} />
			</FullModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component loadingUsers={this.loadingFriendsAndRequests} startView={this.startView} />
				{this.renderFriendModal()}
			</Fragment>
		);
	}
}

// Injected props
Friends.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	receivedFriendRequestRepository: PropTypes.instanceOf(ReceivedFriendRequestRepository).isRequired,
	sentFriendRequestRepository: PropTypes.instanceOf(SentFriendRequestRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Friends;
