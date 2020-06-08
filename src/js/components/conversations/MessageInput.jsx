import React, { Component } from 'react';
import { observable } from 'mobx';
import last from 'lodash/last';
import initial from 'lodash/initial';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';
import User from '../../app/User';

const EMOJIS = [
	'😘',
	'☺',
	'😗',
	'😄',
	'😝',
	'👻',
	'🙈',
	'🙉',
	'🙊',
	'👶',
	'👦',
	'👧',
	'🙆',
	'💁',
	'👰',
	'👼',
	'👯',
	'🛀',
	'🏄',
	'🚴',
	'💪',
	'💏',
	'👭',
	'✌',
	'👍',
	'👊',
	'🙏',
	'👅',
	'👄',
	'💋',
	'💞',
	'💥',
	'💦',
	'💨',
	'👙',
	'👑',
	'💍',
	'💎',
	'🐼',
	'🐰',
	'🐘',
	'🐬',
	'🐟',
	'🌻',
	'🍟',
	'🍕',
	'🎂',
	'🍰',
	'🍫',
	'🍬',
	'🍭',
	'☕',
	'🍷',
	'🍸',
	'🍹',
	'🍺',
	'🍻',
	'🌏',
	'🌋',
	'🗼',
	'🗽',
	'⛺',
	'🌃',
	'🌆',
	'🌉',
	'🚗',
	'🚚',
	'⛽',
	'🚢',
	'🚀',
	'🚽',
	'🌛',
	'🌚',
	'🌟',
	'🌞',
	'🌂',
	'☔',
	'⛄',
	'🔥',
	'⚡',
	'🎆',
	'🎇',
	'✨',
	'🎈',
	'🎉',
	'🎊',
	'🎋',
	'🎍',
	'🎏',
	'🎀',
	'🎁',
	'🏆',
	'⚽',
	'🏀',
	'🏈',
	'🎲',
	'🎮',
	'🎱',
	'📢',
	'🔊',
	'🔇',
	'🔔',
	'🔕',
	'🎵',
	'🎤',
	'🎧',
	'🎷',
	'📱',
	'🔌',
	'🎥',
	'📷',
	'📺',
	'🔎',
	'💡',
	'🔦',
	'📕',
	'📚',
	'💰',
	'💵',
];

@observer
class MessageInput extends Component {
	static propTypes = {
		typingStopTimeout: PropTypes.number,
		usersTyping: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(User)),
		canSendTokens: PropTypes.bool,
		onMessage: PropTypes.func,
		onSendTokens: PropTypes.func,
		onTypingStarted: PropTypes.func,
		onTypingStopped: PropTypes.func,
		onFilesUpload: PropTypes.func,
	};

	static defaultProps = {
		typingStopTimeout: 2000,
		usersTyping: [],
		canSendTokens: false,
		onMessage: null,
		onSendTokens: null,
		onTypingStarted: null,
		onTypingStopped: null,
		onFilesUpload: null,
	};

	/**
	 * Value currently in the input
	 * @type {string}
	 */
	@observable
	message = '';

	/**
	 * When true, the emojis selector is opened
	 * @type {boolean}
	 */
	@observable
	emojisSelectorOpened = false;

	/**
	 * Reference to the text input element
	 * @type {Element}
	 */
	inputRef = null;

	/**
	 * Reference to the file upload input element
	 * @type {Element}
	 */
	fileUploadRef = null;

	typingTimeout = null;

	componentWillUnmount() {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
	}

	clearField() {
		this.message = '';
	}

	handleTyping = () => {
		const alreadyStarted = !!this.typingTimeout;

		if (alreadyStarted) {
			clearTimeout(this.typingTimeout);
		}

		this.typingTimeout = setTimeout(this.handleTypingStopped, this.props.typingStopTimeout);

		if (!alreadyStarted && this.props.onTypingStarted) {
			this.props.onTypingStarted();
		}
	};

	handleTypingStopped = () => {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
		this.typingTimeout = null;
		if (this.props.onTypingStopped) {
			this.props.onTypingStopped();
		}
	};

	handleMessageChange = event => {
		this.message = event.target.value;

		// If the message is not empty, we consider the user is typing
		if (this.message.length) {
			this.handleTyping();
		} else {
			this.handleTypingStopped();
		}
	};

	/**
	 * @param {KeyboardEvent} event
	 */
	handleKeyPress = event => {
		if (event.key === 'Enter') {
			this.handleSubmit();
		}
	};

	handleSubmit = () => {
		const value = this.message.trim();
		this.clearField();
		this.handleTypingStopped();

		if (value && this.props.onMessage) {
			this.props.onMessage(value);
		}
	};

	openEmojisSelector() {
		this.emojisSelectorOpened = true;
	}

	closeEmojisSelector() {
		this.emojisSelectorOpened = false;
	}

	handleEmojisClick = () => {
		if (this.emojisSelectorOpened) {
			this.closeEmojisSelector();
		} else {
			this.openEmojisSelector();
		}
	};

	handleEmojiClicked(emoji) {
		this.message += emoji;
		this.closeEmojisSelector();
		this.inputRef.focus();
		this.handleTyping();
	}

	handleFileUploadClick = () => {
		this.fileUploadRef.click();
	};

	handleFilesSelected = event => {
		event.stopPropagation();
		event.preventDefault();

		if (this.props.onFilesUpload) {
			this.props.onFilesUpload(event.target.files);
		}
	};

	renderEmojisSelector() {
		const emojiComponents = EMOJIS.map(emoji => (
			<span
				key={emoji}
				className="conversationCompose__emojiItem"
				onClick={() => {
					this.handleEmojiClicked(emoji);
				}}
			>
				{emoji}
			</span>
		));
		return (
			<div className="conversationCompose__emojisSelector">
				<div className="conversationCompose__emojis">{emojiComponents}</div>
			</div>
		);
	}

	renderUsersTyping() {
		const users = this.props.usersTyping;
		let message = '';

		if (users.length > 0) {
			const names = users.map(user => user.username);
			const maxUsers = 3;

			if (users.length === 1) {
				message = `${names[0]} is typing`;
			} else if (users.length <= maxUsers) {
				message = `${initial(names).join(', ')} and ${last(names)} are typing`;
			} else {
				message = `${names.slice(0, 3).join(', ')} and others are typing`;
			}
		}

		return <div className="conversationCompose__typingEvent">{message}</div>;
	}

	render() {
		const emojisSelector = this.renderEmojisSelector();

		return (
			<div className="conversationCompose">
				<input
					type="file"
					multiple
					ref={ref => {
						this.fileUploadRef = ref;
					}}
					onChange={this.handleFilesSelected}
					style={{ display: 'none' }}
				/>
				{this.emojisSelectorOpened ? emojisSelector : null}
				<Icon icon="friends" onClick={this.handleEmojisClick} />
				<Icon icon="paperclip" onClick={this.handleFileUploadClick} />
				{this.props.canSendTokens && <Icon icon="logo" onClick={this.props.onSendTokens} />}
				<div className="conversationCompose__inputContainer">
					<input
						className="input--alt1"
						ref={n => {
							this.inputRef = n;
						}}
						value={this.message}
						placeholder="Write a message..."
						onChange={this.handleMessageChange}
						onKeyPress={this.handleKeyPress}
					/>
					{this.renderUsersTyping()}
				</div>
				<Icon icon="paper-plane" onClick={this.handleSubmit} />
			</div>
		);
	}
}

export default MessageInput;
