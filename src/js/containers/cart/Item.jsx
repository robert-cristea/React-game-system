import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import ItemComponent from '../../components/cart/Item';
import GameItem from '../../app/CartItem/GameItem';
import Config from '../../app/Config';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';

@inject('config')
@observer
class Item extends Component {
	static propTypes = {
		item: PropTypes.instanceOf(AbstractCartItem).isRequired,
	};
	static defaultProps = {};

	@observable
	loading = false;

	componentWillMount() {
		this.loadItem(this.props.item);
	}

	componentWillReceiveProps(newProps) {
		if (this.props.item !== newProps.item) {
			this.loadItem(newProps.item);
		}
	}

	loadItem(item) {
		this.loading = true;

		if (item.type === GameItem.TYPE) {
			const attributes = this.props.config.get('gameAttributes.cart');
			this.loading = true;

			item.game.fill(attributes).then(() => {
				this.loading = false;
			});
		}
	}

	render() {
		return <ItemComponent loading={this.loading} {...this.props} />;
	}
}

// Injected props
Item.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Item;
