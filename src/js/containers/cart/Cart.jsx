import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import CartComponent from '../../components/cart/Cart';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';
import UI from '../../app/UI';

@inject('ui', 'auth', 'config')
@observer
class Cart extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadItems();
	}

	loadItems() {
		this.loading = true;
		const gameAttributes = this.props.config.get('gameAttributes.cart');
		this.getCart()
			.load(gameAttributes)
			.then(() => {
				this.loading = false;
			});
	}

	/**
	 * @return {Cart}
	 */
	getCart() {
		return this.user.getCart();
	}

	handleCheckout = () => {
		this.props.ui.router.goTo('/dashboard/checkout/index');
		this.props.ui.call('cartHide');
	};

	handleItemRemove = item => {
		this.getCart().removeItem(item);
	};

	render() {
		return (
			<CartComponent
				items={this.getCart().getItems()}
				total={this.getCart().getTotal()}
				loading={this.loading}
				onItemRemove={this.handleItemRemove}
				callback={this.handleCheckout}
			/>
		);
	}
}

// Injected props
Cart.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Cart;
