import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../../../components/screens/routes/messages/New';
import UI from '../../../../app/UI';
import Authentication from '../../../../app/Authentication';
import ConversationRepository from '../../../../app/Repositories/ConversationRepository';
import Config from '../../../../app/Config';

@inject('ui', 'auth', 'conversationRepository', 'config')
@observer
class New extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	/**
	 * True if we are loading the friends list
	 * @type {boolean}
	 */
	@observable
	loading = false;

	/**
	 * True if we are creating a new conversation with a list of users
	 * @type {boolean}
	 */
	@observable
	creating = false;

	/**
	 * List of currently selected users
	 * @type {ObservableArray<User>}
	 */
	@observable
	selectedUsers = [];

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		const attributes = this.props.config.get('userAttributes.conversations.new');

		this.loading = true;
		// For now, always reload the friends list until we have an async socket
		this.user
			.loadFriends(attributes, true)
			.then(() => {
				this.loading = false;
			})
			.catch(e => {
				this.loading = false;
				return Promise.reject(e);
			});
	}

	handleUserClick = user => {
		if (this.selectedUsers.indexOf(user) === -1) {
			this.selectedUsers.push(user);
		} else {
			this.selectedUsers.remove(user);
		}
	};

	handleStartConversation = () => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		const existing = repo.findConversationWith(this.selectedUsers);

		if (existing !== null) {
			this.props.ui.router.goTo(`/dashboard/messages/conversation/${existing.id}`);
			return;
		}

		this.creating = true;

		repo
			.create(this.selectedUsers, null, ['username', 'avatar'])
			.then(conversation => {
				this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
			})
			.catch(e => {
				this.creating = false;
				return Promise.reject(e);
			});
	};

	handleGoToFriends = () => {
		this.props.ui.router.goTo('/dashboard/friends');
	};

	render() {
		return (
			<Component
				loading={this.loading}
				creating={this.creating}
				users={this.user.getFriends()}
				selectedUsers={this.selectedUsers}
				onUserClick={this.handleUserClick}
				onStartConversation={this.handleStartConversation}
				onGoToFriends={this.handleGoToFriends}
			/>
		);
	}
}

// Injected props
New.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default New;
