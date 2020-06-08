import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/Login';
import Header from '../../../../components/screens/routes/welcome/Header';
import UI from '../../../../app/UI';
import Config from '../../../../app/Config';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';

@inject('ui', 'auth', 'config')
@observer
class Login extends Component {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = true;

	/**
	 * Last error code when we tried to log in
	 * @type {string|null}
	 */
	@observable
	error = null;

	componentWillMount() {
		if (this.props.auth.isAuthenticated()) {
			this.props.auth.logout().then(() => {
				this.loading = false;
			});
		} else {
			this.loading = false;
		}
	}

	handleSubmit = (username, password) => {
		if (!this.loading) {
			const userAttributes = this.props.config.get('auth.user.baseAttributes');

			this.loading = true;
			this.props.auth
				// TODO: Temporary convert username to lowercase
				.login(username.toLowerCase(), password, userAttributes)
				.then(() => {
					this.props.ui.router.goTo('/dashboard/games/index');
				})
				.catch(e => {
					this.error = e instanceof ServerError ? e.code : ServerError.UNKNOWN_ERROR;
					this.loading = false;
				});
		}
	};

	handleCreateAccount = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/register');
		}
	};

	handleBrowseAsGuest = () => {
		if (!this.loading) {
			this.loading = true;
			this.props.ui.router.goTo('/dashboard/shop/index');
		}
	};

	handleForgotPassword = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/restore');
		}
	};

	render() {
		return (
			<div className="screenGroupWelcome__wrap">
				<div className="screenGroupWelcome__content welcome__wrap">
					<Header />
					<Screen
						loading={this.loading}
						error={this.error}
						onSubmit={this.handleSubmit}
						onCreateAccount={this.handleCreateAccount}
						onBrowseAsGuest={this.handleBrowseAsGuest}
						onForgotPassword={this.handleForgotPassword}
					/>
				</div>
			</div>
		);
	}
}

// Injected props
Login.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Login;
