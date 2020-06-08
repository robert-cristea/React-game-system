import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Input from '../../../Input';
import Icon from '../../../icons/Icon';
import ServerError from '../../../../app/Server/ServerError';

@observer
class Login extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		error: PropTypes.string,
		onSubmit: PropTypes.func,
		onCreateAccount: PropTypes.func,
		onBrowseAsGuest: PropTypes.func,
		onForgotPassword: PropTypes.func,
	};
	static defaultProps = {
		loading: false,
		error: null,
		onSubmit: null,
		onCreateAccount: null,
		onBrowseAsGuest: null,
		onForgotPassword: null,
	};

	@observable
	loginUsername = '';

	@observable
	loginPassword = '';

	@observable
	formErrors = new Map();
	formRefs = new Map();

	// Navigation Methods
	handleCreateAccount = () => {
		if (this.props.onCreateAccount) {
			this.props.onCreateAccount();
		}
	};

	handleBrowseAsGuest = () => {
		if (this.props.onBrowseAsGuest) {
			this.props.onBrowseAsGuest();
		}
	};

	handleForgotPassword = () => {
		if (this.props.onForgotPassword) {
			this.props.onForgotPassword();
		}
	};

	// Form Methods
	handleInputChange = event => {
		const { name, value } = event.target;

		this[name] = value;
	};

	handleInputBlur = event => {
		const { name } = event.target;
		const ref = this.formRefs.get(name);

		if (ref) ref.isValid();
	};

	validateForm() {
		this.formRefs.forEach(ref => ref.isValid());
	}

	handleSubmit = event => {
		event.preventDefault();

		this.validateForm();

		if (this.formErrors.size) {
			return;
		}

		if (this.props.onSubmit) {
			this.props.onSubmit(this.loginUsername, this.loginPassword);
		}
	};

	// Server Errors
	renderErrors() {
		let message = '';

		if (this.props.error) {
			switch (this.props.error) {
				case ServerError.AUTH_FAILED:
					message = 'Login failed. Check your email and password.';
					break;
				default:
					message = 'We cannot log you in at the moment. Please try again later.';
			}
		}

		return message ? <div className="form__message form__message--error">{message}</div> : null;
	}

	render() {
		return (
			<div className="welcome--login">
				<form className="welcome__form" onSubmit={this.handleSubmit}>
					<Input
						name="loginUsername"
						value={this.loginUsername}
						required
						formErrors={this.formErrors}
						ref={r => this.formRefs.set('loginUsername', r)}
						emptyError="Type your email or username"
					>
						<input
							placeholder="Username / Email"
							name="loginUsername"
							value={this.loginUsername}
							onChange={this.handleInputChange}
							onBlur={this.handleInputBlur}
						/>
					</Input>

					<Input
						name="loginPassword"
						value={this.loginPassword}
						required
						formErrors={this.formErrors}
						ref={r => this.formRefs.set('loginPassword', r)}
						emptyError="Type your password"
					>
						<input
							placeholder="Password"
							type="password"
							name="loginPassword"
							value={this.loginPassword}
							onChange={this.handleInputChange}
							onBlur={this.handleInputBlur}
						/>
					</Input>

					{this.renderErrors()}

					<button className="btn btn--main btn--wide" onClick={this.handleSubmit} type="button">
						{this.props.loading && <Icon icon="loading" />}
						<span className="btn__label">{this.props.loading ? 'LOADING...' : 'SIGN IN'}</span>
					</button>
				</form>

				<div className="welcome__footer">
					<p className="welcome__footer-title">New to TurboPlay?</p>
					<div className="welcome__footer-actions">
						<button className="welcome__link btn btn--link" onClick={this.handleCreateAccount}>
							Create an account
						</button>

						<span className="welcome__footer-separator" />

						<button className="welcome__link btn btn--link" onClick={this.handleBrowseAsGuest}>
							Browse as a guest user
						</button>
					</div>

					<div className="welcome__footer-actions">
						<button className="welcome__link btn btn--link" onClick={this.handleForgotPassword}>
							Forgot your password?
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
