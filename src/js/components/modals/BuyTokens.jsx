import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { observer } from 'mobx-react';
import omit from 'lodash/omit';
import BigNumber from 'bignumber.js';
import Icon from '../icons/Icon';
import { VIEWS } from '../../containers/tokens/BuyTokensModalHandler';
import AmountSelector from '../../containers/modals/buyTokens/AmountSelector';
import AddPaymentMethod from '../../containers/modals/buyTokens/AddPaymentMethod';
import Processing from './buyTokens/Processing';
import Error from './buyTokens/Error';
import Success from './buyTokens/Success';
import Pending from './buyTokens/Pending';

@observer
class BuyTokens extends Component {
	static propTypes = {
		availableTokens: PropTypes.instanceOf(BigNumber),
		view: PropTypes.string,
		modalContext: PropTypes.string,
		tokenAmount: PropTypes.instanceOf(BigNumber),
		errorMessage: PropTypes.string,
		onAmountChange: PropTypes.func,
		onBuy: PropTypes.func,
		onBuyWithNewCard: PropTypes.func,
		onRequestClose: PropTypes.func,
		onAddPaymentMethod: PropTypes.func,
		onGoBack: PropTypes.func,
		onGoToPaymentHistory: PropTypes.func,
		onComplete: PropTypes.func,
	};

	static defaultProps = {
		availableTokens: new BigNumber(0),
		view: '',
		modalContext: '',
		tokenAmount: new BigNumber(50, 10),
		errorMessage: '',
		onAmountChange: null,
		onBuy: null,
		onBuyWithNewCard: null,
		onRequestClose: null,
		onAddPaymentMethod: null,
		onGoBack: null,
		onGoToPaymentHistory: null,
		onComplete: null,
	};

	renderAmountSelector() {
		return (
			<AmountSelector
				tokenAmount={this.props.tokenAmount}
				onAmountChange={this.props.onAmountChange}
				onBuy={this.props.onBuy}
				onAddPaymentMethod={this.props.onAddPaymentMethod}
			/>
		);
	}

	renderAddPaymentMethod() {
		return (
			<AddPaymentMethod
				tokenAmount={this.props.tokenAmount}
				onBuyWithNewCard={this.props.onBuyWithNewCard}
				onGoBack={this.props.onGoBack}
			/>
		);
	}

	renderProcessing() {
		return <Processing />;
	}

	renderError() {
		return <Error message={this.props.errorMessage} onGoBack={this.props.onGoBack} />;
	}

	renderSuccess() {
		const label = this.props.modalContext === 'checkout' ? 'Continue to purchase Game' : 'OK';
		return <Success amount={this.props.tokenAmount} buttonLabel={label} onButtonClick={this.props.onComplete} />;
	}

	renderPending() {
		return <Pending onClose={this.props.onComplete} onGoToPaymentHistory={this.props.onGoToPaymentHistory} />;
	}

	render() {
		let modalClassName = 'infoModal';
		let content = null;

		switch (this.props.view) {
			case VIEWS.ADD_PAYMENT_METHOD:
				content = this.renderAddPaymentMethod();
				modalClassName = 'sendTokensModal';
				break;
			case VIEWS.PROCESSING:
				content = this.renderProcessing();
				break;
			case VIEWS.ERROR:
				content = this.renderError();
				break;
			case VIEWS.SUCCESS:
				content = this.renderSuccess();
				break;
			case VIEWS.PENDING:
				content = this.renderPending();
				break;
			default:
				content = this.renderAmountSelector();
				modalClassName = 'sendTokensModal';
		}

		const modalProps = {
			...omit(this.props, Object.keys(BuyTokens.propTypes)),
			ariaHideApp: false,
			portalClassName: `modal ${modalClassName}__modal`,
			overlayClassName: `modal__overlay ${modalClassName}__overlay`,
			className: `modal__content ${modalClassName}__content`,
			closeTimeoutMS: 300,
		};

		return (
			<ReactModal {...modalProps}>
				<div className={modalClassName}>
					<button
						className={`${modalClassName}__close btn btn--transparent`}
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

export default BuyTokens;
