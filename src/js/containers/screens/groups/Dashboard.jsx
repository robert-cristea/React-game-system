import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import omit from 'lodash/omit';
import Component from '../../../components/screens/groups/Dashboard';
import UI from '../../../app/UI';
import SendTokensModalHandler from '../../tokens/SendTokensModalHandler';
import BuyTokensModalHandler from '../../tokens/BuyTokensModalHandler';

const MODAL_LOCATION_SEND_BUY_TOKENS = 'sendBuyTokens';

@inject('ui')
@observer
class Dashboard extends ReactComponent {
	static propTypes = {
		children: PropTypes.element.isRequired,
	};
	static defaultProps = {};

	/**
	 * @param {string} location
	 * @param {Element} element
	 */
	handleRegisterModalLocation = (location, element) => {
		this.props.ui.registerModalLocation(location, element);
	};

	render() {
		const props = omit(this.props, ['children']);
		return (
			<Fragment>
				<Component
					{...props}
					registerModalLocation={this.handleRegisterModalLocation}
					sendBuyTokensLocationName={MODAL_LOCATION_SEND_BUY_TOKENS}
				>
					{this.props.children}
				</Component>
				<SendTokensModalHandler location={MODAL_LOCATION_SEND_BUY_TOKENS} />
				<BuyTokensModalHandler location={MODAL_LOCATION_SEND_BUY_TOKENS} />
			</Fragment>
		);
	}
}

// Injected props
Dashboard.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Dashboard;
