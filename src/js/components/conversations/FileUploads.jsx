import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import filesize from 'filesize';
import FileUpload from '../../app/FileUpload';
import Loading from '../Loading';
import Icon from '../icons/Icon';

@observer
class FileUploads extends ReactComponent {
	static propTypes = {
		fileUploads: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(FileUpload)),
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		fileUploads: [],
		onRemove: null,
	};

	handleRemove = fileUpload => () => {
		if (this.props.onRemove) {
			this.props.onRemove(fileUpload);
		}
	};

	renderFileUploads() {
		/** @type {FileUpload} fileUpload */
		return this.props.fileUploads.map(fileUpload => {
			const classes = ['conversationFileUpload'];

			switch (fileUpload.state) {
				case FileUpload.STATE_WAITING:
					classes.push('conversationFileUpload--waiting');
					break;
				case FileUpload.STATE_UPLOADING:
					classes.push('conversationFileUpload--uploading');
					break;
				case FileUpload.STATE_ERROR:
					classes.push('conversationFileUpload--error');
					break;
				default: // nothing
			}

			let loading = null;
			let progress = null;
			let remove = null;
			let error = null;

			if (fileUpload.state === FileUpload.STATE_UPLOADING) {
				loading = (
					<div className="conversationFileUpload__loading">
						<Loading size="small" />
					</div>
				);

				progress = <div className="conversationFileUpload__progress" />;
			}

			if (fileUpload.state !== FileUpload.STATE_UPLOADING) {
				remove = (
					<div className="conversationFileUpload__remove" onClick={this.handleRemove(fileUpload)}>
						<Icon icon="remove" />
					</div>
				);
			}

			if (fileUpload.state === FileUpload.STATE_ERROR) {
				error = <div className="conversationFileUpload__error">File upload failed</div>;
			}

			return (
				<div key={fileUpload.ref} className="conversationFileUploads__item">
					<div className={classes.join(' ')}>
						{remove}
						{loading}
						<div className="conversationFileUpload__meta">
							<div className="conversationFileUpload__name">{fileUpload.file.name}</div>
							<div className="conversationFileUpload__size">{filesize(fileUpload.file.size)}</div>
							{progress}
							{error}
						</div>
					</div>
				</div>
			);
		});
	}

	render() {
		if (!this.props.fileUploads.length) {
			return <div />;
		}

		return <div className="conversationFileUploads">{this.renderFileUploads()}</div>;
	}
}

export default FileUploads;
