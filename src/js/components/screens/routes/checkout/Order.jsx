import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import OrderModel from '../../../../app/ECommerce/Order';
import Icon from '../../../icons/Icon';
import Loading from '../../../Loading';
import OrderDetails from '../../../orders/OrderDetails';
import OrderInfo from '../../../orders/OrderInfo';

class Order extends ReactComponent {
	static propTypes = {
		order: PropTypes.instanceOf(OrderModel),
		loading: PropTypes.bool,
		userFirstName: PropTypes.string,
		onGoToGames: PropTypes.func,
	};

	static defaultProps = {
		order: null,
		loading: false,
		userFirstName: null,
		onGoToGames: null,
	};

	getGames() {
		return this.props.order.items.map(item => ({
			name: item.game.name,
			qty: item.qty,
			price: item.price,
			cover: get(item.game, 'shopDetails.covers.0.thumbSmall'),
		}));
	}

	renderLoading() {
		return (
			<div className="checkout__loading">
				<Loading />
			</div>
		);
	}

	renderContent() {
		if (!this.props.order) {
			return null;
		}

		return (
			<Fragment>
				<div className="checkoutOrder__header">
					<div className="checkoutOrder__headerIcon">
						<Icon icon="accept" />
					</div>
					<div className="checkoutOrder__title">
						Thank you
						{this.props.userFirstName ? `, ${this.props.userFirstName}` : ''}
					</div>
				</div>
				<div className="grid">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="orderModal__title">ORDER #{this.props.order.number}</h1>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<OrderInfo status={this.props.order.paymentStatus} updatedAt={this.props.order.paymentStatusUpdatedAt} />
						</div>

						<div className="col-xs-12 col-sm-6">
							<OrderDetails games={this.getGames()} taxes={[]} type="game" total={this.props.order.total} />
							<div className="checkoutOrder__actions">
								<button className="btn btn--main" type="button" onClick={this.props.onGoToGames}>
									View my games
								</button>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	render() {
		const content = this.props.loading ? this.renderLoading() : this.renderContent();
		return (
			<div className="checkout">
				<h1 className="checkout__title">Order confirmation</h1>
				<div className="checkout__content">{content}</div>
			</div>
		);
	}
}

export default Order;
