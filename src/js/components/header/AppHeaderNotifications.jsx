import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import AppHeaderItem from '../../components/header/AppHeaderItem';
import Dropdown from '../../components/Dropdown';
import Notification from '../../app/Notification/Notification';
import NotificationComponent from '../../containers/notification/Notification';

@observer
class AppHeaderNotifications extends Component {
	static propTypes = {
		notifications: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(Notification)),
		onNotificationRemove: PropTypes.func,
		onNotificationClick: PropTypes.func,
	};
	static defaultProps = {
		notifications: [],
		onNotificationRemove: null,
		onNotificationClick: null,
	};

	dropdownRef = null;

	handleRemove = notification => () => {
		if (this.props.onNotificationRemove) {
			this.props.onNotificationRemove(notification);
		}
	};

	handleClick = notification => () => {
		if (this.props.onNotificationClick) {
			this.props.onNotificationClick(notification);
		}
	};

	close() {
		if (this.dropdownRef) {
			this.dropdownRef.wrappedInstance.hide();
		}
	}

	getCount() {
		return this.props.notifications.length;
	}

	renderNotifications() {
		return this.props.notifications.map(notification => (
			<NotificationComponent
				key={notification.id}
				notification={notification}
				onRemove={this.handleRemove(notification)}
				onClick={this.handleClick(notification)}
			/>
		));
	}

	renderEmpty() {
		return <div className="appHeaderNotification__empty">No new notifications</div>;
	}

	render() {
		const content = this.props.notifications.length ? this.renderNotifications() : this.renderEmpty();

		return (
			<div className="appHeader__item">
				<Dropdown
					ref={ref => {
						this.dropdownRef = ref;
					}}
					position="center"
					theme="main"
					button={
						<AppHeaderItem
							onClick={this.handleClick}
							icon="notifications"
							itemsCount={this.getCount()}
							tooltip="Notifications"
						/>
					}
				>
					{content}
				</Dropdown>
			</div>
		);
	}
}

export default AppHeaderNotifications;
