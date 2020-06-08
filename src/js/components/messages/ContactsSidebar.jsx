import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes, observer } from 'mobx-react';
import { observable } from 'mobx';
import ScrollableView from '../ScrollableView';
import UISidebar from '../Sidebar';
import TagsInput from '../TagsInput';
import Loading from '../Loading';
import User from '../../app/User';
import UserPreview from '../../containers/user/UserPreview';
import Icon from '../icons/Icon';

@observer
class ContactsSidebar extends ReactComponent {
	static propTypes = {
		loading: PropTypes.bool,
		view: PropTypes.string,
		selectedContacts: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(User)),
		hasFriends: PropTypes.bool,
		contacts: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(User)),
		groupName: PropTypes.string,
		onContactClick: PropTypes.func,
		onRemoveContact: PropTypes.func,
		onCreateGroup: PropTypes.func,
		onBack: PropTypes.func,
		onSearch: PropTypes.func,
		onStartGroupConversation: PropTypes.func,
		onGroupNameChange: PropTypes.func,
	};

	static defaultProps = {
		view: 'single',
		contacts: [],
		selectedContacts: [],
		hasFriends: false,
		loading: false,
		groupName: '',
		onContactClick: null,
		onRemoveContact: null,
		onCreateGroup: null,
		onBack: null,
		onSearch: null,
		onStartGroupConversation: null,
		onGroupNameChange: null,
	};

	tagsInputRef = null;

	@observable
	searchValue = '';

	searchTimeout = null;

	componentWillUnmount() {
		window.clearTimeout(this.searchTimeout);
	}

	clearSearch = () => {
		this.searchValue = '';
		this.handleSearch();
	};

	handleContactClick = contact => () => {
		if (this.props.onContactClick) {
			this.props.onContactClick(contact);
		}
	};

	handleSearchChange = value => {
		this.searchValue = value;

		window.clearTimeout(this.searchTimeout);

		if (value === '') {
			this.handleSearch();
		} else {
			this.searchTimeout = window.setTimeout(this.handleSearch, 200);
		}
	};

	handleSearch = () => {
		if (this.props.onSearch) {
			this.props.onSearch(this.searchValue);
		}
	};

	handleRemoveContact = tag => {
		if (this.props.onRemoveContact) {
			this.props.onRemoveContact(tag.data);
		}
	};

	handleGroupNameChange = event => {
		if (this.props.onGroupNameChange) {
			this.props.onGroupNameChange(event.target.value);
		}
	};

	renderLoading() {
		return (
			<div className="conversationList__loading">
				<Loading />
			</div>
		);
	}

	renderList() {
		if (!this.props.contacts.length) {
			let message = "You didn't add any friends yet";

			if (this.props.hasFriends) {
				message = 'No result';
			}

			return <div className="messagesSidebar__empty">{message}</div>;
		}

		return this.props.contacts.map(contact => (
			<div key={contact.id} className="messagesSidebar__item" onClick={this.handleContactClick(contact)}>
				<UserPreview user={contact} icon={contact.isOnline() ? 'online' : 'offline'} statusText="" />
			</div>
		));
	}

	renderStartGroupButton() {
		if (this.props.view !== 'single') {
			return null;
		}

		return (
			<div className="messagesSidebar__button">
				<button className="btn btn--main btn--small btn--wide " onClick={this.props.onCreateGroup}>
					NEW GROUP
				</button>
			</div>
		);
	}

	renderSingleSearch() {
		const hasSearch = this.searchValue.trim() !== '';
		const icon = hasSearch ? 'remove' : 'search';

		return (
			<div className="input--search">
				<button className="btn btn--transparent" type="button" onClick={this.clearSearch}>
					<Icon icon={icon} />
				</button>
				<input
					value={this.searchValue}
					className="input--alt1"
					placeholder="Search contacts..."
					onChange={e => this.handleSearchChange(e.target.value)}
				/>
			</div>
		);
	}

	renderGroupSetup() {
		const tags = this.props.selectedContacts.map(contact => ({
			id: contact.id,
			label: contact.username,
			data: contact,
		}));

		let input = null;

		if (tags.length) {
			input = (
				<TagsInput
					ref={ref => {
						this.tagsInputRef = ref;
					}}
					tags={tags}
					searchValue={this.searchValue}
					onRemoveTag={this.handleRemoveContact}
					onSearchChange={this.handleSearchChange}
				/>
			);
		} else {
			input = this.renderSingleSearch();
		}

		return (
			<div>
				{input}
				<div className="messagesSidebar__groupName">
					<span className="messagesSidebar__groupName-preAction">
						<Icon icon="group" />
					</span>
					<span className="messagesSidebar__groupName-postAction" onClick={this.props.onStartGroupConversation}>
						<Icon icon="createGroup" />
					</span>
					<input
						className="input--alt1"
						placeholder="Group name"
						value={this.props.groupName}
						onChange={this.handleGroupNameChange}
					/>
				</div>
			</div>
		);
	}

	render() {
		const content = this.props.loading ? this.renderLoading() : this.renderList();

		const header = this.props.view === 'single' ? this.renderSingleSearch() : this.renderGroupSetup();

		return (
			<UISidebar>
				<div className="messagesSidebar__header sidebar__header">
					<div className="messagesSidebar__headerPre">
						<span onClick={this.props.onBack} className="messagesSidebar__headerAction">
							<Icon icon="arrowLeft" />
						</span>
					</div>
					<div className="messagesSidebar__headerMain">{header}</div>
				</div>
				<div className="messagesSidebar__main">
					<ScrollableView className="messagesSidebar__list">
						<div className="messagesSidebar__scrollableContent">
							{this.renderStartGroupButton()}
							<div className="messagesSidebar__title">Contacts</div>
							{content}
						</div>
					</ScrollableView>
				</div>
			</UISidebar>
		);
	}
}

export default ContactsSidebar;
