import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import get from 'lodash/get';
import Icon from '../icons/Icon';
import UserModel from '../../app/User';
import UserPreview from '../../containers/user/UserPreview';
import ConfirmDialog from '../../app/ConfirmDialog';
import FriendRequest from '../../app/FriendRequest';

@inject('confirm')
@observer
class User extends Component {
	static propTypes = {
		userData: PropTypes.shape({
			relation: PropTypes.string,
			user: PropTypes.instanceOf(UserModel),
			friendshipRequest: PropTypes.instanceOf(FriendRequest),
		}).isRequired,
		// eslint-disable-next-line react/no-unused-prop-types
		onSendTokens: PropTypes.func,
		onStartConversation: PropTypes.func,
		onUnfriend: PropTypes.func,
		onSendFriendRequest: PropTypes.func,
		onAcceptInvitation: PropTypes.func,
		onRejectInvitation: PropTypes.func,
		onCancelInvitation: PropTypes.func,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		onSendTokens: null,
		onStartConversation: null,
		onUnfriend: null,
		onSendFriendRequest: null,
		onAcceptInvitation: null,
		onRejectInvitation: null,
		onCancelInvitation: null,
		onClick: null,
	};

	static RELATIONS = {
		FRIEND: 'friend',
		INVITATION_RECEIVED: 'invitationReceived',
		INVITATION_SENT: 'invitationSent',
		UNKNOWN: 'unknown',
	};

	handleUnfriend = () => {
		const user = this.props.userData.user;
		const removeCallback = () => {
			if (this.props.onUnfriend) {
				this.props.onUnfriend();
			}
		};

		const buttons = [
			{
				label: 'Remove',
				onClick: removeCallback,
				isMain: true,
			},
			{
				label: 'Cancel',
				isCancel: true,
			},
		];

		const message = `Are you sure you want to remove ${user.username} from your friends?`;

		this.props.confirm.show('Remove friend?', message, buttons);
	};

	handleRejectInvitation = () => {
		const user = this.props.userData.user;
		const rejectCallback = () => {
			if (this.props.onRejectInvitation) {
				this.props.onRejectInvitation();
			}
		};

		const buttons = [
			{
				label: 'Decline',
				onClick: rejectCallback,
				isMain: true,
			},
			{
				label: 'Cancel',
				isCancel: true,
			},
		];

		const message = `Are you sure you want to decline this friend request from ${user.username}?`;

		this.props.confirm.show('Decline friend request?', message, buttons);
	};

	renderUserActions() {
		/**
		 * @type {User.RELATIONS}
		 */
		const relation = this.props.userData.relation;

		const actions = [];

		if (relation === User.RELATIONS.FRIEND) {
			/*
			// Temporarily removed (https://thejibe.atlassian.net/browse/TPC-919)
			actions.push({
				type: 'sendTokens',
				tooltip: 'Send tokens',
				onClick: this.props.onSendTokens,
			});
			*/
			actions.push({
				type: 'startConversation',
				tooltip: 'Send message',
				onClick: this.props.onStartConversation,
			});
			actions.push({
				type: 'cancel',
				tooltip: 'Remove from friends',
				onClick: this.handleUnfriend,
			});
		}

		if (relation === User.RELATIONS.INVITATION_RECEIVED) {
			actions.push({
				type: 'ok',
				tooltip: 'Accept friend request',
				onClick: this.props.onAcceptInvitation,
			});
			actions.push({
				type: 'cancel',
				tooltip: 'Decline friend request',
				onClick: this.handleRejectInvitation,
			});
		}

		if (relation === User.RELATIONS.INVITATION_SENT) {
			actions.push({
				type: 'cancel',
				tooltip: 'Cancel friend request',
				onClick: this.props.onCancelInvitation,
			});
		}

		if (relation === User.RELATIONS.UNKNOWN) {
			actions.push({
				type: 'add',
				tooltip: 'Send friend request',
				onClick: this.props.onSendFriendRequest,
			});
		}

		const noop = () => {};
		const icons = {
			add: 'add',
			sendTokens: 'logo',
			ok: 'accept',
			startConversation: 'message',
			cancel: 'remove',
		};

		return actions.map(data => (
			<div
				key={data.type}
				className={`friendsListItem__action friendsListItem__action--${data.type}`}
				onClick={data.onClick || noop}
				data-tip={data.tooltip}
				data-for="tooltip-user-list"
			>
				<Icon icon={icons[data.type]} />
			</div>
		));
	}

	renderInvitationStatus() {
		const relation = this.props.userData.relation;
		const request = this.props.userData.friendshipRequest;
		let status = null;

		if (relation === User.RELATIONS.INVITATION_SENT && request.date) {
			status = `sent ${request.date.fromNow()}`;
		}

		if (relation === User.RELATIONS.INVITATION_RECEIVED && request.date) {
			status = `received ${request.date.fromNow()}`;
		}

		if (status) {
			return (
				<div className="friendsListItem__invitationStatus">
					<Icon icon="clock" />
					{status}
				</div>
			);
		}

		return null;
	}

	render() {
		const user = this.props.userData.user;
		const status = user.isOnline() ? get(user, 'status.displayText', 'Online') : 'Offline';
		const invitationStatus = this.renderInvitationStatus();

		return (
			<div className="friendsList__item friendsListItem">
				<div className="friendsListItem__userPreview">
					<UserPreview
						user={user}
						icon={user.isOnline() ? 'online' : 'offline'}
						statusText={status}
						onClick={this.props.onClick}
					/>
					{invitationStatus}
				</div>
				<div className="friendsListItem__actions">{this.renderUserActions()}</div>
			</div>
		);
	}
}

// Injected props
User.wrappedComponent.propTypes = {
	confirm: PropTypes.instanceOf(ConfirmDialog).isRequired,
};

export default User;
