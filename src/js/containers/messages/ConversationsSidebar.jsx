import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../components/messages/ConversationsSidebar';
import UI from '../../app/UI';
import Config from '../../app/Config';
import Authentication from '../../app/Authentication';
import Conversation from '../../app/Conversation';
import ConversationRepository from '../../app/Repositories/ConversationRepository';
import ToastManager from '../../app/ToastManager';

@inject('ui', 'conversationRepository', 'config', 'auth', 'toast')
@observer
class ConversationsSidebar extends ReactComponent {
	static propTypes = {
		currentConversation: PropTypes.instanceOf(Conversation),
		onNewConversation: PropTypes.func,
	};
	static defaultProps = {
		currentConversation: null,
		onNewConversation: null,
	};

	/**
	 * True if we are currently loading the list of categories
	 * @type {boolean}
	 */
	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadConversations();
	}

	loadConversations() {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		this.loading = true;
		const attributes = this.props.config.get('userAttributes.conversations.list');
		// For now, we force a reload (until we have the async update)
		repo
			.loadAll(attributes, 2, true)
			.then(() => {
				this.loading = false;
				repo.sortByLastMessage();
			})
			.catch(e => {
				this.loading = false;
				this.props.toast.error('Could not load your conversations');
				return Promise.reject(e);
			});
	}

	handleSearch = query => {
		// TODO
		// eslint-disable-next-line no-console
		console.log('TODO: search with query: ', query);
	};

	handleConversationClick = conversation => {
		this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
	};

	render() {
		return (
			<Component
				loading={this.loading}
				currentUser={this.user}
				conversations={this.props.conversationRepository.getConversations()}
				onConversationClick={this.handleConversationClick}
				onSearch={this.handleSearch}
				{...this.props}
			/>
		);
	}
}

// Injected props
ConversationsSidebar.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default ConversationsSidebar;
