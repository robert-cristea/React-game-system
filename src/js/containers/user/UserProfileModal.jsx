import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import UI from '../../app/UI';
import Component from '../../components/screens/routes/home/UserProfile';
import UserRepository from '../../app/Repositories/UserRepository';
import Config from '../../app/Config';
import Authentication from '../../app/Authentication';
import ConversationRepository from '../../app/Repositories/ConversationRepository';

@inject('ui', 'userRepository', 'config', 'auth', 'conversationRepository')
@observer
class UserProfileModal extends ReactComponent {
	static propTypes = {
		userId: PropTypes.string.isRequired,
		onBack: PropTypes.func,
	};
	static defaultProps = {
		onBack: null,
	};

	@observable
	loading = false;

	@observable
	user = null;

	mockFriends = [];

	componentWillMount() {
		this.loading = false;
		this.loadUser();
	}

	componentWillReceiveProps(newProps) {
		if (this.props.userId !== newProps.userId) {
			this.loadUser(newProps.userId);
		}
	}

	@computed
	get external() {
		if (this.props.userId && this.props.ui.loggedIn) {
			return this.props.userId !== this.props.auth.getUser().id;
		}
		return true;
	}

	loadUser(userId = this.props.userId) {
		this.loading = true;
		this.user = null;

		/** @type {UserRepository} */
		const repo = this.props.userRepository;
		const attributes = this.props.config.get('userAttributes.details.user');
		const friendAttributes = this.props.config.get('userAttributes.details.friends');
		repo
			.load(userId, attributes, false)
			.then(user => {
				// this.user = user;
				// this.loading = false;

				// TMP: for the demo, we load mock friends of the user by using the current user + current user's friends
				const currentUser = this.props.auth.getUser();
				currentUser
					.fill(friendAttributes)
					.then(() => currentUser.loadFriends(friendAttributes))
					.then(friends => {
						this.mockFriends = [currentUser, ...friends.filter(f => f.id !== user.id)];
						this.user = user;
						this.loading = false;
					});
				// END TMP
			})
			.catch(e => {
				this.props.ui.router.goTo('/dashboard/friends');
				return Promise.reject(e);
			});
	}

	handleWatchStreamClick = () => {
		// this.props.ui.router.goTo(`/dashboard/live/index/${this.props.user.stream.id}`);
	};

	handleSendMessageClick = () => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		// if a conversation with the user already exists, `create` will return it
		// we only create or retrieve it for its id, we will redirect
		repo.create([this.user], false, ['id']).then(conversation => {
			this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
		});
	};

	render() {
		return (
			<Component
				user={this.user}
				mockFriends={this.mockFriends}
				loading={this.loading}
				external={this.external}
				onBack={this.props.onBack}
				onSendMessageClick={this.handleSendMessageClick}
				onWatchStreamClick={this.handleWatchStreamClick}
			/>
		);
	}
}

// Injected props
UserProfileModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
};

export default UserProfileModal;
