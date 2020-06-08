import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../components/header/AppHeaderProfile';
import Authentication from '../../app/Authentication';
import UI from '../../app/UI';

@inject('auth', 'ui')
@observer
class AppHeaderProfile extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = true;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	@observable
	user = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadUser();
	}

	loadUser() {
		this.loading = true;
		this.user.fill(['username', 'email', 'avatar'], true).then(() => {
			this.loading = false;
		});
	}

	handleLogout = () => {
		// Redirection to login page will happen automatically after calling following method
		this.props.auth.logout();
	};

	handleOpenProfile = () => {
		this.props.ui.router.goTo(`/dashboard/friends/${this.user.id}`);
	};

	handleManageTokens = () => {
		this.props.ui.showBuyTokensModal();
	};

	render() {
		return (
			<div className="appHeader__item">
				<Component
					loading={this.loading}
					onLogout={this.handleLogout}
					onOpenProfile={this.handleOpenProfile}
					onManageTokens={this.handleManageTokens}
					user={this.user}
				/>
			</div>
		);
	}
}

// Injected props
AppHeaderProfile.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppHeaderProfile;
