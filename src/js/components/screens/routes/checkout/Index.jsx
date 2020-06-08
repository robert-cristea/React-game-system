import React from 'react';
import PropTypes from 'prop-types';
import Items from '../../../../containers/checkout/Items';
import Payment from '../../../../containers/checkout/Payment';

function Index(props) {
	return (
		<div className="checkout">
			<h1 className="checkout__title">Checkout</h1>
			<div className="checkout__content">
				<div className="checkout__cols">
					<Items buying={props.buying} />
					<Payment buying={props.buying} onBuyGames={props.onBuyGames} />
				</div>
			</div>
		</div>
	);
}

Index.propTypes = {
	buying: PropTypes.bool,
	onBuyGames: PropTypes.func,
};

Index.defaultProps = {
	buying: false,
	onBuyGames: null,
};

export default Index;
