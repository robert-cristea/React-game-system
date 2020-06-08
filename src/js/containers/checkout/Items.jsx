import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js';
import Component from '../../components/checkout/Items';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';
import ToastManager from '../../app/ToastManager';
import UI from '../../app/UI';

@inject('ui', 'auth', 'config', 'toast')
@observer
class Items extends ReactComponent {
	static propTypes = {
		buying: PropTypes.bool,
	};

	static defaultProps = {
		buying: false,
	};

	@observable
	loading = false;

	@observable
	mounted = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentDidMount() {
		this.user = this.props.auth.getUser();
		this.loadItems();
		this.mounted = true;
	}

	@computed
	get items() {
		if (!this.mounted) {
			return [];
		}

		return this.getCart().getItems();
	}

	@computed
	get total() {
		if (!this.mounted) {
			return new BigNumber(0);
		}

		return this.getCart().getTotal();
	}

	/**
	 * @return {Cart}
	 */
	getCart() {
		return this.user.getCart();
	}

	loadItems() {
		this.loading = true;
		const gameAttributes = this.props.config.get('gameAttributes.cart');
		this.getCart()
			.load(gameAttributes)
			.catch(e => {
				this.props.toast.error('Could not load your cart items');
				return Promise.reject(e);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	handleRemoveItem = item => {
		if (this.props.buying) {
			return;
		}

		this.getCart()
			.removeItem(item)
			.catch(e => {
				this.props.toast.error('Could not remove this cart item');
				return Promise.reject(e);
			});
	};

	handleGoToStore = () => {
		this.props.ui.router.goTo('/dashboard/shop/index');
	};

	render() {
		return (
			<Component
				loading={this.loading}
				items={this.items}
				total={this.total}
				onRemoveItem={this.handleRemoveItem}
				onGoToStore={this.handleGoToStore}
			/>
		);
	}
}

Items.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Items;
