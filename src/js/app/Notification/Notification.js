import moment from 'moment';

class Notification {
	message = null;
	routePath = null;
	date = moment();
	id: null;

	setMessage(message) {
		this.message = message;
	}

	getMessage() {
		return this.message;
	}

	setRoutePath(path) {
		this.routePath = path;
	}

	getRoutePath() {
		return this.routePath;
	}
}

export default Notification;
