import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Icon from '../icons/Icon';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';
import GameItem from '../../app/CartItem/GameItem';
import Loading from '../Loading';
import { formatToken } from '../../app/utils';

class Item extends Component {
	static propTypes = {
		item: PropTypes.instanceOf(AbstractCartItem).isRequired,
		loading: PropTypes.bool,
		showRemove: PropTypes.bool,
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		showRemove: false,
		onRemove: null,
	};

	renderCover(game) {
		const cover = get(game, 'shopDetails.covers', [])[0];

		return cover ? (
			<div className="cartItem__image">
				<img src={cover.thumbSmall} alt={cover.title} />
			</div>
		) : null;
	}

	renderPrice(game) {
		const { onSale, price, salePrice } = game;

		return onSale ? (
			<Fragment>
				<span className="cartItem__price-tokens--sale">{formatToken(price)}</span>
				<span>{formatToken(salePrice)}</span>
			</Fragment>
		) : (
			<span>{formatToken(price)}</span>
		);
	}

	renderGameItem() {
		/** @type {Game} */
		const { game } = this.props.item;
		return (
			<div className="cartItem__wrap cartItem--game">
				{this.renderCover(game)}
				<div className="cartItem__info">
					<div className="cartItem__title">{game.name}</div>
					<div className="cartItem__publisher">{get(game, 'studio.name')}</div>
					<div className="cartItem__price">
						<Icon icon="logo" />
						<div className="cartItem__price-tokens">{this.renderPrice(game)}</div>
					</div>
				</div>
				{this.renderRemoveButton()}
			</div>
		);
	}

	renderTokensItem() {
		const { quantity } = this.props.item;

		return (
			<div className="cartItem__wrap cartItem--token">
				<div className="cartItem__icon">
					<Icon icon="logo" />
				</div>
				<div className="cartItem__info">
					<div className="cartItem__tokens">{`${formatToken(quantity)} Tokens`}</div>
				</div>
				{this.renderRemoveButton()}
			</div>
		);
	}

	renderItem() {
		if (this.props.item.type === GameItem.TYPE) {
			return this.renderGameItem();
		}

		return this.renderTokensItem();
	}

	renderRemoveButton() {
		return (
			this.props.showRemove && (
				<button className="btn btn--transparent cartItem__remove" onClick={this.props.onRemove}>
					<Icon icon="cancel" />
				</button>
			)
		);
	}

	renderLoading() {
		return <Loading />;
	}

	render() {
		return (
			<div className="cartItem">
				{this.props.loading ? (
					<div className="cartItem__loading">
						<Loading />
					</div>
				) : (
					this.renderItem()
				)}
			</div>
		);
	}
}

export default Item;
