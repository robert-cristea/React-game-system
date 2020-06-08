import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import Component from '../../../components/modals/buyTokens/AmountSelector';
import Authentication from '../../../app/Authentication';
import ToastManager from '../../../app/ToastManager';
import ConfirmDialog from '../../../app/ConfirmDialog';

@inject('toast', 'auth', 'confirm')
@observer
class AmountSelector extends ReactComponent {
	static propTypes = {
		tokenAmount: PropTypes.instanceOf(BigNumber),
	};

	static defaultProps = {
		tokenAmount: new BigNumber(0),
	};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	/**
	 * @type {boolean}
	 */
	@observable
	loadingPaymentMethods = false;

	/**
	 * @type {PaymentMethod|NEW_VALUE|null}
	 */
	@observable
	selectedPaymentMethod = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.selectedPaymentMethod = null;
		this.loadPaymentMethods();
	}

	loadPaymentMethods() {
		this.loadingPaymentMethods = true;
		this.user
			.loadPaymentMethods(true)
			.catch(e => {
				this.props.toast.error('Could not load your saved credit cards');
				return Promise.reject(e);
			})
			.finally(() => {
				this.loadingPaymentMethods = false;
			});
	}

	/**
	 * @param {BigNumber} amount
	 */
	calculateFiatValue = amount => amount.toNumber();

	/**
	 * @param {PaymentMethod|NEW_VALUE} pm
	 */
	handlePaymentMethodSelect = pm => {
		this.selectedPaymentMethod = pm;
	};

	handleBuy = () => {
		const message = `You are about to buy ${this.props.tokenAmount.toNumber()} TurboTokens with your \
			credit card ending in **** ${this.selectedPaymentMethod.last4}. Do you wish to continue?`;

		const onClick = () => {
			if (this.props.onBuy) {
				this.props.onBuy(this.selectedPaymentMethod);
			}
		};

		const buttons = [{ label: 'Continue', isMain: true, onClick }, { label: 'Cancel', isCancel: true }];

		const options = {
			closeOnEsc: true,
		};

		this.props.confirm.show('Buy TurboTokens?', message, buttons, options);
	};

	render() {
		const componentProps = this.props;

		return (
			<Component
				{...componentProps}
				loadingPaymentMethods={this.loadingPaymentMethods}
				calculateFiatValue={this.calculateFiatValue}
				paymentMethods={this.user.paymentMethods}
				availableTokens={this.user.tokenBalance}
				selectedPaymentMethod={this.selectedPaymentMethod}
				onSelectPaymentMethod={this.handlePaymentMethodSelect}
				onBuy={this.handleBuy}
			/>
		);
	}
}

// Injected props
AmountSelector.wrappedComponent.propTypes = {
	toast: PropTypes.instanceOf(ToastManager).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	confirm: PropTypes.instanceOf(ConfirmDialog).isRequired,
};

export default AmountSelector;
