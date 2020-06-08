import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import Component from '../../components/messages/ContactsSidebar';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';

@inject('auth', 'config')
@observer
class ContactsSidebar extends ReactComponent {
	static propTypes = {
		onStartConversation: PropTypes.func,
		onBack: PropTypes.func,
	};

	static defaultProps = {
		onStartConversation: null,
		onBack: null,
	};

	@observable
	loadingFriends = false;

	/**
	 * @type {ObservableArray}
	 */
	@observable
	selectedContacts = [];

	@observable
	groupName = '';

	@observable
	search = '';

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	/**
	 * @type {'single'|'group'}
	 */
	@observable
	view = 'single';

	componentRef = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.view = 'single';
		this.groupName = '';
		this.loadingFriends = false;
		this.search = '';
		this.loadFriends();
	}

	loadFriends() {
		this.loadingFriends = true;
		const attributes = this.props.config.get('userAttributes.conversations.list');
		// For now, we force a reload (until we have the async update)
		this.user.loadFriends(attributes, true).then(() => {
			this.loadingFriends = false;
		});
	}

	getContacts() {
		const friends = this.user.getFriends();

		if (this.search === '') {
			return friends;
		}

		return friends.filter(friend => {
			/** @type {User} friend */
			if (friend.username.includes(this.search)) {
				return true;
			}

			if (friend.email.includes(this.search)) {
				return true;
			}

			return friend.name.includes(this.search);
		});
	}

	handleContactClick = contact => {
		if (this.view === 'single') {
			if (this.props.onStartConversation) {
				this.props.onStartConversation(contact);
			}
		} else if (this.selectedContacts.indexOf(contact) === -1) {
			this.selectedContacts.push(contact);
		}
	};

	handleRemoveContact = contact => {
		this.selectedContacts.remove(contact);
	};

	handleCreateGroup = () => {
		this.selectedContacts.clear();
		this.view = 'group';
	};

	handleStartGroupConversation = () => {
		const groupName = this.groupName.trim();

		if (!groupName.length) {
			return;
		}

		if (!this.selectedContacts.length) {
			return;
		}

		// selectedContacts is an observable array but we must pass a regular array
		const contacts = this.selectedContacts.peek();

		if (this.props.onStartConversation) {
			this.props.onStartConversation(contacts, groupName);
		}
	};

	handleGroupNameChange = name => {
		this.groupName = name;
	};

	handleBack = () => {
		if (this.view === 'group') {
			this.view = 'single';
		} else if (this.props.onBack) {
			this.props.onBack();
		}
	};

	handleSearch = searchValue => {
		this.search = searchValue.trim();
	};

	render() {
		return (
			<Component
				ref={ref => {
					this.componentRef = ref;
				}}
				view={this.view}
				loading={this.loadingFriends}
				selectedContacts={this.selectedContacts}
				hasFriends={this.user.getFriends().length > 0}
				contacts={this.getContacts()}
				groupName={this.groupName}
				onGroupNameChange={this.handleGroupNameChange}
				onContactClick={this.handleContactClick}
				onCreateGroup={this.handleCreateGroup}
				onBack={this.handleBack}
				onRemoveContact={this.handleRemoveContact}
				onStartGroupConversation={this.handleStartGroupConversation}
				onSearch={this.handleSearch}
			/>
		);
	}
}

// Injected props
ContactsSidebar.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default ContactsSidebar;
