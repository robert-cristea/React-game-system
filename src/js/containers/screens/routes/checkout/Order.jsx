import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import OrderRepository from '../../../../app/Repositories/OrderRepository';
import Config from '../../../../app/Config';
import UI from '../../../../app/UI';
import ToastManager from '../../../../app/ToastManager';
import Component from '../../../../components/screens/routes/checkout/Order';
import Authentication from '../../../../app/Authentication';

@inject('ui', 'auth', 'config', 'toast', 'orderRepository')
@observer
class Order extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};

	static defaultProps = {};

	@observable
	loading = false;

	/**
	 * @type {Order}
	 */
	@observable
	order;

	/**
	 * @type {User}
	 */
	@observable
	user;

	componentDidMount() {
		this.user = this.props.auth.getUser();
		this.load();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.order !== this.props.match.params.order) {
			this.reloadOrder();
		}
	}

	get userFirstName() {
		return this.user ? this.user.firstName : null;
	}

	load() {
		this.loading = true;

		this.user
			.fill(['id', 'firstName'])
			.then(() => this.loadOrder())
			.finally(() => {
				this.loading = false;
			});
	}

	reloadOrder() {
		this.loading = true;
		this.loadOrder().finally(() => {
			this.loading = false;
		});
	}

	loadOrder() {
		const orderId = this.props.match.params.order;

		if (!orderId) {
			this.props.ui.router.goTo('/dashboard/checkout/index');
			return Promise.resolve();
		}

		/** @type {OrderRepository} */
		const repo = this.props.orderRepository;
		const attributes = this.props.config.get('orderAttributes.details');
		return repo
			.load(orderId, attributes)
			.then(order => {
				if (order === null) {
					this.props.toast.error('Could not find this order');
					this.props.ui.router.goTo('/dashboard/checkout/index');
					return;
				}
				this.order = order;
			})
			.catch(e => {
				this.props.toast.error('Could not load the order');
				this.props.ui.router.goTo('/dashboard/checkout/index');
				return Promise.reject(e);
			});
	}

	handleGoToGames = () => {
		this.props.ui.router.goTo('/dashboard/games/index');
	};

	render() {
		return (
			<Component
				loading={this.loading}
				order={this.order}
				userFirstName={this.userFirstName}
				onGoToGames={this.handleGoToGames}
			/>
		);
	}
}

Order.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	orderRepository: PropTypes.instanceOf(OrderRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Order;
