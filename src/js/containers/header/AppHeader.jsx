import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Component from '../../components/header/AppHeader';
import UI from '../../app/UI';
import Authentication from '../../app/Authentication';

@inject('ui', 'auth')
@observer
class AppHeader extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	handleLogin = () => {
		this.props.ui.router.goTo('/welcome/login');
	};

	handleCreateAccount = () => {
		this.props.ui.router.goTo('/welcome/register');
	};

	handleLogoClick = () => {
		if (this.props.ui.loggedIn) {
			this.props.ui.router.goTo('/dashboard/games/index');
		} else {
			this.props.ui.router.goTo('/welcome/login');
		}
	};

	render() {
		return (
			<Fragment>
				<Component
					onLogin={this.handleLogin}
					onCreateAccount={this.handleCreateAccount}
					onLogoClick={this.handleLogoClick}
					loggedIn={this.props.ui.loggedIn}
				/>
			</Fragment>
		);
	}
}

// Injected props
AppHeader.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default AppHeader;
