import moment from 'moment';
import { observable } from 'mobx';
import AbstractEvent from './AbstractEvent';
import TextMessage from '../ConversationMessage/TextMessage';
import AttachmentMessage from '../ConversationMessage/AttachmentMessage';

/**
 * @property {TextMessage|AttachmentMessage} message
 */
class MessageEvent extends AbstractEvent {
	static TYPE_SEND = 'message:sent';

	/**
	 * @type {ObservableArray}
	 */
	@observable
	reactions = [];

	/**
	 * @param {string} type
	 * @param {TextMessage|AttachmentMessage} message
	 * @return {MessageEvent}
	 */
	static create(type, message) {
		return new MessageEvent({
			ref: this.generateRef(),
			date: moment(),
			message,
			type,
		});
	}

	/**
	 * Returns true if the data is a serialized MessageEvent
	 * @param {object} data
	 * @return {boolean}
	 */
	static is(data) {
		return data.type.indexOf('message:') === 0;
	}

	/**
	 * Serializes this instance to an object that can be JSON encoded
	 * @return {object}
	 */
	serialize() {
		const serialized = AbstractEvent.prototype.serialize.call(this);
		serialized.message = this.message.serialize();
		return serialized;
	}

	/**
	 * From a serialized object returns an instance
	 * @param {object} eventData
	 * @return {MessageEvent}
	 */
	static deserialize(eventData) {
		const event = new MessageEvent(eventData);
		event.date = moment(eventData.date);
		event.message =
			eventData.message.type === AttachmentMessage.TYPE
				? AttachmentMessage.deserialize(eventData.message)
				: TextMessage.deserialize(eventData.message);
		return event;
	}

	/**
	 * Adds a reaction to this MessageEvent
	 * @param {string} reaction
	 */
	addReaction(reaction) {
		this.reactions.push(reaction);
	}
}

export default MessageEvent;
