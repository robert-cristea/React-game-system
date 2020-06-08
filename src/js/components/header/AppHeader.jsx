import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Icon from '../icons/Icon';
import AppHeaderCart from '../../containers/header/AppHeaderCart';
import AppHeaderMessages from '../../containers/header/AppHeaderMessages';
import AppHeaderNotifications from '../../containers/header/AppHeaderNotifications';
import AppHeaderBalance from '../../containers/header/AppHeaderBalance';
import AppHeaderProfile from '../../containers/header/AppHeaderProfile';

class AppHeader extends Component {
	static propTypes = {
		showLogo: PropTypes.bool,
		loggedIn: PropTypes.bool,
		onLogin: PropTypes.func,
		onCreateAccount: PropTypes.func,
		onLogoClick: PropTypes.func,
	};
	static defaultProps = {
		showLogo: true,
		loggedIn: false,
		onLogin: null,
		onCreateAccount: null,
		onLogoClick: null,
	};

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	handleCreateAccount = () => {
		if (this.props.onCreateAccount) {
			this.props.onCreateAccount();
		}
	};

	handleLogoClick = () => {
		if (this.props.onLogoClick) {
			this.props.onLogoClick();
		}
	};

	renderLogo() {
		if (this.props.showLogo) {
			return (
				<button className="appHeader__logo" onClick={this.handleLogoClick}>
					<Icon className="appHeader__logo-icon" icon="logo" />
					<Icon className="appHeader__logo-text" icon="logoText" />
				</button>
			);
		}

		return null;
	}

	renderContent() {
		return this.props.loggedIn ? (
			<Fragment>
				<AppHeaderMessages />
				<AppHeaderNotifications />
				<AppHeaderProfile />
				<AppHeaderBalance />
				<AppHeaderCart />
			</Fragment>
		) : (
			<Fragment>
				<button className="btn btn--main" onClick={this.handleCreateAccount} type="button">
					SIGN UP
				</button>
				<button className="btn btn--border" onClick={this.handleLogin} type="button">
					SIGN IN
				</button>
			</Fragment>
		);
	}

	render() {
		return (
			<div className="appHeader">
				{this.renderLogo()}
				<div className="appHeader__content">
					{this.renderContent()}
					<ReactTooltip id="tooltip-app-header" className="tooltip" place="bottom" effect="solid" />
				</div>
			</div>
		);
	}
}

export default AppHeader;
