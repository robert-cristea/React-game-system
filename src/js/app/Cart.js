import { observable } from 'mobx';
import BigNumber from 'bignumber.js';
/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import GameItem from './CartItem/GameItem';
import TokenItem from './CartItem/TokenItem';

class Cart {
	/**
	 * @type {ObservableArray<AbstractCartItem>}
	 */
	@observable
	items = [];

	/**
	 * True if the items were loaded from the server.
	 * @type {boolean}
	 */
	loaded = false;

	/**
	 * Load items from the server. Game objects are filled with the specified gameAttributes. If the
	 * items are already loaded, they are returned (unless the games are missing attributes, the
	 * server will not be called). Returns a promise that resolves once items were loaded.
	 *
	 * @param {string[]} gameAttributes
	 * @param {boolean} forceReload
	 * @return {Promise}
	 */
	load(gameAttributes, forceReload = false) {
		if (this.loaded && !forceReload) {
			return this.fillGames(gameAttributes);
		}

		this.loaded = false;

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getCart(gameAttributes).then(data => {
			this.loaded = true;
			this.replace(data);
		});
	}

	/**
	 * Fills all game of game items with the specified attributes. Returns a promise that resolves
	 * when all games are filled.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise}
	 */
	fillGames(gameAttributes) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		const games = [];
		this.items.forEach(item => {
			if (item instanceof GameItem) {
				games.push(item.game);
			}
		});

		return repo.fill(games, gameAttributes);
	}

	/**
	 * Replaces the content of the cart with the serialized data.
	 * @param {object} data
	 */
	replace(data) {
		const newItems = data.items.map(itemData => Cart.createItem(itemData));
		this.items.replace(newItems);
	}

	/**
	 * Returns true if the loaded items contain the specified item.
	 * @param {AbstractCartItem} newItem
	 */
	hasItem(newItem) {
		if (newItem.type === GameItem.TYPE) {
			return this.items.reduce((hasItem, item) => hasItem || item.game.id === newItem.game.id, false);
		}
		return false;
	}

	/**
	 * Adds an item to the cart. The item is immediately added to `this.items` and then the item is
	 * added on the server. In case of server error, the item is removed from `this.items`. Returns
	 * a promise that resolves when the item is successfully added to the server.
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise}
	 */
	addItem(item) {
		if (this.hasItem(item)) {
			return Promise.resolve();
		}

		this.items.push(item);

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server
			.addCartItem(item)
			.then(data => {
				// We update the id of the item
				item.id = data.id;
			})
			.catch(e => {
				this.items.remove(item);
				return Promise.reject(e);
			});
	}

	/**
	 * Removes an item from the cart. The item is immediately removed from `this.items` and then the
	 * item is removed on the server. In case of server error, the item is re-added to `this.items`.
	 * Returns a promise that resolves when the item is successfully removed on the server.
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise}
	 */
	removeItem(item) {
		if (!this.hasItem(item)) {
			return Promise.resolve();
		}

		this.items.remove(item);

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.removeCartItem(item).catch(e => {
			this.items.push(item);
			return Promise.reject(e);
		});
	}

	/**
	 * Remove all items from the cart. Does not call the server.
	 */
	clearItems() {
		this.items.clear();
	}

	/**
	 * Makes the server buy all items in the cart with the user's token balance. On success, empties the cart. Returns
	 * a promise that resolves with the returned Order and the new user's balance.
	 *
	 * @return {Promise<{ order: Order, tokenBalance: {BigNumber} }>}
	 */
	buy() {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.buyCartItems().then(data => {
			this.clearItems();
			return data;
		});
	}

	/**
	 * Returns the observable `items` array. Will be empty until the items are loaded.
	 *
	 * @return {ObservableArray<AbstractCartItem>}
	 */
	getItems() {
		return this.items;
	}

	/**
	 * Returns the total as a BigNumber
	 * @return {BigNumber}
	 */
	getTotal() {
		return this.items.reduce((prev, item) => prev.plus(item.getPrice()), new BigNumber(0));
	}

	/**
	 * Returns true if the cart has at least one cart item
	 * @return {boolean}
	 */
	hasTokenItem() {
		return this.items.find(item => item.type === TokenItem.TYPE) !== undefined;
	}

	/**
	 * Creates and returns a new AbstractCartItem instance from the data object. Returns the correct
	 * instance (GameItem or TokenItem).
	 *
	 * @param {object} data
	 * @return {AbstractCartItem}
	 */
	static createItem(data) {
		// const item = data.type === GameItem.TYPE ? new GameItem() : new TokenItem();
		// TODO: Add item type validation
		const item = new GameItem();
		item.update(data);
		return item;
	}
}

export default Cart;
