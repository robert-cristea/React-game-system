import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import Component from '../../../../components/screens/routes/messages/Conversation';
import UI from '../../../../app/UI';
import FileUpload from '../../../../app/FileUpload';
import ConversationRepository from '../../../../app/Repositories/ConversationRepository';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';
import Config from '../../../../app/Config';
import UserEvent from '../../../../app/ConversationEvent/UserEvent';
import ToastManager from '../../../../app/ToastManager';

@inject('ui', 'conversationRepository', 'auth', 'config', 'toast')
@observer
class Conversation extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * @type {Conversation|null}
	 */
	@observable
	conversation = null;

	/**
	 * True while we are loading the conversation
	 * @type {boolean}
	 */
	@observable
	loading = false;

	/**
	 * List of users currently typing
	 * @type {ObservableArray<User>}
	 */
	@observable
	usersTyping = [];

	/**
	 * List of current FileUploads
	 * @type {ObservableArray<FileUpload>}
	 */
	@observable
	fileUploads = [];

	@observable
	loadingErrorOccured = false;

	/**
	 * @type {ConversationSocket}
	 */
	socket = null;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	/**
	 * True if we are currently loading previous events (to prevent double loading)
	 * @type {boolean}
	 */
	loadingPreviousEvents = false;

	componentWillMount() {
		this.loadConversation(this.props.match.params.id);
		this.user = this.props.auth.getUser();
		this.loadingPreviousEvents = false;
		this.loadingErrorOccured = false;
	}

	componentWillReceiveProps(newProps) {
		const newId = newProps.match.params.id;
		if (this.props.match.params.id !== newId) {
			this.loadingErrorOccured = false;
			this.loadConversation(newId);
		}
	}

	componentWillUnmount() {
		if (this.socket) {
			this.exitConversation();
			this.closeSocket();
		}

		// Clear the waiting list of file uploads
		this.fileUploads.clear();
	}

	@computed
	get canSendTokens() {
		/**
		 * TMP: The "send tokens" button will be enabled only in a later phase
		 */
		return false;
		/*
		if (!this.conversation) {
			return false;
		}

		return this.conversation.getOtherUsers(this.user).length === 1;
		*/
	}

	loadConversation(id) {
		this.loading = true;
		this.conversation = null;
		this.usersTyping.clear();
		const attributes = this.props.config.get('userAttributes.conversations.view');
		const nbEvents = this.props.config.get('conversations.pageSize');

		if (this.socket) {
			this.exitConversation();
			this.closeSocket();
		}

		this.props.conversationRepository
			.load(id, attributes, nbEvents)
			.then(c => {
				this.conversation = c;
				this.createSocket();
				this.enterConversation();
				this.loading = false;
				this.loadingErrorOccured = false;
			})
			.catch(
				/** @type {ServerError} */ e => {
					this.loading = false;

					// If not found, we redirect to the messages index
					if (e instanceof ServerError && e.is(ServerError.NOT_FOUND)) {
						this.props.toast.error("This conversation doesn't exist.");
						this.props.ui.router.goTo('/dashboard/messages/index');
						return null;
					}

					this.loadingErrorOccured = true;
					this.props.toast.error('Could not load the conversation.');
					return Promise.reject(e);
				},
			);
	}

	closeSocket() {
		this.clearSocketListener();
		this.socket.close();
		this.socket = null;
	}

	createSocket() {
		this.socket = this.conversation.getSocket(true);
		this.socket.open();
		this.listenToSocket();
	}

	/**
	 * Returns true if we can send a user event on the socket (if the socket is opened and a user
	 * still authenticated). We have this check since some events might be sent automatically but
	 * the socket might be already closed or the user logged out.
	 *
	 * @return {boolean}
	 */
	canSendUserEventOnSocket() {
		return this.socket.isOpened() && this.props.auth.isAuthenticated();
	}

	enterConversation() {
		if (!this.canSendUserEventOnSocket()) {
			return;
		}

		this.socket.sendEntered();
	}

	exitConversation() {
		if (!this.canSendUserEventOnSocket()) {
			return;
		}

		this.socket.sendStopTyping();
		this.socket.sendExited();
	}

	clearSocketListener() {
		this.socket.removeListener('event', this.onSocketEvent);
		this.socket.removeListener('error', this.onSocketError);
	}

	listenToSocket() {
		this.socket.addListener('event', this.onSocketEvent);
		this.socket.addListener('error', this.onSocketError);
	}

	/**
	 * Before uploading the files, we validate them (file sizes, types, etc.)
	 * @param {FileList} fileList
	 * @return {boolean}
	 */
	validateFilesUpload(fileList) {
		if (fileList.length === 0) {
			return false;
		}

		// TODO: add more validations as requested

		return true;
	}

	/**
	 * Starts the upload of the next waiting FileUpload in this.fileUploads. Does nothing if already
	 * downloading a file (so we upload one file at a time)
	 */
	runFileUploads() {
		if (this.isUploadingFile()) {
			return;
		}

		/** @type {FileUpload} fileUpload */
		// Get the next file ready to upload
		const fileUpload = this.fileUploads.find(fu => fu.state === FileUpload.STATE_WAITING);

		if (!fileUpload) {
			return;
		}

		fileUpload.state = FileUpload.STATE_UPLOADING;

		this.conversation
			.uploadAttachment(fileUpload.file)
			.then(() => {
				fileUpload.state = FileUpload.STATE_UPLOADED;
				this.fileUploads.remove(fileUpload);
				this.runFileUploads();
			})
			.catch(() => {
				fileUpload.state = FileUpload.STATE_ERROR;
				this.runFileUploads();
			});
	}

	/**
	 * Returns true if one FileUpload is currently being uploaded
	 */
	isUploadingFile() {
		return this.fileUploads.findIndex(fileUpload => fileUpload.state === FileUpload.STATE_UPLOADING) > -1;
	}

	/**
	 * @param {SocketError} error
	 */
	onSocketError = error => {
		// eslint-disable-next-line no-console
		console.error('Socket error:', error);
	};

	/**
	 * @param {AbstractEvent} event
	 */
	onSocketEvent = event => {
		// When a user starts or stops typing, add or remove it from this.usersTyping
		if (event.type === UserEvent.TYPING_STARTED) {
			const user = event.user;
			if (this.usersTyping.indexOf(user) === -1) {
				this.usersTyping.push(user);
			}
		} else if (event.type === UserEvent.TYPING_STOPPED) {
			this.usersTyping.remove(event.user);
		}
	};

	handleCurrentUserMessage = content => {
		if (!this.canSendUserEventOnSocket()) {
			return;
		}

		this.socket.sendTextMessage(content);
	};

	handleTypingStarted = () => {
		if (!this.canSendUserEventOnSocket()) {
			return;
		}

		this.socket.sendStartTyping();
	};

	handleTypingStopped = () => {
		if (!this.canSendUserEventOnSocket()) {
			return;
		}

		this.socket.sendStopTyping();
	};

	handleSendTokens = () => {
		const otherUsers = this.conversation.getOtherUsers(this.user);
		this.props.ui.showSendTokensModal(otherUsers[0]);
	};

	/**
	 * @param {FileList} fileList
	 */
	handleFilesUpload = fileList => {
		if (!this.validateFilesUpload(fileList)) {
			return;
		}

		for (let i = 0; i < fileList.length; i += 1) {
			const file = fileList.item(i);
			const fileUpload = new FileUpload(file);
			this.fileUploads.push(fileUpload);
		}

		this.runFileUploads();
	};

	handleFileUploadRemove = fileUpload => {
		this.fileUploads.remove(fileUpload);
	};

	/**
	 * @param {string} reaction
	 * @param {MessageEvent} conversationEvent
	 */
	handleAddReaction = (reaction, conversationEvent) => {
		this.socket.addReaction(conversationEvent, reaction);
	};

	handleLoadPreviousEvents = () => {
		if (!this.conversation || this.loadingPreviousEvents) {
			return;
		}

		this.loadingPreviousEvents = true;

		const nb = this.props.config.get('conversations.pageSize', 10);

		this.conversation
			.loadMoreEvents(nb)
			.then(() => {
				this.loadingErrorOccured = false;
				this.loadingPreviousEvents = false;
			})
			.catch(e => {
				this.loadingPreviousEvents = false;
				this.loadingErrorOccured = true;
				this.props.toast.error('Could not load previous messages');
				return Promise.reject(e);
			});
	};

	render() {
		const typingStopTimeout = this.props.config.get('conversations.typingStopTimeout', 2000);

		return (
			<Component
				loading={this.loading}
				conversation={this.conversation}
				currentUser={this.user}
				usersTyping={this.usersTyping}
				canSendTokens={this.canSendTokens}
				typingStopTimeout={typingStopTimeout}
				fileUploads={this.fileUploads}
				onMessage={this.handleCurrentUserMessage}
				onTypingStarted={this.handleTypingStarted}
				onTypingStopped={this.handleTypingStopped}
				onSendTokens={this.handleSendTokens}
				onFilesUpload={this.handleFilesUpload}
				onFileUploadRemove={this.handleFileUploadRemove}
				onAddEventReaction={this.handleAddReaction}
				onLoadPreviousEvents={this.handleLoadPreviousEvents}
			/>
		);
	}
}

// Injected props
Conversation.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Conversation;
