import React from 'react';
import PropTypes from 'prop-types';
import FriendRequestReceivedModel from '../../app/Notification/FriendRequestReceived';
import Avatar from '../user/Avatar';
import BaseNotification from './Notification';

class FriendRequestReceived extends BaseNotification {
	static propTypes = {
		notification: PropTypes.instanceOf(FriendRequestReceivedModel).isRequired,
	};

	static defaultProps = {};

	getMessage() {
		const notification = this.props.notification;
		return `You have a new friend request from ${notification.from.username}`;
	}

	getIcon() {
		const notification = this.props.notification;

		return <Avatar user={notification.from} />;
	}
}

export default FriendRequestReceived;
