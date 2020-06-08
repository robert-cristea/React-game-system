import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AttachmentMessageModel from '../../app/ConversationMessage/AttachmentMessage';
import Icon from '../icons/Icon';

const propTypes = {
	date: PropTypes.instanceOf(moment).isRequired,
	message: PropTypes.instanceOf(AttachmentMessageModel).isRequired,
};

const defaultProps = {};

function AttachmentMessage(props) {
	return (
		<div className="messageAttachment">
			<div className="messageAttachment__content">
				<a download className="messageAttachment__download" href={props.message.media}>
					<Icon icon="download" />
				</a>
				<div className="messageAttachment__media">
					<img src={props.message.mediaThumb} alt="" className="messageAttachment__image" />
				</div>
				<div className="messageAttachment__datetime">{props.date.format('LL - LT')}</div>
			</div>
		</div>
	);
}

AttachmentMessage.propTypes = propTypes;
AttachmentMessage.defaultProps = defaultProps;

export default AttachmentMessage;
