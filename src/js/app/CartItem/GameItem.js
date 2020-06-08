/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { get } from 'lodash';
import AbstractCartItem from './AbstractCartItem';

/**
 * @property {'game'} type
 * @property {Game} game
 */
class GameItem extends AbstractCartItem {
	static TYPE = 'game';

	type = GameItem.TYPE;

	constructor(game) {
		super();
		if (game) this.game = game;
	}

	/**
	 * @inheritDoc
	 */
	update(data) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		AbstractCartItem.prototype.update.call(this, data);
		this.game = repo.update(data.game);
	}

	/**
	 * @inheritDoc
	 */
	serialize() {
		const serialized = AbstractCartItem.prototype.serialize.call(this);
		const { onSale, price, salePrice } = this.game;

		serialized.game = {
			id: this.game.id,
			price: (onSale ? salePrice : price).toString(),
		};
		return serialized;
	}

	/**
	 * @inheritDoc
	 */
	getPrice() {
		const { onSale, price, salePrice } = this.game;
		return onSale ? salePrice : price;
	}
}

export default GameItem;
