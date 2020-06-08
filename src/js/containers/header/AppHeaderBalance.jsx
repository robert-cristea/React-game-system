import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import TokensBalance from '../../containers/TokensBalance';
import UI from '../../app/UI';

@inject('ui')
class AppHeaderBalance extends Component {
	handleManageTokens = () => {
		this.props.ui.showBuyTokensModal();
	};

	render() {
		return (
			<div className="appHeader__item">
				<button className="appHeaderBalance" onClick={this.handleManageTokens}>
					<TokensBalance />
				</button>
			</div>
		);
	}
}

// Injected props
AppHeaderBalance.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppHeaderBalance;
