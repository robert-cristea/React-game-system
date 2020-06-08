import BigNumber from 'bignumber.js';
import AbstractCartItem from './AbstractCartItem';

/**
 * @property {'token'} type
 * @property {BigNumber} quantity
 */
class TokenItem extends AbstractCartItem {
	static TYPE = 'token';

	type = TokenItem.TYPE;

	/**
	 * @inheritDoc
	 */
	update(data) {
		super.update(data);
		if (data.quantity) {
			this.quantity = new BigNumber(data.quantity);
		}
	}

	/**
	 * @inheritDoc
	 */
	serialize() {
		const serialized = AbstractCartItem.prototype.serialize.call(this);
		serialized.quantity = this.quantity.toString();
		return serialized;
	}

	/**
	 * @inheritDoc
	 */
	getPrice() {
		return this.quantity;
	}
}

export default TokenItem;
