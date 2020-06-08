import React from 'react';
import PropTypes from 'prop-types';
import TokenReceivedModel from '../../app/Notification/TokenReceived';
import Avatar from '../user/Avatar';
import Icon from '../icons/Icon';
import { formatToken } from '../../app/utils';
import BaseNotification from './Notification';

class TokenReceived extends BaseNotification {
	static propTypes = {
		notification: PropTypes.instanceOf(TokenReceivedModel).isRequired,
	};

	static defaultProps = {};

	getMessage() {
		const notification = this.props.notification;
		const user = notification.isReceivedFromUser() ? notification.from : null;

		let message = notification.getMessage();

		if (!message && notification.isReceivedFromUser()) {
			let amount = formatToken(notification.amount);
			amount += notification.amount > 1 ? ' tokens' : ' token';
			message = `You received ${amount} from ${user.username}`;
		}

		return message;
	}

	getIcon() {
		/** @type {TokenReceivedModel} */
		const notification = this.props.notification;
		const user = notification.isReceivedFromUser() ? notification.from : null;

		let icon = (
			<div className="appHeaderNotification__icon">
				<Icon icon="logo" />
			</div>
		);

		if (user) {
			icon = (
				<div className="appHeaderNotification__avatar">
					<Avatar user={user} />
				</div>
			);
		}

		return icon;
	}
}

export default TokenReceived;
