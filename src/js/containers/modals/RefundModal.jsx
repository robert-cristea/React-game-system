import React, { Component as ReactComponent } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import omit from 'lodash/omit';
import Config from '../../app/Config';
import Authentication from '../../app/Authentication';
import OrderRepository from '../../app/Repositories/OrderRepository';
import Component from '../../components/modals/RefundModal';
import Icon from '../../components/icons/Icon';

@inject('auth', 'config', 'orderRepository')
@observer
class RefundModal extends ReactComponent {
	static propTypes = {
		orderId: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		items: [],
	};

	/**
	 * True when refunding the game
	 * @type {boolean}
	 */
	@observable
	loading = false;

	handleRefundOrder = () => {
		this.loading = true;

		/** @type {OrderRepository} */
		const repo = this.props.orderRepository;
		const attributes = this.props.config.get('orderAttributes.details');
		const orderId = this.props.orderId;
		const items = this.props.items;

		if (orderId && items.length) {
			repo
				.refund(orderId, [...items], attributes)
				.then(() => {
					const userAttributes = this.props.config.get('auth.user.baseAttributes');
					this.props.auth.reload(userAttributes);

					this.loading = false;

					if (this.props.onRequestClose) {
						this.props.onRequestClose();
					}
				})
				.catch(e => Promise.reject(e));
		}
	};

	render() {
		const modalClassName = 'infoModal';

		const modalProps = {
			...omit(this.props, ['gameId']),
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
					<Component loading={this.loading} onClose={this.props.onRequestClose} onRefund={this.handleRefundOrder} />
				</div>
			</ReactModal>
		);
	}
}

// Injected props
RefundModal.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	orderRepository: PropTypes.instanceOf(OrderRepository).isRequired,
};

export default RefundModal;
