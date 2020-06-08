import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../components/TokensBalance';
import Authentication from '../app/Authentication';
import UI from '../app/UI';
import Config from '../app/Config';

@inject('auth', 'ui', 'config')
@observer
class TokensBalance extends ReactComponent {
	static propTypes = {
		showAdd: PropTypes.bool,
	};
	static defaultProps = {
		showAdd: false,
	};

	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadBalance();
	}

	loadBalance() {
		this.loading = true;

		// We reload the balance each time until we have an async socket
		this.user.fill(this.props.config.get('userAttributes.balance'), true).then(() => {
			this.loading = false;
		});
	}

	getTokenBalance() {
		return this.user.tokenBalance;
	}

	handleAddTokens = () => {
		this.props.ui.showBuyTokensModal();
	};

	render() {
		return (
			<Component
				showAdd={this.props.showAdd}
				loading={this.loading}
				tokenBalance={this.getTokenBalance()}
				onAddTokens={this.handleAddTokens}
			/>
		);
	}
}

// Injected props
TokensBalance.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default TokensBalance;
