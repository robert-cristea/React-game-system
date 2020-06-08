import React, { Component as ReactComponent } from 'react';
import { observable, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import Component from '../../components/friends/FriendsAndRequests';
import ReceivedFriendRequestRepository from '../../app/Repositories/ReceivedFriendRequestRepository';
import Authentication from '../../app/Authentication';
import SentFriendRequestRepository from '../../app/Repositories/SentFriendRequestRepository';
import UserComponent from '../../components/friends/User';

@inject('auth', 'receivedFriendRequestRepository', 'sentFriendRequestRepository', 'config', 'toast')
@observer
class FriendsAndRequests extends ReactComponent {
	static propTypes = {
		startView: PropTypes.string,
	};
	static defaultProps = {
		startView: null,
	};

	@observable
	loadingFriendsAndRequests = false;

	@observable
	view = Component.VIEW_ALL;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.setStartView();
	}

	componentDidUpdate(newProps) {
		if (newProps.startView !== this.props.startView) {
			this.setStartView();
		}
	}

	setStartView() {
		if (this.props.startView) {
			this.view = this.props.startView;
		} else {
			this.view = Component.VIEW_ALL;
		}
	}

	getAllFriends() {
		return this.user.getFriends();
	}

	getOnlineFriends() {
		return this.getAllFriends().filter(user => user.isOnline());
	}

	getOfflineFriends() {
		return this.getAllFriends().filter(user => !user.isOnline());
	}

	getReceivedRequests() {
		/** @type {ReceivedFriendRequestRepository} */
		const repo = this.props.receivedFriendRequestRepository;
		return repo.getFriendRequests();
	}

	getSentRequests() {
		/** @type {SentFriendRequestRepository} */
		const repo = this.props.sentFriendRequestRepository;
		return repo.getFriendRequests();
	}

	/**
	 * Returns the list of users for the current view or search. Each returned object contains the
	 * user itself and some metadata describing the relationship between this user and the current
	 * user (ex: 'friends' or 'invitationReceived')
	 * @return {{
	 *   relation: { type: string, data: {} },
	 *   user: User
	 * }[]}
	 */
	@computed
	get displayedUsers() {
		if (this.view === Component.VIEW_ALL) {
			return this.getAllFriends().map(user => ({
				relation: UserComponent.RELATIONS.FRIEND,
				user,
			}));
		}

		if (this.view === Component.VIEW_ONLINE) {
			return this.getOnlineFriends().map(user => ({
				relation: UserComponent.RELATIONS.FRIEND,
				user,
			}));
		}

		if (this.view === Component.VIEW_OFFLINE) {
			return this.getOfflineFriends().map(user => ({
				relation: UserComponent.RELATIONS.FRIEND,
				user,
			}));
		}

		// We return an array that is the pending received concatenated with the sent friend requests
		if (this.view === Component.VIEW_PENDING) {
			const received = this.getReceivedRequests().map(request => ({
				relation: UserComponent.RELATIONS.INVITATION_RECEIVED,
				user: request.user,
				friendshipRequest: request,
			}));

			const sent = this.getSentRequests().map(request => ({
				relation: UserComponent.RELATIONS.INVITATION_SENT,
				user: request.user,
				friendshipRequest: request,
			}));

			return [...received, ...sent];
		}

		return [];
	}

	handleViewChange = view => {
		this.view = view;
	};

	render() {
		const componentProps = omit(this.props, Object.keys(FriendsAndRequests.propTypes));
		return (
			<Component
				users={this.displayedUsers}
				view={this.view}
				onViewChange={this.handleViewChange}
				{...componentProps}
			/>
		);
	}
}

// Injected props
FriendsAndRequests.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	receivedFriendRequestRepository: PropTypes.instanceOf(ReceivedFriendRequestRepository).isRequired,
	sentFriendRequestRepository: PropTypes.instanceOf(SentFriendRequestRepository).isRequired,
};

export default FriendsAndRequests;
