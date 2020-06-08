import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';
import { formatToken, formatCurrency } from '../../app/utils';
import Order from '../../app/ECommerce/Order';
import Icon from '../icons/Icon';

class OrderItem extends Component {
	static propTypes = {
		order: PropTypes.instanceOf(Order).isRequired,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		onClick: null,
	};

	handleClick = () => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	renderActions = () => (
		<div className="orders__item-actions">
			<Icon icon="findIn" onClick={this.handleClick} />
		</div>
	);

	renderTotal = () => {
		const { total } = this.props.order;

		return (
			<div className="orders__item-total">
				<Icon icon="logo" />
				<div className="orders__amount">
					<div className="orders__amount-tokens">{formatToken(total)}</div>
					<div className="orders__amount-currency">{formatCurrency(total)}</div>
				</div>
			</div>
		);
	};

	renderType = () => {
		const { type, total, items } = this.props.order;

		if (type === 'turbotoken') {
			return (
				<div className="orders__item-wrap">
					<span className="orders__item-text">Purchased</span>
					<span className="orders__item-price">
						<Icon icon="logo" />
						{formatToken(total)}
					</span>
					<span className="orders__item-text">TurboTokens</span>
				</div>
			);
		}

		if (type === 'game') {
			return <div className="orders__item-text">{items.map(item => get(item, 'game.name')).join(', ')}</div>;
		}

		return null;
	};

	render() {
		const { number, insertedAt } = this.props.order;
		return (
			<tr className="orders__item">
				<td className="orders__table-cell orders__item-title">{number}</td>
				<td className="orders__table-cell orders__item-text">{moment(insertedAt).format('ll')}</td>
				<td className="orders__table-cell orders__table-cell--truncate">{this.renderType()}</td>
				<td className="orders__table-cell">{this.renderTotal()}</td>
				<td className="orders__table-cell">{this.renderActions()}</td>
			</tr>
		);
	}
}

export default OrderItem;
