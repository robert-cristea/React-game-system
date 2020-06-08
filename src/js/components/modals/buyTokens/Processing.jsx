import React from 'react';
import Icon from '../../icons/Icon';

function Processing() {
	return (
		<div className="infoModal__contentWrapper">
			<div className="infoModal__header">
				<div className="infoModal__headerIcon infoModal__headerIcon--working">
					<Icon icon="logo" />
					<Icon icon="logo" />
					<Icon icon="logo" />
				</div>
				<div className="infoModal__title">Payment Processing</div>
			</div>
			<div className="infoModal__main">
				<p>Your payment is processing.</p>
				<p>We’ll let you know when your credit card is charged.</p>
			</div>
		</div>
	);
}

export default Processing;
