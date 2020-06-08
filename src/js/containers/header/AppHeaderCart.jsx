import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import AppHeaderItem from '../../components/header/AppHeaderItem';
import Dropdown from '../../components/Dropdown';
import Cart from '../cart/Cart';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';

@inject('auth', 'config')
@observer
class AppHeaderCart extends Component {
	static propTypes = {
		onClick: PropTypes.func,
	};
	static defaultProps = {
		onClick: null,
	};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadCart();
	}

	loadCart() {
		const attributes = this.props.config.get('gameAttributes.cart');
		this.user.getCart().load(attributes);
	}

	render() {
		return (
			<div className="appHeader__item appHeader__item--static">
				<Dropdown
					position="right"
					handlers={{
						show: 'cartShow',
						hide: 'cartHide',
					}}
					button={
						<AppHeaderItem
							onClick={this.props.onClick}
							itemsCount={this.user.getCart().getItems().length}
							icon="cart"
						/>
					}
				>
					<Cart />
				</Dropdown>
			</div>
		);
	}
}

// Injected props
AppHeaderCart.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default AppHeaderCart;
