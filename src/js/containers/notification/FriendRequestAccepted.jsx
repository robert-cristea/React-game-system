import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import FriendRequestAcceptedModel from '../../app/Notification/FriendRequestAccepted';
import Config from '../../app/Config';
import Component from '../../components/notification/FriendRequestAccepted';
import UI from '../../app/UI';

@inject('config', 'ui')
@observer
class FriendRequestAccepted extends ReactComponent {
	static propTypes = {
		notification: PropTypes.instanceOf(FriendRequestAcceptedModel).isRequired,
	};

	static defaultProps = {};

	@observable
	loading = true;

	componentWillMount() {
		this.loadUser();
	}

	handleOnClick = () => {
		this.props.ui.router.goTo('/dashboard/friends?startView=all');
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	loadUser() {
		this.loading = true;
		/** @type {FriendRequestAccepted} */
		const notification = this.props.notification;
		const attributes = this.props.config.get('userAttributes.notification');
		notification.loadUser(attributes).then(() => {
			this.loading = false;
		});
	}

	render() {
		const props = {
			...this.props,
			loading: this.loading,
			clickable: true,
			onClick: this.handleOnClick,
		};

		return <Component {...props} />;
	}
}

// Injected props
FriendRequestAccepted.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default FriendRequestAccepted;
