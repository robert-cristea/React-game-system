/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';
import moment from 'moment';
import AbstractEvent from './AbstractEvent';

/**
 * @property {string} user.id
 * @property {User} user
 */
class UserEvent extends AbstractEvent {
	static TYPE_ENTERED = 'user:entered';
	static TYPE_LEFT = 'user:left';
	static TYPE_JOINED = 'user:joined';
	static TYPE_EXITED = 'user:exited';
	static TYPING_STARTED = 'user:typingStarted';
	static TYPING_STOPPED = 'user:typingStopped';

	/**
	 * Serializes the current instance
	 * @return {object}
	 */
	serialize() {
		const serialized = AbstractEvent.prototype.serialize.call(this);
		serialized.user = { id: this.user.id };
		return serialized;
	}

	/**
	 * From a serialized object returns an instance
	 * @param {object} eventData
	 * @return {UserEvent}
	 */
	static deserialize(eventData) {
		/** @type {UserRepository} */
		const userRepository = IoC.make('userRepository');
		const user = userRepository.retrieve(eventData.user.id);
		const event = new UserEvent(eventData);
		event.user = user || eventData.user;
		event.date = moment(eventData.date);
		return event;
	}

	/**
	 * Returns true if the data is a serialized UserEvent
	 * @param {object} data
	 * @return {boolean}
	 */
	static is(data) {
		return data.type.indexOf('user:') === 0;
	}

	/**
	 * @param {string} type
	 * @param {User} user
	 * @return {UserEvent}
	 */
	static create(type, user) {
		return new UserEvent({
			ref: this.generateRef(),
			date: moment(),
			user,
			type,
		});
	}
}

export default UserEvent;
