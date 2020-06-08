import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../icons/Icon';

const propTypes = {
	onClose: PropTypes.func,
	onGoToPaymentHistory: PropTypes.func,
};

const defaultProps = {
	onClose: null,
	onGoToPaymentHistory: null,
};

function Pending(props) {
	return (
		<div className="infoModal__contentWrapper">
			<div className="infoModal__header">
				<div className="infoModal__headerIcon infoModal__headerIcon--circle infoModal__headerIcon--info">
					<Icon icon="clock" />
				</div>
				<div className="infoModal__title">Sorry this is taking so long</div>
			</div>
			<div className="infoModal__main">
				<p>
					Your transaction is currently being processed. We will notify you with an update shortly or you can check your
					Payment History for details.
				</p>
			</div>
			<div className="infoModal__actions infoModal__actions--medium">
				<button className="infoModal__action btn btn--main btn--low" onClick={props.onClose}>
					OK
				</button>
				<button className="infoModal__action btn btn--border btn--low" onClick={props.onGoToPaymentHistory}>
					See payment history
				</button>
			</div>
		</div>
	);
}

Pending.propTypes = propTypes;
Pending.defaultProps = defaultProps;

export default Pending;
