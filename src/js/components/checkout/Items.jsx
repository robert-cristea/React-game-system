import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import BigNumber from 'bignumber.js';
import { get } from 'lodash';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';
import Icon from '../icons/Icon';
import Loading from '../Loading';
import OrderDetails from '../orders/OrderDetails';

@observer
class Items extends ReactComponent {
	static propTypes = {
		loading: PropTypes.bool,
		items: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(AbstractCartItem)),
		total: PropTypes.instanceOf(BigNumber),
		onRemoveItem: PropTypes.func,
		onGoToStore: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		items: [],
		total: new BigNumber(0),
		onRemoveItem: null,
		onGoToStore: null,
	};

	handleRemoveItem = item => () => {
		if (this.props.onRemoveItem) {
			this.props.onRemoveItem(item);
		}
	};

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return (
			<div className="checkout__loading">
				<Loading />
			</div>
		);
	}

	renderItems() {
		if (this.props.loading || !this.props.items.length) {
			return null;
		}

		const games = this.props.items.map(item => ({
			name: item.game.name,
			qty: 1,
			price: item.getPrice(),
			cover: get(item.game, 'shopDetails.covers.0.thumbSmall'),
			callback: this.handleRemoveItem(item),
		}));

		return (
			<div>
				<OrderDetails
					type="game"
					total={this.props.total}
					taxes={[
						{ label: '12.2% Federal Sales Tax', value: new BigNumber(3.09) },
						{ label: '5.2% Alabama State Tax', value: new BigNumber(0.19) },
					]}
					games={games}
					action={{ label: 'Remove', icon: 'remove' }}
					totalPriceSize="large"
				/>
			</div>
		);
	}

	renderEmpty() {
		if (this.props.loading || this.props.items.length) {
			return null;
		}

		return (
			<div className="checkout__emptyItems">
				<p>Your cart is empty.</p>
				<button onClick={this.props.onGoToStore} className="btn btn--main" type="button">
					Go back to the store
				</button>
			</div>
		);
	}

	render() {
		return (
			<div className="checkout__items">
				<div className="checkout__sectionHeader">
					<h2 className="checkout__sectionTitle">
						<Icon icon="cartEmpty" />
						Cart
					</h2>
				</div>
				{this.renderLoading()}
				{this.renderEmpty()}
				{this.renderItems()}
			</div>
		);
	}
}

export default Items;
