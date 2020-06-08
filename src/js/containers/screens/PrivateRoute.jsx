import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Screen from '../../components/screens/PrivateRoute';
import UI from '../../app/UI';

@inject('ui')
@observer
class PrivateRoute extends Component {
	static propTypes = {
		component: PropTypes.func.isRequired,
	};
	static defaultProps = {};

	handleLogin = () => {
		this.props.ui.router.goTo('/welcome/login');
	};

	render() {
		const RouteComponent = this.props.component;

		return this.props.ui.loggedIn ? <RouteComponent {...this.props} /> : <Screen onLogin={this.handleLogin} />;
	}
}

// Injected props
PrivateRoute.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default PrivateRoute;
