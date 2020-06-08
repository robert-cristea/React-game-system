import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import ConversationHistory from '../../../conversations/ConversationHistory';
import MessageInput from '../../../conversations/MessageInput';
import Loading from '../../../Loading';
import User from '../../../../app/User';
import ConversationModel from '../../../../app/Conversation';
import FileUploads from '../../../conversations/FileUploads';
import FileUpload from '../../../../app/FileUpload';

@observer
class Conversation extends Component {
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationModel),
		currentUser: PropTypes.instanceOf(User).isRequired,
		usersTyping: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		loading: PropTypes.bool,
		typingStopTimeout: PropTypes.number,
		canSendTokens: PropTypes.bool,
		fileUploads: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(FileUpload)),
		onSendTokens: PropTypes.func,
		onMessage: PropTypes.func,
		onTypingStarted: PropTypes.func,
		onTypingStopped: PropTypes.func,
		onFilesUpload: PropTypes.func,
		onFileUploadRemove: PropTypes.func,
		onAddEventReaction: PropTypes.func,
		onLoadPreviousEvents: PropTypes.func,
	};

	static defaultProps = {
		conversation: null,
		usersTyping: [],
		loading: false,
		typingStopTimeout: undefined,
		canSendTokens: false,
		fileUploads: [],
		onSendTokens: null,
		onMessage: null,
		onTypingStarted: null,
		onTypingStopped: null,
		onFilesUpload: null,
		onFileUploadRemove: null,
		onAddEventReaction: null,
		onLoadPreviousEvents: null,
	};

	renderConversation() {
		let historyContent = null;
		let inputContent = null;

		if (this.props.conversation) {
			historyContent = (
				<ConversationHistory
					key={this.props.conversation.id}
					events={this.props.conversation.getEvents()}
					currentUser={this.props.currentUser}
					hasMoreEvents={this.props.conversation.hasMoreEvents}
					onAddEventReaction={this.props.onAddEventReaction}
					onLoadPreviousEvents={this.props.onLoadPreviousEvents}
				/>
			);

			inputContent = (
				<Fragment>
					<div className="conversation__fileUploads">
						<FileUploads fileUploads={this.props.fileUploads} onRemove={this.props.onFileUploadRemove} />
					</div>
					<MessageInput
						usersTyping={this.props.usersTyping}
						canSendTokens={this.props.canSendTokens}
						onMessage={this.props.onMessage}
						onTypingStopped={this.props.onTypingStopped}
						onTypingStarted={this.props.onTypingStarted}
						typingStopTimeout={this.props.typingStopTimeout}
						onSendTokens={this.props.onSendTokens}
						onFilesUpload={this.props.onFilesUpload}
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{historyContent}
				<div>{inputContent}</div>
			</Fragment>
		);
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return (
			<div className="conversation__loading">
				<Loading />
			</div>
		);
	}

	render() {
		return (
			<div className="conversation">
				{this.renderLoading()}
				{this.renderConversation()}
			</div>
		);
	}
}

export default Conversation;
