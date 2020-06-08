import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import omit from 'lodash/omit';
import BigNumber from 'bignumber.js';
import Icon from '../icons/Icon';
import User from '../../app/User';
import { formatToken, formatCurrency } from '../../app/utils';
import Loading from '../Loading';

@observer
class SendTokens extends Component {
	static propTypes = {
		availableTokens: PropTypes.instanceOf(BigNumber),
		isOpen: PropTypes.bool,
		amount: PropTypes.instanceOf(BigNumber),
		type: PropTypes.oneOf(['send', 'add']),
		status: PropTypes.oneOf(['ready', 'sending', 'sent', 'error']),
		toUser: PropTypes.instanceOf(User).isRequired,
		onAmountChange: PropTypes.func,
		onSend: PropTypes.func,
		onRequestClose: PropTypes.func,
	};

	static defaultProps = {
		availableTokens: new BigNumber(0),
		isOpen: false,
		amount: new BigNumber(50, 10),
		type: 'send',
		status: 'ready',
		onAmountChange: null,
		onSend: null,
		onRequestClose: null,
	};

	/**
	 * Value in the input. This value will be parsed and put in this.amount if valid.
	 * @type {string}
	 */
	@observable
	value = '';

	componentWillMount() {
		this.reset();
	}

	reset() {
		this.value = '';
	}

	getTitle() {
		return this.props.type === 'add' ? 'Add Tokens' : 'Send Tokens';
	}

	getButtonTitle() {
		return this.props.type === 'add' ? 'ADD' : 'SEND';
	}

	handleValueChange = event => {
		const { value } = event.target;
		const numericValue = Number.parseFloat(value);

		if (!Number.isNaN()) {
			this.updateAmount(new BigNumber(numericValue, 10));
		}

		this.value = value;
	};

	handleAmountButtonClick = amount => () => {
		this.value = '';
		this.updateAmount(new BigNumber(amount, 10));
	};

	/**
	 * @param {number} amount
	 */
	updateAmount(amount) {
		if (this.props.onAmountChange) {
			this.props.onAmountChange(amount);
		}
	}

	handleSubmit = () => {
		if (this.props.onSend) {
			this.props.onSend(this.props.amount);
		}
	};

	renderLoading() {
		// The loading is shown over the form, so we render both
		return (
			<Fragment>
				<div className="sendTokensModal__loading">
					<Loading />
				</div>
				{this.renderForm()}
			</Fragment>
		);
	}

	renderSuccessMessage() {
		let amountText = formatToken(this.props.amount);
		amountText += this.props.amount > 1 ? ' tokens were' : ' token was';

		const message =
			this.props.type === 'send' ? `${amountText} successfully sent!` : `${amountText} successfully added!`;

		return (
			<Fragment>
				<div className="sendTokensModal__title">{this.getTitle()}</div>
				<div className="sendTokensModal__message">{message}</div>
				<button className="btn btn--main btn--wide" onClick={this.props.onRequestClose}>
					Close
				</button>
			</Fragment>
		);
	}

	renderErrorMessage() {
		const message =
			this.props.type === 'send'
				? 'An error occured, the tokens were not sent.'
				: 'An error occured, the tokens were not added.';

		return (
			<Fragment>
				<div className="sendTokensModal__title">{this.getTitle()}</div>
				<div className="sendTokensModal__message">{message}</div>
				<button className="btn btn--main btn--wide" onClick={this.props.onRequestClose}>
					Close
				</button>
			</Fragment>
		);
	}

	renderForm() {
		const amountButtons = [50, 100, 250, 500, 1000].map(amount => {
			const active = this.props.amount.isEqualTo(amount);
			const disabled = this.props.type === 'send' && this.props.availableTokens.isLessThan(amount);

			return (
				<div
					key={amount}
					className={`sendTokensModal__amountButton ${active ? 'sendTokensModal__amountButton--active' : ''} ${
						disabled ? 'sendTokensModal__amountButton--disabled' : ''
					}`}
					onClick={disabled ? null : this.handleAmountButtonClick(amount)}
				>
					{amount}
				</div>
			);
		});

		return (
			<Fragment>
				<div className="sendTokensModal__title">{this.getTitle()}</div>
				<div className="sendTokensModal__balance">
					<div className="sendTokensModal__balanceLabel">Your tokens</div>
					<Icon icon="logo" />
					<div className="sendTokensModal__balanceAmount">
						<div className="sendTokensModal__balanceAmount-tokens">{formatToken(this.props.availableTokens)}</div>
						<div className="sendTokensModal__balanceAmount-currency">{formatCurrency(this.props.availableTokens)}</div>
					</div>
				</div>
				<div className="sendTokensModal__subtitle">Select amount</div>
				<div className="sendTokensModal__amountSelector">{amountButtons}</div>
				<div className="sendTokensModal__amountInput">
					<input
						value={this.value}
						className="input--alt1"
						type="text"
						onChange={this.handleValueChange}
						placeholder="Enter token amount"
					/>
				</div>
				<div className="sendTokensModal__selectedAmount-wrap">
					<Icon icon="logo" />
					<div className="sendTokensModal__selectedAmount">
						<div className="sendTokensModal__selectedAmount-tokens">{formatToken(this.props.amount)}</div>
						<div className="sendTokensModal__selectedAmount-currency">{formatCurrency(this.props.amount)}</div>
					</div>
				</div>
				<button className="btn btn--main btn--wide" onClick={this.handleSubmit}>
					{this.getButtonTitle()}
				</button>
			</Fragment>
		);
	}

	render() {
		const modalProps = {
			...omit(this.props, ['toUser', 'isCurrentUser', 'onSend', 'initialAmount']),
			ariaHideApp: false,
			portalClassName: 'modal sendTokensModal__modal',
			overlayClassName: 'modal__overlay sendTokensModal__overlay',
			className: 'modal__content sendTokensModal__content',
			closeTimeoutMS: 300,
		};

		let content = null;

		switch (this.props.status) {
			case 'ready':
				content = this.renderForm();
				break;
			case 'sending':
				content = this.renderLoading();
				break;
			case 'sent':
				content = this.renderSuccessMessage();
				break;
			default:
				content = this.renderErrorMessage();
		}

		return (
			<ReactModal {...modalProps}>
				<div className="sendTokensModal">
					<button
						className="sendTokensModal__close btn btn--transparent"
						onClick={this.props.onRequestClose}
						type="button"
					>
						<Icon icon="cancel" />
					</button>
					{content}
				</div>
			</ReactModal>
		);
	}
}

export default SendTokens;
