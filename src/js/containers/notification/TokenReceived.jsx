import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import TokenReceivedModel from '../../app/Notification/TokenReceived';
import Config from '../../app/Config';
import Component from '../../components/notification/TokenReceived';

@inject('config')
@observer
class TokenReceived extends ReactComponent {
	static propTypes = {
		notification: PropTypes.instanceOf(TokenReceivedModel).isRequired,
	};

	static defaultProps = {};

	@observable
	loading = true;

	componentWillMount() {
		this.loading = false;
		this.loadUser();
	}

	loadUser() {
		/** @type {TokenReceivedModel} */
		const notification = this.props.notification;

		if (notification.isReceivedFromUser()) {
			this.loading = true;
			const attributes = this.props.config.get('userAttributes.notification');
			notification.loadSenderUser(attributes).then(() => {
				this.loading = false;
			});
		}
	}

	render() {
		const props = {
			...this.props,
			loading: this.loading,
		};

		return <Component {...props} />;
	}
}

// Injected props
TokenReceived.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default TokenReceived;
