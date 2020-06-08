import merge from 'lodash/merge';

let counter = 0;

/**
 * @property {string} id
 * @property {string} ref Internal reference number when we create events
 * @property {string} type
 * @property {Moment} date
 */
class AbstractEvent {
	/**
	 * @param {object} data Initial data
	 */
	constructor(data = {}) {
		merge(this, data);
	}

	static generateRef() {
		counter += 1;
		return `${new Date().getTime()}_${counter}`;
	}

	/**
	 * Serializes the current event to an object that can be JSON encoded.
	 * @return {object}
	 */
	serialize() {
		return {
			id: this.id,
			type: this.type,
			date: this.date.unix(),
		};
	}
}

export default AbstractEvent;
