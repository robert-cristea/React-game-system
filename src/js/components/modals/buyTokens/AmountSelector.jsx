import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { observable } from 'mobx';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import Select from 'react-select';
import Icon from '../../icons/Icon';
import { formatCurrency, formatToken } from '../../../app/utils';
import PaymentMethod from '../../../app/ECommerce/PaymentMethod';
import Loading from '../../Loading';
import CreditCard from '../../../app/ECommerce/CreditCard';

export const NEW_VALUE = '__new__';

@observer
class AmountSelector extends ReactComponent {
	static propTypes = {
		availableTokens: PropTypes.instanceOf(BigNumber),
		tokenAmount: PropTypes.instanceOf(BigNumber),
		loadingPaymentMethods: PropTypes.bool,
		paymentMethods: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(PaymentMethod)),
		selectedPaymentMethod: PropTypes.oneOfType([PropTypes.instanceOf(PaymentMethod), PropTypes.string]),
		calculateFiatValue: PropTypes.func,
		onBuy: PropTypes.func,
		onSelectPaymentMethod: PropTypes.func,
		onAmountChange: PropTypes.func,
		onAddPaymentMethod: PropTypes.func,
	};

	static defaultProps = {
		availableTokens: new BigNumber(0),
		tokenAmount: new BigNumber(50, 10),
		loadingPaymentMethods: false,
		paymentMethods: [],
		selectedPaymentMethod: null,
		calculateFiatValue: null,
		onBuy: null,
		onSelectPaymentMethod: null,
		onAmountChange: null,
		onAddPaymentMethod: null,
	};

	/**
	 * Value in the input. This value will be parsed and put in this.amount if valid.
	 * @type {string}
	 */
	@observable
	value = '';

	componentWillMount() {
		this.value = '';
	}

	handleAmountButtonClick = amount => () => {
		this.value = `${amount}`;
		this.updateAmount(new BigNumber(amount, 10));
	};

	handleValueChange = event => {
		const { value } = event.target;

		// If value is invalid, we do nothing
		if (value.length && !value.match(/^[0-9]+$/)) return;

		const numericValue = Number.parseFloat(value);

		if (numericValue > 9999999999999) return;

		this.updateAmount(new BigNumber(numericValue, 10));

		this.value = value;
	};

	/**
	 * @param {number} amount
	 */
	updateAmount(amount) {
		if (this.props.onAmountChange) {
			this.props.onAmountChange(amount);
		}
	}

	/**
	 * @param {BigNumber} amount
	 * @return {number}
	 */
	getFiatValue(amount) {
		if (this.props.calculateFiatValue) {
			return this.props.calculateFiatValue(amount);
		}

		return 0;
	}

	handlePaymentMethodSelect = selectedData => {
		if (!this.props.onSelectPaymentMethod) {
			return;
		}

		if (selectedData.instance) {
			this.props.onSelectPaymentMethod(selectedData.instance);
		}

		if (selectedData.isAddNew) {
			this.props.onSelectPaymentMethod(NEW_VALUE);
		}
	};

	validateAmount = () => {
		if (this.props.tokenAmount.isNaN()) {
			return false;
		}

		if (this.props.tokenAmount.lte(0)) {
			return false;
		}

		return true;
	};

	renderPaymentMethodsSelect() {
		if (this.props.loadingPaymentMethods || !this.props.paymentMethods.length) {
			return null;
		}

		let value = null;
		const options = [];

		this.props.paymentMethods.forEach(pm => {
			const option = {
				value: pm.id,
				label: pm instanceof CreditCard ? `**** **** **** ${pm.last4}` : pm.id,
				instance: pm,
			};

			options.push(option);

			if (pm === this.props.selectedPaymentMethod) {
				value = option;
			}
		});

		const addNewOption = {
			value: NEW_VALUE,
			label: (
				<span className="sendTokensModal__addCCOption">
					<Icon icon="add" /> Add a Payment Method
				</span>
			),
			isAddNew: true,
		};

		options.push(addNewOption);

		if (this.props.selectedPaymentMethod === NEW_VALUE) {
			value = addNewOption;
		}

		return (
			<div className="sendTokensModal__field">
				<Select
					value={value}
					options={options}
					name="paymentMethods"
					isSearchable={false}
					placeholder="Select a payment method"
					onChange={this.handlePaymentMethodSelect}
					className="select-react__container sendTokensModal__ccSelector"
					classNamePrefix="select-react"
				/>
			</div>
		);
	}

	renderActionButton() {
		if (this.props.loadingPaymentMethods) {
			return null;
		}

		let label = 'Purchase now';
		let disabled = this.props.paymentMethods.length > 0 && !this.props.selectedPaymentMethod;
		let callback = null;

		if (!this.validateAmount()) {
			disabled = true;
		}

		if (!disabled && (this.props.selectedPaymentMethod === NEW_VALUE || !this.props.paymentMethods.length)) {
			label = (
				<Fragment>
					<Icon icon="add" />
					<span>Add a Payment Method</span>
				</Fragment>
			);
		}

		if (!disabled) {
			callback =
				this.props.selectedPaymentMethod instanceof PaymentMethod ? this.props.onBuy : this.props.onAddPaymentMethod;
		}

		return (
			<div className="sendTokensModal__actions">
				<button
					className={`btn ${disabled ? 'btn--border' : 'btn--main'} btn--wide`}
					disabled={disabled}
					onClick={callback}
				>
					{label}
				</button>
			</div>
		);
	}

	renderLoading() {
		if (!this.props.loadingPaymentMethods) {
			return null;
		}

		return (
			<div className="sendTokensModal__paymentMethodsLoading">
				<Loading size="small" />
			</div>
		);
	}

	render() {
		const amountButtons = [50, 100, 250, 500, 1000].map(amount => {
			const active = this.props.tokenAmount.isEqualTo(amount);

			return (
				<div
					key={amount}
					className={`sendTokensModal__amountButton ${active ? 'sendTokensModal__amountButton--active' : ''}`}
					onClick={this.handleAmountButtonClick(amount)}
				>
					{amount}
				</div>
			);
		});

		return (
			<Fragment>
				<div className="sendTokensModal__header">
					<div className="sendTokensModal__title">Add TurboTokens</div>
				</div>
				<div className="sendTokensModal__balance">
					<div className="sendTokensModal__balanceLabel">
						<Icon icon="logo" />
						Your TurboTokens
					</div>
					<div className="sendTokensModal__balanceAmount">{formatToken(this.props.availableTokens)}</div>
				</div>
				<div className="sendTokensModal__field">
					<div className="sendTokensModal__label">Select amount</div>
					<div className="sendTokensModal__amountSelector">{amountButtons}</div>
					<div>
						<input
							value={this.value}
							className="input--alt1"
							type="text"
							onChange={this.handleValueChange}
							placeholder="Enter token amount"
						/>
					</div>
					<div className="sendTokensModal__selectedAmount">
						<Icon icon="logo" />
						<div className="sendTokensModal__selectedAmount-amounts">
							<div className="sendTokensModal__selectedAmount-tokens">{formatToken(this.props.tokenAmount, false)}</div>
							<div className="sendTokensModal__selectedAmount-currency">
								{formatCurrency(this.getFiatValue(this.props.tokenAmount), false)}
							</div>
						</div>
					</div>
				</div>
				{this.renderLoading()}
				{this.renderPaymentMethodsSelect()}
				{this.renderActionButton()}
			</Fragment>
		);
	}
}

export default AmountSelector;
