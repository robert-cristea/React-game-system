import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import Icon from '../icons/Icon';
import NotificationModel from '../../app/Notification/Notification';

class Notification extends Component {
	static propTypes = {
		notification: PropTypes.instanceOf(NotificationModel).isRequired,
		loading: PropTypes.bool,
		clickable: PropTypes.bool,
		onRemove: PropTypes.func,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		clickable: false,
		onRemove: null,
		onClick: null,
	};

	renderLoading() {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	getIcon() {
		return null;
	}

	getMessage() {
		return '';
	}

	renderNotification() {
		const classNames = ['appHeaderNotification'];

		if (this.props.clickable) {
			classNames.push('appHeaderNotification--clickable');
		}

		return (
			<div className={classNames.join(' ')}>
				<div className="appHeaderNotification__main" onClick={this.props.clickable ? this.props.onClick : null}>
					<div className="appHeaderNotification__icon">{this.getIcon()}</div>
					<div className="appHeaderNotification__info">
						<p className="appHeaderNotification__text">{this.getMessage()}</p>
						<div className="appHeaderNotification__wrap">
							<Icon icon="friends" />
							<p className="appHeaderNotification__meta">{this.props.notification.date.fromNow()}</p>
						</div>
					</div>
				</div>
				<div className="appHeaderNotification__close" onClick={this.props.onRemove}>
					<Icon icon="times" />
				</div>
			</div>
		);
	}

	render() {
		if (this.props.loading) {
			return this.renderLoading();
		}

		return this.renderNotification();
	}
}

export default Notification;
