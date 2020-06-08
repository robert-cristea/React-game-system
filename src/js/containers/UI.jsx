import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withToastManager } from 'react-toast-notifications';
import { Route as ReactRouterRoute, Switch } from 'react-router-dom';
import animatedRouteGroup from '../app/RoutingAnimation/animatedRouteGroup';
import baseGroup from '../routes';
import ToastManager from '../app/ToastManager';

const RootRoute = animatedRouteGroup(baseGroup);

@inject('toast')
class UI extends ReactComponent {
	static propTypes = {
		// Set by react-toast-notifications
		toastManager: PropTypes.object,
	};

	static defaultProps = {
		toastManager: null,
	};

	componentWillMount() {
		this.updateToastManager();
	}

	componentWillReceiveProps(nextProps) {
		this.updateToastManager(nextProps);
	}

	updateToastManager(props = this.props) {
		props.toast.setExternalManager(props.toastManager);
	}

	render() {
		return (
			<div className="screens">
				<Switch>
					<ReactRouterRoute component={RootRoute} />
				</Switch>
			</div>
		);
	}
}

// Injected props
UI.wrappedComponent.propTypes = {
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default withToastManager(UI);
