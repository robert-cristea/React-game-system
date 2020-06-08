import moment from 'moment/moment';
import AbstractEvent from './AbstractEvent';

class UpdateEvent extends AbstractEvent {
	/**
	 * From a serialized object returns an instance
	 * @param {object} eventData
	 * @return {UpdateEvent}
	 */
	static deserialize(eventData) {
		const event = new UpdateEvent(eventData);
		event.date = moment(eventData.date);
		return event;
	}
}

export default UpdateEvent;
