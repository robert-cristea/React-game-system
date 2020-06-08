import React from 'react';
import PropTypes from 'prop-types';
import NotificationModel from '../../app/Notification/Notification';
import FriendRequestReceivedModel from '../../app/Notification/FriendRequestReceived';
import FriendRequestAcceptedModel from '../../app/Notification/FriendRequestAccepted';
import TokenReceivedModel from '../../app/Notification/TokenReceived';
import FriendRequestReceived from './FriendRequestReceived';
import TokenReceived from './TokenReceived';
import FriendRequestAccepted from './FriendRequestAccepted';

const propTypes = {
	notification: PropTypes.instanceOf(NotificationModel).isRequired,
};

const defaultProps = {};

/**
 * Just a simple component that includes the correct notification component based on its type.
 */
function Notification(props) {
	if (props.notification instanceof FriendRequestReceivedModel) {
		return <FriendRequestReceived {...props} />;
	}

	if (props.notification instanceof FriendRequestAcceptedModel) {
		return <FriendRequestAccepted {...props} />;
	}

	if (props.notification instanceof TokenReceivedModel) {
		return <TokenReceived {...props} />;
	}

	return null;
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

export default Notification;
