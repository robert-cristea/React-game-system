import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Icon from '../icons/Icon';
import Game from '../../app/Game';
import { formatToken, formatCurrency } from '../../app/utils';

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GamePrice(props) {
	const { game } = props;
	const { onSale, price, salePrice } = game;

	const renderPrice = format =>
		onSale ? (
			<Fragment>
				<span>{format(salePrice)}</span>
				<span className="gameDetails__amount--sale">{format(price)}</span>
			</Fragment>
		) : (
			<span>{format(price)}</span>
		);

	return game.published && price ? (
		<div className="gameDetails__price">
			<Icon icon="logo" />
			<div className="gameDetails__amount">
				<div className="gameDetails__amount-tokens">{renderPrice(formatToken)}</div>
				<div className="gameDetails__amount-currency">{renderPrice(formatCurrency)}</div>
			</div>
		</div>
	) : null;
}

GamePrice.propTypes = propTypes;
GamePrice.defaultProps = defaultProps;

export default GamePrice;
