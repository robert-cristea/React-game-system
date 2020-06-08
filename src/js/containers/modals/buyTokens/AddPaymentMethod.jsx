import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import BigNumber from 'bignumber.js';
import Component from '../../../components/modals/buyTokens/AddPaymentMethod';
import ToastManager from '../../../app/ToastManager';
import ConfirmDialog from '../../../app/ConfirmDialog';

@inject('toast', 'confirm')
class AddPaymentMethod extends ReactComponent {
	static propTypes = {
		tokenAmount: PropTypes.instanceOf(BigNumber),
		onBuyWithNewCard: PropTypes.func,
		onGoBack: PropTypes.func,
	};

	static defaultProps = {
		tokenAmount: new BigNumber(0),
		onBuyWithNewCard: null,
		onGoBack: null,
	};

	/**
	 * @param {{
	 *     number: string,
	 *     expirationMonth: string,
	 *     expirationYear: string,
	 *     cvv: string,
	 * }} cardData
	 * @param {StreetAddress} addressData
	 */
	handleSubmit = (cardData, addressData) => {
		const last4numbers = cardData.number.slice(-4);
		const message = `You are about to buy ${this.props.tokenAmount.toNumber()} TurboTokens with your \
			credit card ending in **** ${last4numbers}. Do you want to continue?`;

		const buttons = [
			{ label: 'Continue', isMain: true, onClick: this.onBuyWithNewCard(cardData, addressData) },
			{ label: 'Cancel', isCancel: true },
		];

		const options = {
			closeOnEsc: true,
		};

		this.props.confirm.show('Buy TurboTokens?', message, buttons, options);
	};

	onBuyWithNewCard = (cardData, addressData) => () => {
		if (this.props.onBuyWithNewCard) {
			this.props.onBuyWithNewCard(cardData, addressData);
		}
	};

	render() {
		return <Component onSubmit={this.handleSubmit} onGoBack={this.props.onGoBack} />;
	}
}

// Injected props
AddPaymentMethod.wrappedComponent.propTypes = {
	toast: PropTypes.instanceOf(ToastManager).isRequired,
	confirm: PropTypes.instanceOf(ConfirmDialog).isRequired,
};

export default AddPaymentMethod;
