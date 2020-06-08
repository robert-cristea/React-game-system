import merge from 'lodash/merge';
import moment from 'moment';
import IoC from '@aedart/js-ioc';
import { generateRef } from '../utils';

/**
 * @property {string} id
 * @property {string} ref
 * @property {User} user Author of the message
 * @property {'text'} type
 * @property {string} content
 */
class TextMessage {
	static TYPE = 'text';

	/**
	 * @param {object} data Initial data
	 */
	constructor(data = {}) {
		merge(this, data);
	}

	/**
	 * @param {string} type
	 * @param {string} content
	 * @param {User} author
	 * @return {TextMessage}
	 */
	static create(type, content, author) {
		return new TextMessage({
			ref: generateRef(),
			creationDate: moment(),
			user: author,
			type,
			content,
		});
	}

	/**
	 * Returns a serialized object of this instance that can be JSON encoded
	 */
	serialize() {
		return {
			id: this.id,
			ref: this.ref,
			user: { id: this.user.id },
			type: this.type,
			content: this.content,
		};
	}

	/**
	 * From a serialized object creates an instance
	 * @param {object} data
	 * @return {TextMessage}
	 */
	static deserialize(data) {
		/** @type {UserRepository} */
		const userRepository = IoC.make('userRepository');
		const author = userRepository.retrieve(data.user.id);
		return new TextMessage({
			...data,
			user: author,
		});
	}
}

export default TextMessage;
