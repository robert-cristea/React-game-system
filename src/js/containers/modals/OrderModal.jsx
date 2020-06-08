import React, { Component as ReactComponent } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import omit from 'lodash/omit';
import Config from '../../app/Config';
import OrderRepository from '../../app/Repositories/OrderRepository';
import Component from '../../components/modals/OrderModal';
import UI from '../../app/UI';
import Icon from '../../components/icons/Icon';
import ToastManager from '../../app/ToastManager';

@inject('ui', 'config', 'orderRepository', 'toast')
@observer
class OrderModal extends ReactComponent {
	static propTypes = {
		orderId: PropTypes.number.isRequired,
		onRefund: PropTypes.func,
	};

	static defaultProps = {
		onRefund: null,
	};

	/**
	 * @type {Order}
	 */
	@observable
	order = null;

	/**
	 * True when loading the orders
	 * @type {boolean}
	 */
	@observable
	loading = false;

	componentDidMount() {
		this.loadOrder();
	}

	componentDidUpdate(prevProps) {
		if (this.props.orderId !== prevProps.orderId) {
			this.loadOrder();
		}
	}

	loadOrder = () => {
		this.loading = true;

		/** @type {OrderRepository} */
		const repo = this.props.orderRepository;
		const attributes = this.props.config.get('orderAttributes.details');
		const orderId = this.props.orderId;

		if (orderId) {
			repo
				.load(orderId, attributes)
				.then(order => {
					if (!order) {
						this.props.toast.error('Could not find an order with this id');
						this.props.ui.router.goTo('/dashboard/orders');
					}
					this.order = order;
				})
				.catch(e => {
					this.props.toast.error('Could not load this order');
					this.props.ui.router.goTo('/dashboard/orders');
					return Promise.reject(e);
				})
				.finally(() => {
					this.loading = false;
				});
		}
	};

	render() {
		const modalClassName = 'infoModal orderModal';

		const modalProps = {
			...omit(this.props, ['orderId']),
			ariaHideApp: false,
			portalClassName: `modal ${modalClassName}__modal`,
			overlayClassName: `modal__overlay ${modalClassName}__overlay`,
			className: `modal__content ${modalClassName}__content`,
			closeTimeoutMS: 300,
		};

		return (
			<ReactModal {...modalProps}>
				<div className={modalClassName}>
					<button
						className={`${modalClassName}__close btn btn--transparent`}
						onClick={this.props.onRequestClose}
						type="button"
					>
						<Icon icon="cancel" />
					</button>
					<Component loading={this.loading} order={this.order} onRefund={this.props.onRefund} />
				</div>
			</ReactModal>
		);
	}
}

// Injected props
OrderModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	orderRepository: PropTypes.instanceOf(OrderRepository).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default OrderModal;
