import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/ForgotPassword';
import Header from '../../../../components/screens/routes/welcome/Header';
import UI from '../../../../app/UI';
import Config from '../../../../app/Config';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';

@inject('ui', 'auth', 'config')
@observer
class ForgotPassword extends Component {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = false;

	@observable
	success = false;

	/**
	 * Last error code when we tried to log in
	 * @type {string|null}
	 */
	@observable
	error = null;

	handleSubmit = email => {
		if (!this.loading) {
			if (this.props.auth.restorePasswordAttempts >= this.props.config.get('auth.maxRestorePasswordAttempts')) {
				this.error = ServerError.RESTORE_LIMIT_REACHED;
				return;
			}

			this.loading = true;
			this.success = false;

			this.props.auth
				.restorePassword(email)
				.then(() => {
					// this.props.ui.router.goTo('/welcome/login');
					this.success = true;
					this.loading = false;
				})
				.catch(e => {
					this.error = e instanceof ServerError ? e.code : ServerError.UNKNOWN_ERROR;
					this.loading = false;
				});
		}
	};

	handleLogin = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/login');
		}
	};

	handleCreateAccount = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/register');
		}
	};

	render() {
		return (
			<div className="screenGroupWelcome__wrap">
				<div className="screenGroupWelcome__content welcome__wrap">
					<Header />
					<Screen
						loading={this.loading}
						success={this.success}
						error={this.error}
						onLogin={this.handleLogin}
						onCreateAccount={this.handleCreateAccount}
						onSubmit={this.handleSubmit}
					/>
				</div>
			</div>
		);
	}
}

// Injected props
ForgotPassword.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default ForgotPassword;
