import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Authentication from '../../app/Authentication';
import Component from '../../components/header/AppHeaderNotifications';
import NotificationRepository from '../../app/Repositories/NotificationsRepository';

@inject('auth', 'notificationRepository')
@observer
class AppHeaderNotifications extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentRef = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
	}

	handleRemove = notification => {
		this.props.notificationRepository.remove(notification);
	};

	handleClick = notification => {
		this.props.notificationRepository.remove(notification);
		this.close();
	};

	close() {
		if (this.componentRef) {
			this.componentRef.close();
		}
	}

	render() {
		return (
			<Component
				ref={ref => {
					this.componentRef = ref;
				}}
				notifications={this.props.notificationRepository.getNotifications()}
				onNotificationRemove={this.handleRemove}
				onNotificationClick={this.handleClick}
			/>
		);
	}
}

// Injected props
AppHeaderNotifications.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	notificationRepository: PropTypes.instanceOf(NotificationRepository).isRequired,
};

export default AppHeaderNotifications;
