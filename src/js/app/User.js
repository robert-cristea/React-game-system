/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { hasAllProperties, normalizeString } from './utils';
import UserGame from './UserGame';
import Cart from './Cart';

/**
 * @property {string} id
 * @property {string} name
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} username
 * @property {object} avatar
 * @property {string} avatar.url
 * @property {string} ethereumAddress
 * @property {object} status
 * @property {string} status.code
 * @property {string} status.displayText
 */
class User {
	/**
	 * This user's friends.
	 * @type {ObservableArray<User>}
	 */
	@observable
	friends = [];

	/**
	 * This user's UserGame.
	 * @type {ObservableArray<UserGame>}
	 */
	@observable
	userGames = [];

	@observable
	tokenBalance = new BigNumber(0);

	/**
	 * @type {ObservableArray<PaymentMethod>}
	 */
	@observable
	paymentMethods = [];

	// TMP: E3DEMO
	/**
	 * Temporarily for demo only, to circumvent a problem where it could take 10 minutes before a game is added to the userGames list
	 * @type {Array}
	 */
	mockGames = [];
	// END TMP

	/**
	 * True if this user's friends were loaded, else false.
	 * @type {boolean}
	 */
	friendsLoaded = false;

	/**
	 * True if this user's "user games" were loaded, else false.
	 * @type {boolean}
	 */
	userGamesLoaded = false;

	/**
	 * True if this user's payment methods were loaded, else false.
	 * @type {boolean}
	 */
	paymentMethodsLoaded = false;

	/**
	 * The user's cart
	 * @type {Cart}
	 */
	cart;

	/**
	 * Update the attributes of this User with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, omit(data, ['tokenBalance']));
		// Convert the tokenBalance to a number
		if (data.tokenBalance) {
			this.tokenBalance = new BigNumber(data.tokenBalance, 10);
		}
	}

	/**
	 * Fills this user with the specified attributes. If the user doesn't have all the attributes,
	 * the server will be queried for them. Returns a promise that resolves when the user has the
	 * attributes filled.
	 *
	 * Do not forget to also pass the `id` in attributes, else the UserRepository won't know which user object to update
	 *
	 * @param {string[]} attributes
	 * @param {boolean} forceReload
	 * @return {Promise}
	 */
	fill(attributes, forceReload = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.fill([this], attributes, forceReload);
	}

	/**
	 * Returns true if this user has all the specified `attributes`.
	 * @param {string[]} attributes
	 * @return {boolean}
	 */
	hasAttributes(attributes) {
		return hasAllProperties(this, attributes);
	}

	/**
	 * Loads this user's friends from the server and stores them in the `this.friends` array.
	 * Returns a promise that resolves with the list (so resolves with `this.friends`). The user
	 * objects will be filled with the specified `attributes`. If the list of friends is already
	 * loaded, it will be returned unless `forceReload` is true.
	 *
	 * @param {string[]} attributes
	 * @param {boolean} forceReload
	 * @return {Promise<User[]>}
	 */
	loadFriends(attributes, forceReload = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');

		if (this.friendsLoaded && !forceReload) {
			return repo.fill(this.friends, attributes);
		}

		this.friendsLoaded = false;

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getFriends(attributes).then(data => {
			this.friendsLoaded = true;
			this.friends.replace(repo.update(data));
			return this.friends;
		});
	}

	/**
	 * Loads this user's "user games" from the server and stores them in the `this.userGames` array.
	 * Returns a promise that resolves with the list (so resolves with `this.userGames`). The game
	 * objects will be filled with the specified `gameAttributes`. If the list of user games is already
	 * loaded, it will be returned unless `forceReload` is true.
	 *
	 * @param {string[]} gameAttributes
	 * @param {boolean} forceReload
	 * @return {Promise<UserGame[]>}
	 */
	loadUserGames(gameAttributes, forceReload = false) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		if (this.userGamesLoaded && !forceReload) {
			const games = this.userGames.map(ug => ug.game);
			return repo.fill(games, gameAttributes);
		}

