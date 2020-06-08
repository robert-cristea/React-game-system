import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Icon from '../icons/Icon';
import { formatCurrency, formatToken } from '../../app/utils';
import OrderStatus from '../orders/OrderStatus';

class Payment extends ReactComponent {
	static propTypes = {
		hasItems: PropTypes.bool,
		tokenBalance: PropTypes.instanceOf(BigNumber),
		total: PropTypes.instanceOf(BigNumber),
		hasPendingTokens: PropTypes.bool,
		buying: PropTypes.bool,
		onBuyTokens: PropTypes.func,
		onBuyGames: PropTypes.func,
	};

	static defaultProps = {
		hasItems: false,
		tokenBalance: new BigNumber(0),
		total: new BigNumber(0),
		buying: false,
		hasPendingTokens: false,
		onBuyTokens: null,
		onBuyGames: null,
	};

	hasEnoughTokens() {
		return this.props.total.lte(this.props.tokenBalance);
	}

	hasPendingTokens() {
		return this.props.hasPendingTokens;
	}

	renderStatusMessage() {
		let title = null;
		let message = null;
		let status = null;

		if (!this.hasEnoughTokens()) {
			const diff = this.props.total.minus(this.props.tokenBalance);
			title = 'Insufficient balance';
			status = 'declined';
			message = (
				<span>
					You require{' '}
					<span key="inlineTokenAmount" className="inlineTokenAmount">
						<Icon icon="logo" inline key="icon" />
						{formatToken(diff, false)}
					</span>{' '}
					TurboTokens to complete the checkout.
				</span>
			);
		}

		if (this.hasPendingTokens()) {
			title = 'Payment processing';
			status = 'processing';
			message =
				'Your TurboToken purchase is currently being processed. ' +
				'We will notify you when the purchase has been confirmed.';
		}

		if (title || message) {
			return (
				<div className="checkoutPayment__status">
					<OrderStatus title={title} size="small" description={message} status={status} />
				</div>
			);
		}

		return null;
	}

	renderSummary() {
		return (
			<div>
				<div className="orderDetails__amountRow checkoutPayment__amountRow">
					<p className="orderDetails__amountRow-title">Your balance</p>
					<div className="orderDetails__price orderDetails__price--small">
						<Icon icon="logo" />
						<div className="orderDetails__price-wrap">
							<div className="orderDetails__price-tokens">{formatToken(this.props.tokenBalance)}</div>
							<div className="orderDetails__price-currency">{formatCurrency(this.props.tokenBalance)}</div>
						</div>
					</div>
				</div>
				<div className="orderDetails__amountRow checkoutPayment__amountRow">
					<p className="orderDetails__amountRow-title">Total</p>
					<div className="orderDetails__price orderDetails__price--large">
						<Icon icon="logo" />
						<div className="orderDetails__price-wrap">
							<div className="orderDetails__price-tokens">{formatToken(this.props.total)}</div>
							<div className="orderDetails__price-currency">{formatCurrency(this.props.total)}</div>
						</div>
					</div>
				</div>
				<div className="checkoutPayment__details">Price includes applicable taxes.</div>
			</div>
		);
	}

	renderAction() {
		if (!this.hasEnoughTokens()) {
			if (this.hasPendingTokens()) {
				return (
					<button type="button" disabled className="btn btn--disabled">
						Purchase now
					</button>
				);
			}

			return (
				<button type="button" className="btn btn--main" onClick={this.props.onBuyTokens}>
					Purchase TurboTokens
				</button>
			);
		}

		if (this.props.buying) {
			return (
				<button type="button" disabled className="btn">
					<Icon icon="loading" className="icon-loading" />
					<span>Processing...</span>
				</button>
			);
		}

		return (
			<button type="button" className="btn btn--main" onClick={this.props.onBuyGames}>
				Purchase now
			</button>
		);
	}

	render() {
		if (!this.props.hasItems) {
			return null;
		}

		return (
			<div className="checkout__payment checkoutPayment">
				<div className="checkout__sectionHeader">
					<h2 className="checkout__sectionTitle">
						<Icon icon="card" />
						Payment
					</h2>
				</div>
				{this.renderStatusMessage()}
				{this.renderSummary()}
				<div className="checkoutPayment__actions">{this.renderAction()}</div>
			</div>
		);
	}
}

export default Payment;
