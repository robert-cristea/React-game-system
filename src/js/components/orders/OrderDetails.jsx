import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { formatToken, formatCurrency } from '../../app/utils';
import Icon from '../icons/Icon';

class OrderDetails extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['turbotoken', 'game']),
		total: PropTypes.instanceOf(BigNumber),
		taxes: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.instanceOf(BigNumber),
			}),
		),
		games: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				qty: PropTypes.number,
				price: PropTypes.instanceOf(BigNumber),
				cover: PropTypes.string,
				callback: PropTypes.func,
				disabled: PropTypes.boolean,
			}),
		),
		action: PropTypes.shape({
			label: PropTypes.string,
			icon: PropTypes.string,
		}),
		totalPriceSize: PropTypes.string,
	};

	static defaultProps = {
		type: '',
		total: 0,
		taxes: [],
		games: [],
		action: null,
		totalPriceSize: '',
	};

	hasActions(games) {
		return games.some(game => game.action);
	}

	renderPrice = price => (
		<div className="orderDetails__item-price">
			<Icon icon="logo" />
			<div className="orderDetails__amount">
				<div className="orderDetails__amount-tokens">{formatToken(price)}</div>
				<div className="orderDetails__amount-currency">{formatCurrency(price)}</div>
			</div>
		</div>
	);

	renderGames(games, action) {
		return games.map(game => (
			<Fragment key={game.name}>
				<tr className="orderDetails__table-spacer" />
				<tr className={`orderDetails__item ${game.disabled ? 'orderDetails__item--disabled' : ''}`}>
					<td className="orderDetails__item-cell">
						<div className="orderDetails__item-wrap">
							<img className="orderDetails__item-cover" src={game.cover} alt={game.name} />
							<h3 className="orderDetails__item-name">{game.name}</h3>
						</div>
					</td>

					<td className="orderDetails__item-cell">{this.renderPrice(game.price)}</td>

					{action && (
						<td className="orderDetails__item-cell">
							<div className="orderDetails__item-action">
								<button className="orderDetails__item-button" onClick={game.callback}>
									<Icon icon={action.icon} />
								</button>
							</div>
						</td>
					)}
				</tr>
			</Fragment>
		));
	}

	renderTokens(total, action) {
		return (
			<Fragment>
				<tr className="orderDetails__table-spacer" />
				<tr className="orderDetails__item">
					<td className="orderDetails__item-cell">
						<div className="orderDetails__item-wrap">
							<Icon className="orderDetails__item-icon" icon="logo" />
							<h3 className="orderDetails__item-name">{formatToken(total)}</h3>
							<p className="orderDetails__item-text">TurboTokens</p>
						</div>
					</td>

					<td className="orderDetails__item-cell">{this.renderPrice(total)}</td>

					{action && <td className="orderDetails__item-cell" />}
				</tr>
			</Fragment>
		);
	}

	renderTaxes(taxes) {
		return taxes.map(tax => (
			<div key={tax.label} className="orderDetails__taxes">
				<p className="orderDetails__taxes-label">{tax.label}</p>
				<p className="orderDetails__taxes-label">{formatCurrency(tax.value)}</p>
			</div>
		));
	}

	renderTotal(total, type) {
		let content = null;
		const priceSizeClass = this.props.totalPriceSize ? `orderDetails__price--${this.props.totalPriceSize}` : '';

		if (type === 'game') {
			content = (
				<div className={`orderDetails__price ${priceSizeClass}`}>
					<Icon icon="logo" />
					<div className="orderDetails__price-wrap">
						<div className="orderDetails__price-tokens">{formatToken(total)}</div>
						<div className="orderDetails__price-currency">{formatCurrency(total)}</div>
					</div>
				</div>
			);
		}

		if (type === 'turbotoken') {
			content = (
				<div className="orderDetails__price">
					<div className="orderDetails__price-wrap">
						<div className="orderDetails__price-tokens">{formatCurrency(total)}</div>
					</div>
				</div>
			);
		}

		return (
			<div className="orderDetails__amountRow">
				<p className="orderDetails__amountRow-title">TOTAL</p>
				{content}
			</div>
		);
	}

	render() {
		const { type, total, taxes, games, action } = this.props;

		const className = 'orderDetails';
		const table = `${className}__table`;

		let content = null;

		if (type === 'game') {
			content = games && games.length ? this.renderGames(games, action) : null;
		}

		if (type === 'turbotoken') {
			content = total ? this.renderTokens(total, action) : null;
		}

		return content ? (
			<div className="orderDetails">
				<table className={table}>
					<thead>
						<tr className={`${table}-row`}>
							<th className={`${table}-title ${table}-cell`}>ITEMS</th>
							<th className={`${table}-title ${table}-cell ${table}-title--center`}>SUBTOTAL</th>
							{action && <th className={`${table}-title ${table}-cell ${table}-title--center`}>{action.label}</th>}
						</tr>
					</thead>

					<tbody>{content}</tbody>
				</table>

				{taxes && this.renderTaxes(taxes)}
				{total && this.renderTotal(total, type)}
			</div>
		) : null;
	}
}

export default OrderDetails;
