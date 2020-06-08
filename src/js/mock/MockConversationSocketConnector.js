/* eslint-disable no-plusplus */
import sample from 'lodash/sample';
import AbstractSocketConnector from '../app/Server/SocketConnector/AbstractSocketConnector';
import MessageEvent from '../app/ConversationEvent/MessageEvent';
import TextMessage from '../app/ConversationMessage/TextMessage';
import UserEvent from '../app/ConversationEvent/UserEvent';

let eventId = 900;

class MockConversationSocketConnector extends AbstractSocketConnector {
	/**
	 * @type {Conversation}
	 * @protected
	 */
	conversation;

	delay = 200;

	loggingEnabled = true;

	constructor(conversation) {
		super();
		this.conversation = conversation;
		// eslint-disable-next-line no-console
		console.debug('MockConversationSocketConnector: send the "help" message to show options.');
	}

	send(data) {
		this.log('MockConversationSocketConnector: sending', data);
		this.analyseData(data);
	}

	analyseData(data) {
		if (data.type === MessageEvent.TYPE_SEND) {
			if (data.message.content === 'help') {
				this.simulateMessage(
					'Type the following messages to trigger events:\n' +
						'  - typingStarted [index]: Simulates the user with index starting typing\n' +
						'  - typingStopped [index]: Simulates the user with index stopped typing\n' +
						'  - message [index] [message]: Simulates the user with index sent the message\n' +
						'  - entered [index]: Simulates user with index entered\n' +
						'  - exited [index]: Simulates user with index exited\n' +
						'  - left [index]: Simulates user with index left\n' +
						'  - joined [id]: Simulates user with id joined\n' +
						'',
				);
			}

			if (data.message.content.indexOf('entered') === 0) {
				const index = parseInt(data.message.content.split(' ')[1], 10);
				const user = this.conversation.users[index];
				this.simulateUserEntered(user);
			}

			if (data.message.content.indexOf('message') === 0) {
				const content = data.message.content.split(' ');
				const index = parseInt(content[1], 10);
				const user = this.conversation.users[index];
				content[0] = '';
				content[1] = '';
				const message = content.join(' ');
				this.simulateMessage(message, user);
			}

			if (data.message.content.indexOf('exited') === 0) {
				const index = parseInt(data.message.content.split(' ')[1], 10);
				const user = this.conversation.users[index];
				this.simulateUserExited(user);
			}

			if (data.message.content.indexOf('left') === 0) {
				const index = parseInt(data.message.content.split(' ')[1], 10);
				const user = this.conversation.users[index];
				this.simulateUserLeft(user);
			}

			if (data.message.content.indexOf('joined') === 0) {
				const id = data.message.content.split(' ')[1];
				this.simulateUserJoined(id);
			}

			if (data.message.content.indexOf('typingStarted') === 0) {
				const index = parseInt(data.message.content.split(' ')[1], 10);
				const user = this.conversation.users[index];
				this.simulateTypingStarted(user);
			}

			if (data.message.content.indexOf('typingStopped') === 0) {
				const index = parseInt(data.message.content.split(' ')[1], 10);
				const user = this.conversation.users[index];
				this.simulateTypingStopped(user);
			}
		}
	}

	simulateMessage(content) {
		const user = sample(this.conversation.users);
		const message = TextMessage.create(TextMessage.TYPE, content, user);
		const event = MessageEvent.create(MessageEvent.TYPE_SEND, message);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulateUserEntered(user) {
		const event = UserEvent.create(UserEvent.TYPE_ENTERED, user);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulateUserExited(user) {
		const event = UserEvent.create(UserEvent.TYPE_EXITED, user);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulateUserLeft(user) {
		const event = UserEvent.create(UserEvent.TYPE_LEFT, user);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulateUserJoined(id) {
		const event = UserEvent.create(UserEvent.TYPE_JOINED, null);
		event.id = `e_${eventId++}`;
		event.user = { id };
		this.simulate(event.serialize());
	}

	simulateTypingStarted(user) {
		const event = UserEvent.create(UserEvent.TYPING_STARTED, user);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulateTypingStopped(user) {
		const event = UserEvent.create(UserEvent.TYPING_STOPPED, user);
		event.id = `e_${eventId++}`;
		this.simulate(event.serialize());
	}

	simulate(data) {
		setTimeout(() => {
			this.emit(AbstractSocketConnector.EVENT_DATA, data);
		}, this.delay);
	}

	log(...args) {
		if (this.loggingEnabled) {
			// eslint-disable-next-line no-console
			console.debug(...args);
		}
	}
}

export default MockConversationSocketConnector;
