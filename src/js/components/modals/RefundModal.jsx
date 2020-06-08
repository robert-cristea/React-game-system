import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';

const propTypes = {
	loading: PropTypes.bool,
	onClose: PropTypes.func,
	onRefund: PropTypes.func,
};

const defaultProps = {
	loading: false,
	onClose: null,
	onRefund: null,
};

function RefundModal(props) {
	return (
		<div className="infoModal__contentWrapper">
			{props.loading ? (
				<div className="infoModal__loading">
					<Loading />
				</div>
			) : (
				<Fragment>
					<div className="infoModal__header">
						<div className="infoModal__title">Refund this game?</div>
					</div>
					<div className="infoModal__main">
						<p>You will no longer be able to play this game. Your TurboTokens will be credited into your account.</p>
					</div>
					<div className="infoModal__actions infoModal__actions--medium">
						<button className="infoModal__action btn btn--main btn--low" onClick={props.onRefund}>
							Refund
						</button>
						<button className="infoModal__action btn btn--border btn--low" onClick={props.onClose}>
							Cancel
						</button>
					</div>
				</Fragment>
			)}
		</div>
	);
}

RefundModal.propTypes = propTypes;
RefundModal.defaultProps = defaultProps;

export default RefundModal;
