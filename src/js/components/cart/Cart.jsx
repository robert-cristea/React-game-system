import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import Item from '../../containers/cart/Item';
import TokensBalance from '../../containers/TokensBalance';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';
import Loading from '../Loading';
import Icon from '../icons/Icon';
import { formatToken, formatCurrency } from '../../app/utils';

@observer
class Cart extends Component {
	static propTypes = {
		items: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(AbstractCartItem)),
		total: PropTypes.instanceOf(BigNumber),
		loading: PropTypes.bool,
		callback: PropTypes.func,
		onItemRemove: PropTypes.func,
	};

	static defaultProps = {
		items: [],
		total: 0,
		loading: false,
		callback: null,
		onItemRemove: null,
	};

	handleButtonClick = () => {
		if (this.props.callback) {
			this.props.callback();
		}
	};

	handleRemove = item => {
		if (this.props.onItemRemove && item) {
			this.props.onItemRemove(item);
		}
	};

	renderEmpty() {
		return <div className="cart__empty">Your cart is empty.</div>;
	}

	renderContent() {
		return (
			<Fragment>
				<TokensBalance showAdd />

				<div className="cart__items">
					{this.props.items.map(item => (
						<Item key={item.ref} item={item} onRemove={() => this.handleRemove(item)} showRemove />
					))}
				</div>

				<div className="cart__total">
					<span className="cart__total-text">TOTAL</span>
					<Icon icon="logo" />
					<div className="cart__amount">
						<div className="cart__amount-tokens">{formatToken(this.props.total)}</div>
						<div className="cart__amount-currency">{formatCurrency(this.props.total)}</div>
					</div>
				</div>

				{this.renderButton()}
			</Fragment>
		);
	}

	renderButton() {
		return (
			<div className="cart__cta">
				<button className="btn btn--main btn--wide cart__button" onClick={this.handleButtonClick}>
					Checkout
				</button>
			</div>
		);
	}

	render() {
		return (
			<div className="cart">
				{this.props.loading ? (
					<div className="cart__loading">
						<Loading />
					</div>
				) : (
					<Fragment>{this.props.items.length ? this.renderContent() : this.renderEmpty()}</Fragment>
				)}
			</div>
		);
	}
}

export default Cart;
