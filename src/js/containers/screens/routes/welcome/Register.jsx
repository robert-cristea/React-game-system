import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/Register';
import Header from '../../../../components/screens/routes/welcome/Header';
import UI from '../../../../app/UI';
import UserRepository from '../../../../app/Repositories/UserRepository';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';

const emptyUser = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
	firstname: '',
	lastname: '',
	country: '',
	/** @type {Moment} */
	dateOfBirth: null,
	eulaAccepted: false,
};

@inject('ui', 'userRepository', 'auth')
@observer
class Register extends Component {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = false;

	/**
	 * Las error received when trying to create the account
	 * @type {ServerError|null}
	 */
	@observable
	error = null;

	@observable
	complete = false;

	@observable
	newUser = {};

	componentWillMount() {
		this.loading = false;
		this.newUser = this.props.auth.getNewUser();
	}

	handleSubmit = user => {
		// TODO: Temporary convert username and email to lowercase
		user.username = user.username.toLowerCase();
		user.email = user.email.toLowerCase();

		if (!this.loading) {
			this.error = null;
			this.loading = true;
			this.createAccount(user)
				.then(() => {
					this.complete = true;
					this.loginUser(user.email, user.password);
				})
				.catch(e => {
					this.error = e instanceof ServerError ? e : new ServerError(ServerError.UNKNOWN_ERROR);
					this.loading = false;
				});
		}
	};

	handleLogin = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/login');
		}
	};

	handleBrowseAsGuest = () => {
		if (!this.loading) {
			this.loading = true;
			this.props.ui.router.goTo('/dashboard/shop/index');
		}
	};

	handleReadTerms = () => {
		if (!this.loading) {
			this.props.ui.router.goTo('/welcome/terms');
		}
	};

	handleUpdateUser = user => {
		this.props.auth.setNewUser(this.complete ? emptyUser : user);
	};

	/**
	 * @param {Object} user
	 * @return {Promise<User>}
	 */
	createAccount(user) {
		/** @type {UserRepository} */
		const repo = this.props.userRepository;
		const dateOfBirthStr = user.dateOfBirth.format('YYYY-MM-DD');
		return repo.signup({
			email: user.email,
			password: user.password,
			username: user.username,
			firstName: user.firstname,
			lastName: user.lastname,
			country: user.country,
			dob: dateOfBirthStr,
		});
	}

	loginUser(email, password) {
		/** @type {Authentication} */
		const auth = this.props.auth;
		const userAttributes = ['username', 'email', 'avatar', 'tokenBalance'];

		this.props.auth.invalidate();
		return auth.login(email, password, userAttributes).then(() => {
			this.props.ui.router.goTo('/dashboard/games/index');
		});
	}

	render() {
		return (
			<div className="screenGroupWelcome__wrap">
				<div className="screenGroupWelcome__content welcome__wrap--wide">
					<Header />
					<Screen
						error={this.error}
						loading={this.loading}
						newUser={this.newUser}
						emptyUser={emptyUser}
						onSubmit={this.handleSubmit}
						onLogin={this.handleLogin}
						onBrowseAsGuest={this.handleBrowseAsGuest}
						onReadTerms={this.handleReadTerms}
						onUpdateUser={this.handleUpdateUser}
					/>
				</div>
			</div>
		);
	}
}

// Injected props
Register.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default Register;
