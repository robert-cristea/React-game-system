import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import BigNumber from 'bignumber.js';
import UI from '../../app/UI';
import Authentication from '../../app/Authentication';
import BuyTokens from '../../components/modals/BuyTokens';
import Paymentwall from '../../app/Server/Paymentwall/Paymentwall';
import PaymentwallError, { TYPES as PW_ERROR_TYPES } from '../../app/Server/Paymentwall/PaymentwallError';
import CreditCard from '../../app/ECommerce/CreditCard';
import Order from '../../app/ECommerce/Order';

const DEFAULT_AMOUNT = new BigNumber(50);

export const VIEWS = {
	SELECT_AMOUNT: 'select-amount',
	ADD_PAYMENT_METHOD: 'add-payment-method',
	PROCESSING: 'processing',
	ERROR: 'error',
	REJECTED: 'rejected',
	PENDING: 'pending',
	SUCCESS: 'success',
};

@inject('ui', 'auth', 'paymentwall')
@observer
class BuyTokensModalHandler extends Component {
	static propTypes = {
		location: PropTypes.string.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	modalOpened = false;

	@observable
	amount = DEFAULT_AMOUNT;

	@observable
	view = VIEWS.SELECT_AMOUNT;

	/**
	 * History of views so we can go "back"
	 * @type {string[]}
	 */
	viewsHistory = [];

	/**
	 * In which context the modal was opened. Will change the success's button label and action
	 * @type {string}
	 */
	@observable
	modalContext: '';

	/**
	 * Callback called when the amount is submitted
	 * @type {function}
	 */
	callback = null;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	@observable
	errorMessage = '';

	componentRef = null;

	/**
	 * @type {Order}
	 */
	order = null;

	componentWillMount() {
		this.didMount = false;
		this.user = this.props.auth.getUser();
		this.registerAsBuyTokensModalHandler();
	}

	componentDidMount() {
		this.didMount = true;
	}

	/**
	 * Called by UI#showBuyTokensModal. Will show the 'buy tokens' modal.
	 *
	 * @param {buySendTokensModalCallback} callback
	 * @param {string} context
	 */
	handleShowSendTokensModal = (callback, context) => {
		this.modalContext = context;
		this.amount = DEFAULT_AMOUNT;
		this.viewsHistory = [];
		this.view = VIEWS.SELECT_AMOUNT;
		this.order = null;
		this.callback = callback;
		this.modalOpened = true;
	};

	registerAsBuyTokensModalHandler() {
		this.props.ui.registerBuyTokensModalHandler(this.handleShowSendTokensModal);
	}

	close() {
		this.modalOpened = false;
	}

	/**
	 * @param {{
	 *     number: string,
	 *     expirationMonth: string,
	 *     expirationYear: string,
	 *     cvv: string,
	 * }} cardData
	 * @param {StreetAddress} addressData
	 */
	handleBuyWithNewCard = (cardData, addressData) => {
		/** @type {Paymentwall} */
		const paymentwall = this.props.paymentwall;
		this.viewsHistory = [VIEWS.SELECT_AMOUNT];
		this.view = VIEWS.PROCESSING;

		paymentwall
			.requestToken(cardData)
			.catch(e => {
				this.view = VIEWS.ERROR;
				this.errorMessage = null;
				if (e instanceof PaymentwallError && e.type === PW_ERROR_TYPES.RESPONSE) {
					this.errorMessage = e.message;
				}
				return Promise.reject(e);
			})
			.then(cardToken => {
				const paymentMethod = new CreditCard();
				paymentMethod.billingAddress = addressData;
				paymentMethod.token = cardToken;
				this.handleBuy(paymentMethod);
			});
	};

	handleBuy = paymentMethod => {
		this.viewsHistory = [VIEWS.SELECT_AMOUNT];
		this.view = VIEWS.PROCESSING;
		this.user
			.purchaseTokens(paymentMethod, this.amount)
			.then(
				/** @type {Order} */ order => {
					this.order = order;
					switch (order.status) {
						case Order.STATUS.COMPLETED:
							this.view = VIEWS.SUCCESS;
							break;
						case Order.STATUS.PENDING:
							this.view = VIEWS.PENDING;
							break;
						case Order.STATUS.REJECTED:
							this.view = VIEWS.REJECTED;
							break;
						default:
							this.view = VIEWS.ERROR;
					}
				},
			)
			.catch(e => {
				this.view = VIEWS.ERROR;
				this.errorMessage = get(e, 'message', null);
				return Promise.reject(e);
			});
	};

	handleClose = () => {
		this.close();
	};

	handleComplete = () => {
		if (this.callback) {
			this.callback(this.order);
		}

		this.close();
	};

	/**
	 * @param {BigNumber} amount
	 */
	handleAmountChange = amount => {
		if (amount.isLessThan(0)) {
			this.amount = new BigNumber(0);
			return;
		}

		this.amount = amount;
	};

	handleAddPaymentMethod = () => {
		this.viewsHistory.push(this.view);
		this.view = VIEWS.ADD_PAYMENT_METHOD;
	};

	handleGoBack = () => {
		if (this.viewsHistory.length) {
			this.view = this.viewsHistory.pop();
		}
	};

	handleGoToPaymentHistory = () => {
		this.close();
		this.props.ui.router.goTo('/dashboard/orders');
	};

	render() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation(this.props.location);

		if (!modalLocation) {
			return null;
		}

		return (
			<BuyTokens
				ref={ref => {
					this.componentRef = ref;
				}}
				tokenAmount={this.amount}
				isOpen={this.modalOpened}
				view={this.view}
				modalContext={this.modalContext}
				parentSelector={() => modalLocation}
				errorMessage={this.errorMessage}
				onBuy={this.handleBuy}
				onBuyWithNewCard={this.handleBuyWithNewCard}
				onAmountChange={this.handleAmountChange}
				onRequestClose={this.handleClose}
				onAddPaymentMethod={this.handleAddPaymentMethod}
				onGoBack={this.handleGoBack}
				onGoToPaymentHistory={this.handleGoToPaymentHistory}
				onComplete={this.handleComplete}
			/>
		);
	}
}

// Injected props
BuyTokensModalHandler.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	paymentwall: PropTypes.instanceOf(Paymentwall).isRequired,
};

export default BuyTokensModalHandler;
