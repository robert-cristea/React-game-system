import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import Component from '../../components/checkout/Payment';
import UI from '../../app/UI';
import Authentication from '../../app/Authentication';
import ToastManager from '../../app/ToastManager';

@inject('ui', 'auth', 'toast')
@observer
class Payment extends ReactComponent {
	static propTypes = {
		buying: PropTypes.bool,
		onBuyGames: PropTypes.bool,
	};

	static defaultProps = {
		buying: false,
		onBuyGames: null,
	};

	@observable
	loading = false;

	@observable
	mounted = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentDidMount() {
		this.user = this.props.auth.getUser();
		this.load();
		this.mounted = true;
	}

	load() {
		this.loading = true;
		this.user
			.getCart()
			.load(['id'])
			.then(() => this.user.fill(['tokenBalance']))
			.catch(e => {
				this.props.toast.error('Could not load your cart items');
				return Promise.reject(e);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	@computed
	get total() {
		if (!this.mounted || this.loading) {
			return new BigNumber(0);
		}

		return this.user.getCart().getTotal();
	}

	@computed
	get hasItems() {
		if (!this.mounted || this.loading) {
			return false;
		}

		return this.user.getCart().items.length > 0;
	}

	@computed
	get tokenBalance() {
		if (!this.mounted || this.loading) {
			return new BigNumber(0);
		}

		return this.user.tokenBalance;
	}

	/**
	 * Returns true if user is still waiting for new tokens to arrive because an token order is still pending
	 * @return {boolean}
	 */
	get hasPendingTokens() {
		// TODO
		return false;
	}

	handleBuyTokens = () => {
		this.props.ui.showBuyTokensModal(null, 'checkout');
	};

	render() {
		return (
			<Component
				hasItems={this.hasItems}
				tokenBalance={this.tokenBalance}
				total={this.total}
				hasPendingTokens={this.hasPendingTokens}
				buying={this.props.buying}
				onBuyGames={this.props.onBuyGames}
				onBuyTokens={this.handleBuyTokens}
			/>
		);
	}
}

Payment.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Payment;
