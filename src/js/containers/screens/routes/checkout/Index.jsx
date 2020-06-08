import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/checkout/Index';
import Authentication from '../../../../app/Authentication';
import ToastManager from '../../../../app/ToastManager';
import UI from '../../../../app/UI';

@inject('ui', 'auth', 'toast')
@observer
class Index extends ReactComponent {
	@observable
	buying = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentDidMount() {
		this.user = this.props.auth.getUser();
	}

	handleBuy = () => {
		this.buying = true;
		this.user
			.buyCart()
			.then(order => {
				this.props.ui.router.goTo(`/dashboard/checkout/order/${order.id}`);
			})
			.catch(e => {
				this.props.toast.error('Could not buy items in your cart');
				return Promise.reject(e);
			})
			.finally(() => {
				this.buying = false;
			});
	};

	render() {
		return <Component onBuyGames={this.handleBuy} buying={this.buying} />;
	}
}

Index.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default Index;
