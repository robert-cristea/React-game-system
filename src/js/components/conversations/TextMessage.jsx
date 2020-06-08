import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TextMessageModel from '../../app/ConversationMessage/TextMessage';

const propTypes = {
	date: PropTypes.instanceOf(moment).isRequired,
	message: PropTypes.instanceOf(TextMessageModel).isRequired,
	isCurrentUser: PropTypes.bool,
};

const defaultProps = {
	isCurrentUser: false,
};

function TextMessage(props) {
	const whosClassSuffix = props.isCurrentUser ? 'mine' : 'their';

	return (
		<div className={`messageText messageText--${whosClassSuffix}`}>
			<div className="messageText__content">
				<pre className="messageText__text">{props.message.content}</pre>
				<div className="messageText__datetime">{props.date.format('LL - LT')}</div>
			</div>
		</div>
	);
}

TextMessage.propTypes = propTypes;
TextMessage.defaultProps = defaultProps;

export default TextMessage;
