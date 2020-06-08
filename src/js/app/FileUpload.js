import moment from 'moment';
import { observable } from 'mobx';

class FileUpload {
	static STATE_WAITING = 'waiting';
	static STATE_UPLOADING = 'uploading';
	static STATE_UPLOADED = 'uploaded';
	static STATE_ERROR = 'error';

	static refCounter = 0;

	/**
	 * @type {string}
	 */
	@observable
	state = null;
	/**
	 * @type {File}
	 */
	file = null;
	/**
	 * @type {string}
	 */
	ref = null;
	/**
	 * @type {moment}
	 */
	startTime = null;

	constructor(file = null) {
		this.file = file;
		this.startTime = moment();
		this.ref = FileUpload.generateRef();
		this.state = FileUpload.STATE_WAITING;
	}

	inError() {
		return this.state === FileUpload.STATE_ERROR;
	}

	static generateRef() {
		this.refCounter += 1;
		return `__fileUpload__${this.refCounter}`;
	}
}

export default FileUpload;
