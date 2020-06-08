import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Icon from '../../icons/Icon';

const propTypes = {
	amount: PropTypes.instanceOf(BigNumber),
	buttonLabel: PropTypes.string,
	onButtonClick: PropTypes.func,
};

const defaultProps = {
	amount: new BigNumber(0),
	buttonLabel: null,
	onButtonClick: null,
};

function Success(props) {
	return (
		<div className="infoModal__contentWrapper">
			<div className="infoModal__header">
				<div className="infoModal__headerIcon infoModal__headerIcon--circle infoModal__headerIcon--success">
					<Icon icon="accept" />
				</div>
				<div className="infoModal__title">Thank you</div>
			</div>
			<div className="infoModal__main">
				<p>Your purchase was successful!</p>
				<p>
					<strong>
						<span className="inlineTokenAmount">
							<Icon icon="logo" inline />
							{props.amount.toNumber()}
						</span>
						<span> TurboTokens</span>
					</strong>
					<span> will be available for you to use immediately.</span>
				</p>
			</div>
			<div className="infoModal__actions infoModal__actions--wide">
				<button className="infoModal__action btn btn--main btn--low" onClick={props.onButtonClick}>
					{props.buttonLabel}
				</button>
			</div>
		</div>
	);
}

Success.propTypes = propTypes;
Success.defaultProps = defaultProps;

export default Success;
