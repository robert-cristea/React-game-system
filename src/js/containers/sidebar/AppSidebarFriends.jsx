import React, { Component as ReactComponent } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Component from '../../components/sidebar/AppSidebarFriends';
import UI from '../../app/UI';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';
import ConversationRepository from '../../app/Repositories/ConversationRepository';

@inject('ui', 'auth', 'config', 'conversationRepository')
@observer
class AppSidebarFriends extends ReactComponent {
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
	loadingFriends = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.didMount = false;
		this.user = this.props.auth.getUser();
		this.loadFriends();
	}

	componentDidMount() {
		this.didMount = true;
	}

	loadFriends() {
		this.loadingFriends = true;
		const attributes = this.props.config.get('userAttributes.friendsList');
		// For now, we force a reload (until we have the async update)
		this.user.loadFriends(attributes, true).then(() => {
			this.loadingFriends = false;
		});
	}

	handleFriendClick = friend => {
		this.props.ui.router.goTo(`/dashboard/friends/${friend.id}`);
	};

	handleSendMessageClick = user => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		// if a conversation with the user already exists, `create` will return it
		// we only create or retrieve it for its id, we will redirect
		repo.create([user], false, ['id']).then(conversation => {
			this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
		});
	};

	render() {
		return (
			<Component
				friends={this.user.getFriends()}
				loadingFriends={this.loadingFriends}
				onFriendClick={this.handleFriendClick}
				onSendMessageClick={this.handleSendMessageClick}
			/>
		);
	}
}

// Injected props
AppSidebarFriends.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
};

export default AppSidebarFriends;
