import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import ConversationRepository from '../../app/Repositories/ConversationRepository';
import ConversationsContainer from './ConversationsSidebar';
import ContactsContainer from './ContactsSidebar';
import Config from '../../app/Config';
import UI from '../../app/UI';
import ToastManager from '../../app/ToastManager';

@inject('conversationRepository', 'config', 'ui', 'toast')
@observer
class Sidebar extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};

	static defaultProps = {};

	/**
	 * @type {'conversationsList'|'contactsList'}
	 */
	@observable
	view = 'conversationsList';

	/**
	 * True if currently creating a conversation (to prevent creating multiple conversation at the
	 * same time if network is slow)
	 * @type {boolean}
	 */
	working = false;

	componentWillMount() {
		this.view = 'conversationsList';
		this.working = false;
	}

	componentWillUnmount() {
		this.working = false;
	}

	handleNewConversation = () => {
		this.view = 'contactsList';
	};

	handleBack = () => {
		this.view = 'conversationsList';
	};

	handleStartConversation = (contacts, groupName = '') => {
		if (this.working) {
			return;
		}

		if (!Array.isArray(contacts)) {
			this.handleStartConversation([contacts], groupName);
			return;
		}

		this.working = true;

		this.props.conversationRepository
			.create(contacts, groupName, ['id'])
			.then(conversation => {
				// If we didn't leave
				if (this.working) {
					this.working = false;
					this.view = 'conversationsList';
					this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
				}
			})
			.catch(e => {
				this.working = false;
				this.props.toast.error('Could not start the conversation');
				return Promise.reject(e);
			});
	};

	getCurrentConversation() {
		const id = this.props.match.params.id;

		if (typeof id === 'string') {
			return this.props.conversationRepository.retrieve(id);
		}

		return null;
	}

	renderConversations() {
		return (
			<ConversationsContainer
				currentConversation={this.getCurrentConversation()}
				onNewConversation={this.handleNewConversation}
			/>
		);
	}

	renderContacts() {
		return <ContactsContainer onStartConversation={this.handleStartConversation} onBack={this.handleBack} />;
	}

	render() {
		if (this.view === 'contactsList') {
			return this.renderContacts();
		}

		return this.renderConversations();
	}
}

// Injected props
Sidebar.wrappedComponent.propTypes = {
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Sidebar;
