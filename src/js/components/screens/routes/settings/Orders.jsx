import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import Order from '../../../../app/ECommerce/Order';
import Loading from '../../../Loading';
import ListFilters from '../../../listFilters/ListFilters';
import ListFilter from '../../../listFilters/ListFilter';
import OrderItem from '../../../orders/OrderItem';
import OrdersPagination from '../../../orders/OrdersPagination';

@observer
class Orders extends Component {
	static propTypes = {
		orders: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(Order)),
		selectedType: PropTypes.string.isRequired,
		loading: PropTypes.bool,
		pagination: PropTypes.object,
		onOrderClick: PropTypes.func,
		onChangeType: PropTypes.func,
		onUpdatePagination: PropTypes.func,
	};

	static defaultProps = {
		orders: [],
		loading: false,
		pagination: {},
		onOrderClick: null,
		onChangeType: null,
		onUpdatePagination: null,
	};

	handleOrderClick = order => () => {
		if (this.props.onOrderClick) {
			this.props.onOrderClick(order);
		}
	};

	handleTypeClick = type => {
		if (this.props.onChangeType) {
			this.props.onChangeType(type);
		}
	};

	renderOrder(order) {
		return <OrderItem key={order.id} order={order} onClick={this.handleOrderClick(order)} />;
	}

	renderList() {
		const orders = this.props.orders.map(order => this.renderOrder(order));

		return (
			<table className="orders__table">
				<thead>
					<tr className="orders__table-row">
						<th className="orders__table-title orders__table-cell">ORDER</th>
						<th className="orders__table-title orders__table-cell">DATE</th>
						<th className="orders__table-title orders__table-cell">DETAIL</th>
						<th className="orders__table-title orders__table-cell">TOTAL</th>
						<th className="orders__table-title orders__table-cell orders__table-title--centered">ACTIONS</th>
					</tr>
				</thead>

				<tbody>{orders}</tbody>
			</table>
		);
	}

	renderHeader() {
		return (
			<div className="orders__header">
				<h1 className="orders__title">PURCHASE HISTORY</h1>
			</div>
		);
	}

	renderLoading() {
		return (
			<div className="orders__loading">
				<Loading />
			</div>
		);
	}

	render() {
		let content;

		if (this.props.loading) {
			content = this.renderLoading();
		} else {
			content = this.renderList();
		}

		return (
			<div className="orders">
				{this.renderHeader()}
				<div className="orders__content">
					<div className="orders__sub-header">
						<h1 className="orders__sub-title">MY ORDERS</h1>

						<ListFilters>
							<ListFilter
								label="Turbotokens"
								onClick={() => this.handleTypeClick('turbotoken')}
								active={this.props.selectedType === 'turbotoken'}
							/>
							<ListFilter
								label="Games"
								onClick={() => this.handleTypeClick('game')}
								active={this.props.selectedType === 'game'}
							/>
						</ListFilters>
					</div>

					<div className="orders__content-wrap">{content}</div>

					<div className="orders__sub-footer">
						<OrdersPagination pagination={this.props.pagination} onUpdatePagination={this.props.onUpdatePagination} />
					</div>
				</div>
			</div>
		);
	}
}

export default Orders;
