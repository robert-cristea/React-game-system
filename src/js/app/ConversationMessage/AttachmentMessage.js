import merge from 'lodash/merge';
import omit from 'lodash/omit';
import IoC from '@aedart/js-ioc';

/**
 * @property {string} id
 * @property {string} ref
 * @property {User} user Author of the message
 * @property {'attachment'} type
 * @property {string} media
 * @property {string} mediaThumb
 */
class AttachmentMessage {
	static TYPE = 'attachment';

	/**
	 * @param {object} data Initial data
	 */
	constructor(data = {}) {
		merge(this, data);
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
		return new AttachmentMessage({
			...omit(data, ['media_thumb']),
			user: author,
			mediaThumb: data.media_thumb,
		});
	}
}

export default AttachmentMessage;
