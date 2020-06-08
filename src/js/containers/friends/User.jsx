import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Component from '../../components/friends/User';
import FriendRequest from '../../app/FriendRequest';
import UI from '../../app/UI';
import Authentication from '../../app/Authentication';
import ReceivedFriendRequestRepository from '../../app/Repositories/ReceivedFriendRequestRepository';
import SentFriendRequestRepository from '../../app/Repositories/SentFriendRequestRepository';
import UserRepository from '../../app/Repositories/UserRepository';
import ConversationRepository from '../../app/Repositories/ConversationRepository';
import ToastManager from '../../app/ToastManager';

@inject(
	'ui',
	'auth',
	'receivedFriendRequestRepository',
	'sentFriendRequestRepository',
	'userRepository',
	'conversationRepository',
	'toast',
)
class User extends ReactComponent {
	static propTypes = {
		userData: PropTypes.shape({
			relation: PropTypes.string,
			user: PropTypes.instanceOf(User),
			friendshipRequest: PropTypes.instanceOf(FriendRequest),
		}).isRequired,
	};

	static defaultProps = {};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.user = this.props.auth.getUser();
	}

	handleAcceptInvitation = () => {
		/**
		 * @type {ReceivedFriendRequestRepository}
		 */
		const repo = this.props.receivedFriendRequestRepository;
		const user = this.props.userData.user;
		const invitation = this.props.userData.friendshipRequest;

		if (invitation) {
			repo
				.accept(invitation)
				.then(() => {
					this.props.toast.info(`${user.username}'s friend request accepted.`);
				})
				.catch(e => {
					this.props.toast.error(`Error while accepting ${user.username}'s friend request.`);
					return Promise.reject(e);
				});
		}
	};

	handleRejectInvitation = () => {
		/** @type {ReceivedFriendRequestRepository} */
		const repo = this.props.receivedFriendRequestRepository;
		const user = this.props.userData.user;
		const invitation = this.props.userData.friendshipRequest;

		if (invitation) {
			repo.reject(invitation).catch(e => {
				this.props.toast.error(`Error while declining ${user.username}'s friend request.`);
				return Promise.reject(e);
			});
		}
	};
	handleCancelInvitation = () => {
		/** @type {SentFriendRequestRepository} */
		const repo = this.props.sentFriendRequestRepository;
		const invitation = this.props.userData.friendshipRequest;

		this.props.toast.info('Friend request canceled');
		repo.cancel(invitation).catch(e => {
			this.props.toast.error('Could not cancel the friend request');
			return Promise.reject(e);
		});
	};

	handleUnfriend = () => {
		const user = this.props.userData.user;
		this.user.unfriend(user).catch(e => {
			this.props.toast.error(`Could not remove ${user.username} from your friends.`);
			return Promise.reject(e);
		});
	};

	handleSendFriendRequest = () => {
		const otherUser = this.props.userData.user;
		this.props.toast.info(`Friend request sent to ${otherUser.username}`);
		this.user.inviteUser(otherUser).catch(e => {
			this.props.toast.error(`Could not send a friend request to ${otherUser.username}`);
			return Promise.reject(e);
		});
	};

	handleStartConversion = () => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		const user = this.props.userData.user;
		// if a conversation with the user already exists, `create` will return it
		// we only create or retrieve it for its id, we will redirect
		repo.create([user], false, ['id']).then(conversation => {
			this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
		});
	};

	handleClick = () => {
		const user = this.props.userData.user;
		this.props.ui.router.goTo(`/dashboard/friends/${user.id}`);
	};

	handleSendTokens = () => {
		const user = this.props.userData.user;
		this.props.ui.showSendTokensModal(user);
	};

	render() {
		return (
			<Component
				userData={this.props.userData}
				onClick={this.handleClick}
				onAcceptInvitation={this.handleAcceptInvitation}
				onCancelInvitation={this.handleCancelInvitation}
				onRejectInvitation={this.handleRejectInvitation}
				onSendFriendRequest={this.handleSendFriendRequest}
				onSendTokens={this.handleSendTokens}
				onStartConversation={this.handleStartConversion}
				onUnfriend={this.handleUnfriend}
			/>
		);
	}
}

// Injected props
User.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	receivedFriendRequestRepository: PropTypes.instanceOf(ReceivedFriendRequestRepository).isRequired,
	sentFriendRequestRepository: PropTypes.instanceOf(SentFriendRequestRepository).isRequired,
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default User;
