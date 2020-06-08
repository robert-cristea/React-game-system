import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../appBar/Avatar';
import User from '../../app/User';

const propTypes = {
	user: PropTypes.instanceOf(User).isRequired,
	className: PropTypes.string,
	status: PropTypes.node,
	post: PropTypes.node,
	onClick: PropTypes.func,
};

const defaultProps = {
	status: null,
	post: null,
	onClick: null,
	className: null,
};

function UserListItem(props) {
	return (
		<div className={`${props.className} conversationPreview__front conversationList__item`}>
			<div className="friendsList__main" onClick={props.onClick}>
				<div className="friendsList__avatar">
					<Avatar user={props.user} />
				</div>
				<div>
					<div>{props.user.displayName}</div>
					<div className="stream__gameTag-publisher">{props.status}</div>
				</div>
			</div>
			<div className="friendsList__post">{props.post}</div>
		</div>
	);
}

UserListItem.propTypes = propTypes;
UserListItem.defaultProps = defaultProps;

export default UserListItem;
