import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Config from '../../../../app/Config';
import Input from '../../../Input';
import Icon from '../../../icons/Icon';
import ServerError from '../../../../app/Server/ServerError';

@inject('config')
@observer
class ForgotPassword extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		success: PropTypes.bool,
		error: PropTypes.string,
		onLogin: PropTypes.func,
		onCreateAccount: PropTypes.func,
		onSubmit: PropTypes.func,
	};
	static defaultProps = {
		loading: false,
		success: false,
		error: null,
		onLogin: null,
		onCreateAccount: null,
		onSubmit: null,
	};

	@observable
	email = '';

	@observable
	formErrors = new Map();
	formRefs = new Map();

	// Navigation Methods
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
			this.props.onSubmit(this.email);
		}
	};

	// Server Errors
	renderErrors() {
		let message = '';

		if (this.props.error) {
			switch (this.props.error) {
				case ServerError.RESTORE_FAILED:
					message = 'Restore password failed.';
					break;
				case ServerError.RESTORE_LIMIT_REACHED:
					message = 'You have reached the limit of restore password attempts. Please try again later.';
					break;
				default:
					message = 'We cannot restore your password at the moment. Please try again later.';
			}
		}

		return message ? <div className="form__message form__message--error">{message}</div> : null;
	}

	render() {
		return (
			<div className="welcome--restore">
				<form className="welcome__form" onSubmit={this.handleSubmit}>
					<Input
						name="email"
						value={this.email}
						required
						formErrors={this.formErrors}
						ref={r => this.formRefs.set('email', r)}
						validCondition={() => Boolean(this.props.config.get('auth.emailRegex').test(this.email))}
						error="Wrong email format"
						emptyError="Type your email"
					>
						<input
							placeholder="Your Email"
							name="email"
							value={this.email}
							onChange={this.handleInputChange}
							onBlur={this.handleInputBlur}
						/>
					</Input>

					{this.renderErrors()}

					{this.props.success && (
						<div className="form__message">
							If <b>{this.email}</b> is associated with a TurboPlay account, you should receive an email containing
							instructions on how to create a new password.
						</div>
					)}

					<button className="btn btn--main btn--wide" onClick={this.handleSubmit} type="button">
						{this.props.loading && <Icon icon="loading" />}
						<span className="btn__label">{this.props.loading ? 'LOADING...' : 'RESTORE PASSWORD'}</span>
					</button>
				</form>

				<div className="welcome__footer">
					<p className="welcome__footer-title">Back to TurboPlay</p>
					<div className="welcome__footer-actions">
						<button className="welcome__link btn btn--link" onClick={this.handleLogin}>
							Login
						</button>

						<span className="welcome__footer-separator" />

						<button className="welcome__link btn btn--link" onClick={this.handleCreateAccount}>
							Create an account
						</button>
					</div>
				</div>
			</div>
		);
	}
}

// Injected props
ForgotPassword.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default ForgotPassword;
