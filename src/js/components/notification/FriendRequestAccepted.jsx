import React from 'react';
import PropTypes from 'prop-types';
import FriendRequestAcceptedModel from '../../app/Notification/FriendRequestAccepted';
import Avatar from '../user/Avatar';
import BaseNotification from './Notification';

class FriendRequestAccepted extends BaseNotification {
	static propTypes = {
		notification: PropTypes.instanceOf(FriendRequestAcceptedModel).isRequired,
	};

	static defaultProps = {};

	getMessage() {
		const notification = this.props.notification;
		return `${notification.to.username} accepted your friend request`;
	}

	getIcon() {
		const notification = this.props.notification;

		return <Avatar user={notification.to} />;
	}
}

export default FriendRequestAccepted;
