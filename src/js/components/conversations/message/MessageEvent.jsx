import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import MessageEventModel from '../../../app/ConversationEvent/MessageEvent';
import Avatar from '../../user/Avatar';
import Icon from '../../icons/Icon';
import AttachmentMessage from '../../../app/ConversationMessage/AttachmentMessage';
import AttachmentMessageComponent from '../AttachmentMessage';
import TextMessageComponent from '../TextMessage';

@observer
class MessageEvent extends Component {
	static propTypes = {
		event: PropTypes.instanceOf(MessageEventModel).isRequired,
		isCurrentUser: PropTypes.bool,
		onReactionSelectorClick: PropTypes.func,
	};

	static defaultProps = {
		isCurrentUser: false,
		onReactionSelectorClick: null,
	};

	renderMessage() {
		const message = this.props.event.message;

		if (message instanceof AttachmentMessage) {
			return <AttachmentMessageComponent date={this.props.event.date} message={message} />;
		}

		return (
			<TextMessageComponent date={this.props.event.date} message={message} isCurrentUser={this.props.isCurrentUser} />
		);
	}

	renderReactions() {
		const reactions = this.props.event.reactions;

		if (!reactions.length) {
			return null;
		}

		return reactions.map(reaction => (
			<div className="conversationMessage__reaction" key={reaction}>
				{reaction}
			</div>
		));
	}

	render() {
		const message = this.props.event.message;
		const ownerClassSuffix = this.props.isCurrentUser ? 'mine' : 'their';

		return (
			<div className={`conversationMessage conversationMessage--${ownerClassSuffix}`}>
				<div className="conversationMessage__avatar">
					<Avatar user={message.user} />
				</div>
				<div className="conversationMessage__content">
					<div className="conversationMessage__addReaction" onClick={this.props.onReactionSelectorClick}>
						<Icon icon="smile" />
					</div>
					{this.renderMessage()}
					<div className="conversationMessage__reactions">{this.renderReactions()}</div>
				</div>
			</div>
		);
	}
}

export default MessageEvent;
