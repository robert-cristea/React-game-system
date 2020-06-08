import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ConversationModel from '../../app/Conversation';
import UserPreview from '../../containers/user/UserPreview';
import User from '../../app/User';
import Icon from '../icons/Icon';

@observer
class Conversation extends Component {
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationModel).isRequired,
		currentUser: PropTypes.instanceOf(User),
	};

	static defaultProps = {
		currentUser: null,
	};

	otherUsers = null;

	componentWillMount() {
		this.otherUsers = null;
	}

	getOtherUsers() {
		if (this.otherUsers === null) {
			if (this.props.currentUser) {
				this.otherUsers = this.props.conversation.getOtherUsers(this.props.currentUser);
			} else {
				this.otherUsers = this.props.conversation.users;
			}
		}

		return this.otherUsers;
	}

	getMainUser() {
		return this.getOtherUsers()[0];
	}

	getTitle() {
		const { conversation } = this.props;

		if (conversation.title) {
			return conversation.title;
		}

		if (this.isSingleUser()) {
			return this.getMainUser().username;
		}

		return this.getOtherUsers()
			.map(user => user.username)
			.join(', ');
	}

	getStatus() {
		if (this.isSingleUser()) {
			const latestMessage = this.props.conversation.getLatestTextMessageEvent();

			return latestMessage ? latestMessage.message.content : 'No recent conversations';
		}

		return this.getParticipantNameList();
	}

	getParticipantNameList() {
		const names = this.getOtherUsers().map(user => user.username);

		if (names.length > 3) {
			const extra = names.length - 3;
			return `${names[0]}, ${names[1]}, ${names[2]}, +${extra}`;
		}

		return names.join(', ');
	}

	getIcon() {
		if (this.isSingleUser()) {
			return this.getMainUser().isOnline() ? 'online' : 'offline';
		}

		return (
			<span className="conversationPreview__stateIcon">
				<Icon icon="group" />
			</span>
		);
	}

	/**
	 * Returns true if the conversation is with a single user.
	 * @return {boolean}
	 */
	isSingleUser() {
		return this.getOtherUsers().length === 1;
	}

	render() {
		return (
			<UserPreview
				user={this.getMainUser()}
				statusText={this.getStatus()}
				title={this.getTitle()}
				icon={this.getIcon()}
			/>
		);
	}
}

export default Conversation;
