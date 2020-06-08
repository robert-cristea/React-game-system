import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import UI from '../../app/UI';
import SendTokens from '../../components/modals/SendTokens';
import Authentication from '../../app/Authentication';

const DEFAULT_AMOUNT = new BigNumber(50);

@inject('ui', 'auth')
@observer
class SendTokensModalHandler extends Component {
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

	/**
	 * To which user the tokens are sent
	 * @type {MockObject}
	 */
	@observable
	toUser = null;

	@observable
	amount = DEFAULT_AMOUNT;

	/**
	 * @type {'ready'|'sending'|'sent'|'error'}
	 */
	@observable
	status = 'ready';

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

	componentRef = null;

	componentWillMount() {
		this.didMount = false;
		this.user = this.props.auth.getUser();
		this.registerAsSendTokensModalHandler();
	}

	componentDidMount() {
		this.didMount = true;
	}

	@computed
	get external() {
		return this.toUser !== this.user;
	}

	/**
	 * Called by UI#showSendTokensModal. Will show the 'send tokens' modal. The `callback` is the
	 * function to call with the amount when the amount is submitted.
	 * @param {MockObject} toUser
	 * @param {buySendTokensModalCallback} callback
	 */
	handleShowSendTokensModal = (toUser, callback) => {
		this.amount = DEFAULT_AMOUNT;
		this.toUser = toUser;
		this.callback = callback;
		this.modalOpened = true;
		this.status = 'ready';

		if (this.componentRef) {
			this.componentRef.reset();
		}
	};

	registerAsSendTokensModalHandler() {
		this.props.ui.registerSendTokensModalHandler(this.handleShowSendTokensModal);
	}

	getAvailableTokens() {
		return this.user.tokenBalance;
	}

	/**
	 * @return {BigNumber}
	 */
	getMaximum() {
		if (this.external) {
			return this.getAvailableTokens();
		}
		return new BigNumber(1000);
	}

	close() {
		this.modalOpened = false;
	}

	handleSend = amount => {
		this.status = 'sending';
		const method = this.user.sendTokens(amount, this.toUser);

		method
			.then(() => {
				if (this.callback) {
					this.callback(amount);
				}
				this.status = 'sent';
			})
			.catch(() => {
				this.status = 'error';
			});
	};

	handleClose = () => {
		this.close();
	};

	/**
	 * @param {BigNumber} amount
	 */
	handleAmountChange = amount => {
		if (amount.isLessThan(0)) {
			this.amount = DEFAULT_AMOUNT;
			return;
		}

		const max = this.getMaximum();

		if (max.isGreaterThan(0) && max.isLessThan(amount)) {
			this.amount = max;
			return;
		}

		this.amount = amount;
	};

	render() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		if (!this.toUser) {
			return null;
		}

		const modalLocation = this.props.ui.getModalLocation(this.props.location);

		if (!modalLocation) {
			return null;
		}

		return (
			<SendTokens
				ref={ref => {
					this.componentRef = ref;
				}}
				availableTokens={this.getAvailableTokens()}
				amount={this.amount}
				isOpen={this.modalOpened}
				parentSelector={() => modalLocation}
				type={this.external ? 'send' : 'add'}
				status={this.status}
				toUser={this.toUser}
				onSend={this.handleSend}
				onAmountChange={this.handleAmountChange}
				onRequestClose={this.handleClose}
			/>
		);
	}
}

// Injected props
SendTokensModalHandler.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default SendTokensModalHandler;
