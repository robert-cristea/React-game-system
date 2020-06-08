import merge from 'lodash/merge';
import BigNumber from 'bignumber.js';
import has from 'lodash/has';
import set from 'lodash/set';
import get from 'lodash/get';
import IoC from '@aedart/js-ioc/index';
import { hasAllProperties } from './utils';

/**
 * @property {string} name
 * @property {BigNumber} price
 * @property {{numerator: number, denominator: number, populationSize: number}} rating
 */
class Game {
	/**
	 * Update the attributes of this Game with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, data);

		// Set prices as BigNumber
		const priceAttributes = ['price', 'shopDetails.price', 'shopDetails.specialPrice'];
		priceAttributes.forEach(priceAttr => {
			if (has(data, priceAttr)) {
				const price = new BigNumber(get(data, priceAttr));
				set(this, priceAttr, price);
			}
		});
	}

	/**
	 * Fills this game with the specified attributes. If the game doesn't have all the attributes,
	 * the server will be queried for them. Returns a promise that resolves when the game has the
	 * attributes filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise}
	 */
	fill(attributes) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		return repo.fill([this], attributes);
	}

	/**
	 * Returns true if this game has all the specified `attributes`.
	 * @param {string[]} attributes
	 * @return {boolean}
	 */
	hasAttributes(attributes) {
		return hasAllProperties(this, attributes);
	}
}

export default Game;
