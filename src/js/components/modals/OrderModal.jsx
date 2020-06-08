import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import BigNumber from 'bignumber.js';
import Order from '../../app/ECommerce/Order';
import Loading from '../Loading';

import OrderInfo from '../orders/OrderInfo';
import OrderStatus from '../orders/OrderStatus';
import OrderDetails from '../orders/OrderDetails';

const MOCK_TAXES = [
	{
		label: '12.2% Federal Sales Tax',
		value: new BigNumber(3.09),
	},
	{
		label: '5.2% Alabama State Tax',
		value: new BigNumber(0.19),
	},
];

class OrderModal extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		order: PropTypes.instanceOf(Order),
		onRefund: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		order: null,
		onRefund: null,
	};

	createHandleRefund = itemId => () => {
		const orderId = this.props.order.id;

		if (this.props.onRefund && orderId && itemId) {
			this.props.onRefund(orderId, [itemId]);
		}
	};

	getCoverUrl(game) {
		if (game) {
			const covers = get(game, 'shopDetails.covers', []);
			const cover = covers[0];
			return cover ? cover.thumbSmall : undefined;
		}
		return null;
	}

	renderInfo() {
		const { paymentStatus, paymentStatusUpdatedAt, paymentMethod } = this.props.order;

		return (
			<OrderInfo
				status={paymentStatus}
				updatedAt={paymentStatusUpdatedAt}
				creditCard={get(paymentMethod, 'creditCard')}
				billingAddress={get(paymentMethod, 'billingAddress')}
			/>
		);
	}

	renderStatus() {
		const { paymentStatus } = this.props.order;

		return ['processing', 'declined'].includes(paymentStatus) ? (
			<div className="row">
				<div className="col-xs-12">
					<OrderStatus status={paymentStatus} />
				</div>
			</div>
		) : null;
	}

	renderDetails() {
		const { type, total, items, refundable } = this.props.order;
		const action = {
			label: 'Refund',
			icon: 'refund',
		};

		let detailsProps = {};

		if (type === 'game') {
			const games = items.map(item => {
				const { id, game, price, status } = item;
				const { name } = game;

				const refunded = status === 'refunded';

				return {
					name,
					price: new BigNumber(refunded ? 0 : price),
					cover: this.getCoverUrl(game),
					disabled: refunded,
					callback: refunded ? undefined : this.createHandleRefund(id),
				};
			});

			detailsProps = {
				games,
				taxes: MOCK_TAXES,
				action: refundable ? action : null,
			};
		}

		return (
			<div className="row">
				<div className="col-xs-12">
					<OrderDetails type={type} total={total} {...detailsProps} />
				</div>
			</div>
		);
	}

	renderContent() {
		if (!this.props.order) {
			// We can get here if we tried to load an order with an invalid id (the code will redirect, but while
			// redirecting, we will get here.
			return null;
		}

		const { number } = this.props.order;

		return (
			<div className="grid">
				<div className="row">
					<div className="col-xs-12">
						<h1 className="orderModal__title">ORDER #{number}</h1>
					</div>
				</div>

				<div className="row">
					<div className="col-xs-12 col-sm-6">{this.renderInfo()}</div>

					<div className="col-xs-12 col-sm-6">
						<div className="grid">
							{this.renderStatus()}
							{this.renderDetails()}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderLoading() {
		return (
			<div className="orderModal__loading">
				<Loading />
			</div>
		);
	}

	render() {
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderContent();
	}
}

export default OrderModal;
