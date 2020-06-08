import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import countries from 'country-region-data';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import Config from '../../../../app/Config';
import Input from '../../../Input';
import Icon from '../../../icons/Icon';
import ServerError from '../../../../app/Server/ServerError';

const datePickerConfig = {
	maxDate: moment(),
	minDate: moment().subtract(100, 'years'),
	showYearDropdown: true,
	showMonthDropdown: true,
	showDisabledMonthNavigation: true,
	scrollableYearDropdown: true,
	yearDropdownItemNumber: 50,
};

const countryList = countries.map(country => ({
	value: country.countryShortCode,
	label: country.countryName,
}));

@inject('config')
@observer
class Register extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		error: PropTypes.instanceOf(ServerError),
		newUser: PropTypes.object,
		emptyUser: PropTypes.object.isRequired,
		onSubmit: PropTypes.func,
		onLogin: PropTypes.func,
		onBrowseAsGuest: PropTypes.func,
		onReadTerms: PropTypes.func,
		onUpdateUser: PropTypes.func,
	};
	static defaultProps = {
		loading: false,
		error: null,
		newUser: {},
		onSubmit: null,
		onLogin: null,
		onBrowseAsGuest: null,
		onReadTerms: null,
		onUpdateUser: null,
	};

	@observable
	user = null;

	@observable
	selected = {
		country: null,
	};

	@observable
	formErrors = new Map();
	formRefs = new Map();

	componentWillMount() {
		this.user = {
			...this.props.emptyUser,
			...this.props.newUser,
		};

		if (this.props.newUser.country) {
			this.selected.country = countryList.find(country => country.value === this.props.newUser.country);
		}
	}

	componentWillUnmount() {
		// TODO: Increase password security
		// this.user.password = '';
		// this.user.confirmPassword = '';

		if (this.props.onUpdateUser) {
			this.props.onUpdateUser(this.user);
		}
	}

	// Navigation Methods
	handleReadTerms = () => {
		if (this.props.onReadTerms) {
			this.props.onReadTerms();
		}
	};

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	handleBrowseAsGuest = () => {
		if (this.props.onBrowseAsGuest) {
			this.props.onBrowseAsGuest();
		}
	};

	// Form Methods
	handleInputChange = event => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.user[name] = value;
	};

	handleInputBlur = event => {
		const name = event.target ? event.target.name : event;
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
			this.props.onSubmit(this.user);
		}
	};

	// Server Errors
	renderErrors() {
		let message = '';

		if (this.props.error) {
			switch (this.props.error) {
				default:
					message = 'We cannot create your account at the moment. Please try again later.';
			}
		}

		return message ? <div className="form__message form__message--error">{message}</div> : null;
	}

	render() {
		return (
			<div className="welcome---register">
				<form className="welcome__form grid" onSubmit={this.handleSubmit}>
					<div className="row center-xs">
						<div className="col-xs-12 col-sm-6">
							<Input
								name="username"
								value={this.user.username}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('username', r)}
								emptyError="Type your username"
							>
								<input
									placeholder="Username"
									name="username"
									value={this.user.username}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="email"
								value={this.user.email}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('email', r)}
								validCondition={() => Boolean(this.props.config.get('auth.emailRegex').test(this.user.email))}
								error="Wrong email format"
								emptyError="Type your email"
							>
								<input
									placeholder="Email"
									name="email"
									value={this.user.email}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="firstname"
								value={this.user.firstname}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('firstname', r)}
								emptyError="Type your first name"
							>
								<input
									placeholder="First Name"
									name="firstname"
									value={this.user.firstname}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="lastname"
								value={this.user.lastname}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('lastname', r)}
								emptyError="Type your last name"
							>
								<input
									placeholder="Last Name"
									name="lastname"
									value={this.user.lastname}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="dateOfBirth"
								value={this.user.dateOfBirth}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('dateOfBirth', r)}
								emptyError="Choose your date of birth"
							>
								<div className="datepicker">
									<DatePicker
										{...datePickerConfig}
										selected={this.user.dateOfBirth}
										onChange={date => {
											this.user.dateOfBirth = date;
										}}
										onBlur={() => this.handleInputBlur('dateOfBirth')}
										placeholderText="Date of Birth"
									/>
								</div>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="country"
								value={this.selected.country}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('country', r)}
								emptyError="Choose your country"
							>
								<Select
									value={this.selected.country}
									options={countryList}
									name="country"
									isSearchable
									placeholder="Country"
									onChange={option => {
										this.selected.country = option;
										this.user.country = option.value;
									}}
									onBlur={() => this.handleInputBlur('country')}
									className="select-react__container"
									classNamePrefix="select-react"
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="password"
								value={this.user.password}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('password', r)}
								emptyError="Type your password"
							>
								<input
									placeholder="Password"
									type="password"
									name="password"
									value={this.user.password}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="col-xs-12 col-sm-6">
							<Input
								name="confirmPassword"
								value={this.user.confirmPassword}
								required
								formErrors={this.formErrors}
								ref={r => this.formRefs.set('confirmPassword', r)}
								validCondition={() => Boolean(this.user.password === this.user.confirmPassword)}
								error="Passwords do not match"
								emptyError="Type your password"
							>
								<input
									placeholder="Re-Type Password"
									type="password"
									name="confirmPassword"
									value={this.user.confirmPassword}
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>

						<div className="register__footer col-xs-12">
							<div className="register__eula">
								<label className="checkbox" htmlFor="eula">
									<input
										type="checkbox"
										id="eula"
										name="eulaAccepted"
										onChange={this.handleReadTerms}
										checked={this.user.eulaAccepted}
									/>
									<div className="checkbox__icon">
										<Icon icon="check" />
									</div>
									<div className="checkbox__label">Accept terms &amp; conditions</div>
								</label>
							</div>

							{this.renderErrors()}

							<button
								className="register__submit btn btn--main btn--wide"
								onClick={this.handleSubmit}
								disabled={!this.user.eulaAccepted}
								type="button"
							>
								{this.props.loading && <Icon icon="loading" />}
								<span className="btn__label">{this.props.loading ? 'LOADING...' : 'SIGN UP'}</span>
							</button>

							<button className="welcome__link btn btn--link" onClick={this.handleBrowseAsGuest} type="button">
								Register Later
							</button>
						</div>
					</div>
				</form>

				<div className="welcome__footer">
					<p className="welcome__footer-title">Already have an account?</p>
					<div className="welcome__footer-actions">
						<button className="welcome__link btn btn--link" onClick={this.handleLogin}>
							Login
						</button>
					</div>
				</div>
			</div>
		);
	}
}

// Injected props
Register.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Register;
