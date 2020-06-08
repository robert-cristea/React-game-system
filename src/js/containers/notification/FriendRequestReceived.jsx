import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import FriendRequestReceivedModel from '../../app/Notification/FriendRequestReceived';
import Config from '../../app/Config';
import Component from '../../components/notification/FriendRequestReceived';
import UI from '../../app/UI';

@inject('config', 'ui')
@observer
class FriendRequestReceived extends ReactComponent {
	static propTypes = {
		notification: PropTypes.instanceOf(FriendRequestReceivedModel).isRequired,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		onRemove: null,
	};

	@observable
	loading = true;

	componentWillMount() {
		this.loadUser();
	}

	loadUser() {
		this.loading = true;
		/** @type {FriendRequestReceived} */
		const notification = this.props.notification;
		const attributes = this.props.config.get('userAttributes.notification');
		notification.loadUser(attributes).then(() => {
			this.loading = false;
		});
	}

	handleOnClick = () => {
		this.props.ui.router.goTo('/dashboard/friends?startView=pending');
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	render() {
		const props = {
			...this.props,
			loading: this.loading,
			onClick: this.handleOnClick,
			clickable: true,
		};

		return <Component {...props} />;
	}
}

// Injected props
FriendRequestReceived.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default FriendRequestReceived;
