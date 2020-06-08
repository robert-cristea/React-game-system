import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../../mock/MockObject';
import AppBar from '../../AppBar';
import StreamMeta from '../StreamMeta';
import Back from '../../appBar/Back';
import ScrollableView from '../../ScrollableView';
import ConversationHistory from '../../conversations/ConversationHistory';
import MessageInput from '../../conversations/MessageInput';
import Icon from '../../icons/Icon';

const propTypes = {
	stream: PropTypes.instanceOf(MockObject).isRequired,
	currentUser: PropTypes.instanceOf(MockObject).isRequired,
	onClose: PropTypes.func,
	onMessage: PropTypes.func,
};

const defaultProps = {
	onClose: null,
	onMessage: null,
};

function Comments(props) {
	return (
		<div className="streamModal">
			<div className="streamModal__header">
				<AppBar pre={<Back onClick={props.onClose} />} title="Comments" />
			</div>
			<div className="streamModal__body">
				<div className="streamModal__streamInfo">
					<StreamMeta stream={props.stream} />
				</div>
				<div className="streamModal__data">
					<Icon icon="comments" />
					{props.stream.commentsTotal} Comments
				</div>
				<div className="streamModal__content">
					<ScrollableView>
						<ConversationHistory events={[]} currentUser={props.currentUser} />
					</ScrollableView>
					<MessageInput onMessage={props.onMessage} />
				</div>
			</div>
		</div>
	);
}

Comments.propTypes = propTypes;
Comments.defaultProps = defaultProps;

export default Comments;