		this.userGamesLoaded = false;
		this.userGames.clear();

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getAllUserGames(gameAttributes).then(data => {
			this.userGamesLoaded = true;
			this.replaceUserGames(data);
			return this.userGames;
		});
	}

	/**
	 * Loads the user's payment methods. Will fill the `paymentMethods` array with `PaymentMethod` instances. Returns a
	 * promise that resolves with an array of the payment methods once the loading finished (same as
	 * `this.paymentMethods).
	 *
	 * @param {boolean} forceReload
	 * @return {Promise<PaymentMethod[]>}
	 */
	loadPaymentMethods(forceReload = false) {
		if (this.paymentMethodsLoaded && !forceReload) {
			return Promise.resolve(this.paymentMethods);
		}

		this.paymentMethodsLoaded = false;
		this.paymentMethods.clear();

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getPaymentMethods().then(methods => {
			this.paymentMethodsLoaded = true;
			this.paymentMethods.replace(methods);
			return methods;
		});
	}

	/**
	 * Sends friend requests to a user. Returns a promise that resolves when the friend request is
	 * sent.
	 * @param {User} user
	 * @return {Promise}
	 */
	inviteUser(user) {
		/** @type {SentFriendRequestRepository} */
		const repo = IoC.make('sentFriendRequestRepository');
		return repo.invite(user);
	}

	/**
	 * Requests the server to unfriend the specified user. Returns a Promise that resolves once the
	 * friendship is deleted on the server.
	 *
	 * @param {User} user
	 * @return {Promise}
	 */
	unfriend(user) {
		const hasFriendLoaded = this.hasFriend(user);
		this.removeFriends(user);

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.unfriend(user).catch(e => {
			// In case of error, we re-add the friend
			if (hasFriendLoaded) {
				this.addFriends(user);
			}
			return Promise.reject(e);
		});
	}

	/**
	 * Sends `amount` tokens to `toUser`. Will update the current tokenBalance from the server.
	 * Returns a Promise that resolves once the transfer is successful.
	 *
	 * @param {BigNumber} amount
	 * @param {User} toUser
	 * @return {Promise}
	 */
	sendTokens(amount, toUser) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.sendTokens(amount, toUser).then(newBalance => {
			this.tokenBalance = newBalance;
			return newBalance;
		});
	}

	/**
	 * Purchases new tokens for this user with the specified payment method. If successful, updates current user's token
	 * balance. Returns the Order returned by the server.
	 *
	 * @param {PaymentMethod} paymentMethod
	 * @param {BigNumber} amount
	 * @return {Promise<Order>}
	 */
	purchaseTokens(paymentMethod, amount) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.purchaseTokens(paymentMethod, amount).then(({ order, tokenBalance }) => {
			this.tokenBalance = tokenBalance;
			return order;
		});
	}

	/**
	 * Creates UserGame instances from the serialized objects array and replaces all elements in
	 * `this.userGames` with them.
	 *
	 * @param {object[]} data
	 */
	replaceUserGames(data) {
		// TMP: E3DEMO
		const realGameIds = [];
		// end TMP
		const newUserGames = data.map(userGameData => {
			const userGame = new UserGame();
			userGame.update(userGameData);
			// TMP: E3DEMO
			realGameIds.push(userGame.game.id);
			// end TMP
			return userGame;
		});
		// TMP: E3DEMO
		// Temporarily, we merge mockGames in the userGames
		this.mockGames.forEach((mockGame, index) => {
			if (realGameIds.indexOf(mockGame.id) === -1) {
				const userGame = new UserGame();
				userGame.id = `mockUserGame_${index}`;
				userGame.game = mockGame;
				newUserGames.push(userGame);
			}
		});
		// End TMP
		this.userGames.replace(newUserGames);
	}

	/**
	 * Adds a friend or a list of friends to the list of loaded friends. Does not call call the
	 * server. Returns true if `friends` is a single user and it was not already a friend. Else
	 * returns false.
	 *
	 * @param {User|User[]} friends
	 * @return {boolean}
	 */
	addFriends(friends) {
		if (Array.isArray(friends)) {
			friends.forEach(friend => {
				this.addFriends(friend);
			});
			return false;
		}

		if (this.friends.indexOf(friends) === -1) {
			this.friends.push(friends);
			return true;
		}

		return false;
	}

	/**
	 * Removes a friend or a list of friends from the list of loaded friends. Does not call the
	 * server.
	 * @param {User|User[]} friends
	 */
	removeFriends(friends) {
		if (Array.isArray(friends)) {
			friends.forEach(friend => {
				this.removeFriends(friend);
			});
		}

		this.friends.remove(friends);
	}

	/**
	 * Returns a reference to the observable friends list. This array can be used before the friends
	 * list is loaded (will be empty). It is observable and will be filled once we load the user's
	 * friends.
	 *
	 * @return {ObservableArray<User>}
	 */
	getFriends() {
		return this.friends;
	}

	/**
	 * Returns true if the specified user is in the list of already loaded friends. This method does
	 * not loads friends from the server, it only checks in already loaded friends.
	 *
	 * @param {User} user
	 * @return {boolean}
	 */
	hasFriend(user) {
		return this.getFriends().indexOf(user) !== -1;
	}

	/**
	 * @return {Cart}
	 */
	getCart() {
		if (!this.cart) {
			this.cart = new Cart();
		}

		return this.cart;
	}

	/**
	 * Buys the current content of the user's cart. Updates the user's tokenBalance on success. Resolves with the Order
	 * on success.
	 */
	buyCart() {
		return this.getCart()
			.buy()
			.then(({ order, tokenBalance }) => {
				this.tokenBalance = tokenBalance;
				return order;
			});
	}

	/**
	 * Returns true if this user is online
	 * @return {boolean}
	 */
	isOnline() {
		return get(this, 'status.code', 'offline') === 'online';
	}

	/**
	 * Returns true if any of the user's `attributes` matches the search (compare by trimming and comparing lowercase
	 * values). Attributes' value must already be loaded.
	 *
	 * @param {string} search
	 * @param {string[]} attributes
	 * @param {bool} searchIsNormalized If true, the `search` value won't be normalized before comparing
	 * @return {bool}
	 */
	matches(search, attributes = ['username'], searchIsNormalized = false) {
		const normalizedSearch = searchIsNormalized ? search : normalizeString(search);

		for (let i = 0; i < attributes.length; i++) {
			const attributeValue = get(this, attributes[i], false);

			if (attributeValue) {
				const normalizedValue = normalizeString(attributeValue);

				if (normalizedValue.indexOf(normalizedSearch) >= 0) {
					return true;
				}
			}
		}

		return false;
	}
}

export default User;
