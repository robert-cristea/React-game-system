import React, { Component as ReactComponent, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import UI from '../../../../app/UI';
import Config from '../../../../app/Config';
import OrderRepository from '../../../../app/Repositories/OrderRepository';
import Component from '../../../../components/screens/routes/settings/Orders';
import OrderModal from '../../../../containers/modals/OrderModal';
import RefundModal from '../../../../containers/modals/RefundModal';

@inject('ui', 'config', 'orderRepository')
@observer
class Orders extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	/**
	 * @type {Order[]}
	 */
	@observable
	orders = [];

	@observable
	orderModalVisible = false;

	@observable
	displayedOrder = null;

	@observable
	refundModalVisible = false;

	@observable
	refundOrderId = null;

	@observable
	refundItems = null;

	@observable
	pagination = {};

	/**
	 * Current display format
	 * @type {'turbotoken'|'game'}
	 */
	@observable
	selectedType = 'turbotoken';

	/**
	 * True when loading the orders
	 * @type {boolean}
	 */
	@observable
	loading = false;

	componentWillMount() {
		this.didMount = false;

		this.loadOrders();
		this.updateOrderModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateOrderModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	loadOrders(page, pageSize) {
		this.loading = true;

		/** @type {OrderRepository} */
		const repo = this.props.orderRepository;
		const attributes = this.props.config.get('orderAttributes.history');

		repo
			.loadPage(attributes, page, pageSize, this.selectedType)
			.then(result => {
				this.orders = result.orders;
				this.pagination = result.pagination;
				this.loading = false;
			})
			.catch(e => Promise.reject(e));
	}

	handleUpdatePagination = (page, pageSize) => {
		const config = merge(this.pagination, { page, pageSize });
		this.loadOrders(config.page, config.pageSize);
	};

	handleChangeType = type => {
		if (type !== this.selectedType) {
			this.selectedType = type;
			this.loadOrders();
		}
	};

	updateOrderModal(props = this.props) {
		const orderId = props.match.params.order;

		if (orderId) {
			this.displayedOrder = orderId;
			this.openOrderModal();
		} else {
			this.closeOrderModal();
		}
	}

	handleOrderClick = order => {
		this.props.ui.router.goTo(`/dashboard/orders/${order.id}`);
	};

	handleOrderModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/orders');
	};

	closeOrderModal = () => {
		this.orderModalVisible = false;
	};

	openOrderModal = () => {
		this.orderModalVisible = true;
	};

	renderOrderModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		if (!this.displayedOrder) {
			return null;
		}

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		return (
			<OrderModal
				isOpen={this.orderModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleOrderModalClose}
				orderId={this.displayedOrder}
				onBack={this.handleOrderModalClose}
				onRefund={this.handleRefund}
			/>
		);
	}

	handleRefund = (orderId, items) => {
		this.refundOrderId = orderId;
		this.refundItems = items;

		this.openRefundModal();
	};

	openRefundModal = () => {
		this.refundModalVisible = true;
	};

	closeRefundModal = () => {
		this.refundModalVisible = false;
	};

	renderRefundModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		if (!this.refundOrderId || !this.refundItems.length) {
			return null;
		}

		const modalLocation = this.props.ui.getModalLocation('dashboard-1');

		if (!modalLocation) {
			return null;
		}

		return (
			<RefundModal
				isOpen={this.refundModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.closeRefundModal}
				orderId={this.refundOrderId}
				items={this.refundItems}
				onBack={this.closeRefundModal}
			/>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					loading={this.loading}
					selectedType={this.selectedType}
					onChangeType={this.handleChangeType}
					orders={this.orders}
					pagination={this.pagination}
					onOrderClick={this.handleOrderClick}
					onUpdatePagination={this.handleUpdatePagination}
				/>
				{this.renderOrderModal()}
				{this.renderRefundModal()}
			</Fragment>
		);
	}
}

// Injected props
Orders.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	orderRepository: PropTypes.instanceOf(OrderRepository).isRequired,
};

export default Orders;
