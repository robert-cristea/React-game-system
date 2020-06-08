/* eslint-disable no-unused-vars,prefer-rest-params */
/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import chunk from 'lodash/chunk';
import remove from 'lodash/remove';
import BigNumber from 'bignumber.js';
import differenceBy from 'lodash/differenceBy';
import AbstractServer from '../app/Server/AbstractServer';
import ServerError from '../app/Server/ServerError';
import Order from '../app/ECommerce/Order';
import CreditCard from '../app/ECommerce/CreditCard';
import { deepPick } from '../app/utils';

/**
 * Server class that returns hardcoded responses. The class accepts an object describing the
 * hardcoded data.
 */
class MockServer extends AbstractServer {
	data = {};
	/**
	 * Delay, in milliseconds, for each request to resolve
	 * @type {number}
	 */
	delay = 0;
	/**
	 * True if logging is enabled
	 * @type {boolean}
	 */
	loggingEnabled = true;

	/**
	 * True to simulate the user logged in, else false
	 * @type {boolean}
	 */
	loggedIn = false;

	nextId = 0;

	constructor(data) {
		super();
		this.data = data;
	}

	login(username, password) {
		this.info('login', ...arguments);
		this.loggedIn = true;
		return this.resolve(
			{
				token: 'token-here',
			},
			false,
		);
	}

	logout() {
		this.info('logout', ...arguments);
		const res = this.resolve(null, false);
		res.then(() => {
			this.loggedIn = false;
		});
		return res;
	}

	signup(email, password, dateOfBirth) {
		this.info('signup', ...arguments);
		const user = { ...this.data.currentUser };
		user.id = `nu_${this.data.users.length}`;
		user.username = email;
		this.data.users.push(user);

		const res = this.resolve(null, false);
		res.then(() => {
			this.loggedIn = true;
		});
		return res;
	}

	getAuthenticatedUser(attributes) {
		this.info('getAuthenticatedUser', ...arguments);
		const res = this.resolve(this.getObjectAttributes(this.data.currentUser, attributes), false);
		res.then(() => {
			this.loggedIn = true;
		});
		return res;
	}

	getUsers(ids, attributes) {
		this.info('getUsers', ...arguments);
		const found = this.data.users.filter(user => ids.indexOf(user.id) !== -1);
		return this.resolve({
			entries: this.getObjectsAttributes(found, attributes),
		});
	}

	getAllConversations(userAttributes) {
		this.info('getAllConversations', ...arguments);

		// Build the list of conversations with user having only the requested attributes
		const conversations = this.data.conversations.map(conversation => {
			const users = conversation.users.map(user => this.getObjectAttributes(user, userAttributes));
			return {
				events: { entries: [] },
				...conversation,
				users,
			};
		});

		return this.resolve(conversations);
	}

	getConversation(id, userAttributes) {
		this.info('getConversation', ...arguments);
		const found = this.data.conversations.find(c => c.id === id);

		if (found) {
			found.users = this.getObjectsAttributes(found.users, userAttributes);
			return this.resolve(found);
		}

		return this.reject(new ServerError(ServerError.NOT_FOUND));
	}

	deleteConversation(idOrConversation) {
		this.info('deleteConversation', ...arguments);
		// We do not remove it from this.data.conversations, because we don't need to do it for now,
		// but it could be implemented if needed.
		return this.resolve();
	}

	createConversation(users, title, userAttributes) {
		this.info('createConversation', ...arguments);

		const allUsers = [this.data.currentUser].concat(users.slice());

		// Find if a conversation already exists with the specified users
		let conversation = this.data.conversations.find(c => {
			if (c.users.length !== allUsers.length) {
				return false;
			}

			return differenceBy(c.users, allUsers, 'id').length === 0;
		});

		// Else, create a new one
		if (!conversation) {
			conversation = {
				id: `m_c_${this.data.conversations.length + 1}`,
				title: title || null,
				creationDate: Math.round(new Date().getTime() / 1000),
				isFavorite: false,
				events: { entries: [] },
				latestMessage: null,
			};

			this.data.conversations.unshift(conversation);
		}

		conversation.users = this.getObjectsAttributes(allUsers, userAttributes);

		return this.resolve(conversation);
	}

	loadConversationEvents(idOrConversation, cursor, number, userAttributes) {
		this.info('loadConversationEvents', ...arguments);

		// One time out of 4 we return an empty list
		if (Math.random() < 0.25) {
			this.info('No more events to load');
			return this.resolve([]);
		}

		/**
		 * We simply return the same events of the conversation up to `number`
		 */

		let conversation = idOrConversation;

		if (typeof idOrConversation === 'string') {
			conversation = this.data.conversations.find(c => c.id === idOrConversation);
		}

		const events = conversation.getEvents().map(e => ({
			...e.serialize(),
			id: this.generateId(),
			date: Math.round(new Date().getTime() / 1000),
		}));

		return this.resolve(events.slice(0, number));
	}

	getFriends(attributes) {
		this.info('getFriends', ...arguments);
		const friends = this.data.friends.map(friend => this.getObjectAttributes(friend, attributes));
		return this.resolve(friends);
	}

	getReceivedFriendRequests(userAttributes) {
		this.info('getReceivedFriendRequests', ...arguments);
		const requests = this.data.receivedRequests.map(request => ({
			...request,
			user: this.getObjectAttributes(request.user, userAttributes),
		}));
		return this.resolve(requests);
	}

	getSentFriendRequests(userAttributes) {
		this.info('getSentFriendRequests', ...arguments);
		const requests = this.data.sentRequests.map(request => ({
			...request,
			user: this.getObjectAttributes(request.user, userAttributes),
		}));
		return this.resolve(requests);
	}

	cancelSentFriendRequest(request) {
		this.info('cancelSentFriendRequest', ...arguments);
		this.data.sentRequests = this.data.sentRequests.filter(r => r.id !== request.id);
		return this.resolve([]);
	}

	approveFriendRequest(request) {
		this.info('approveFriendRequest', ...arguments);
		this.data.receivedRequests = this.data.receivedRequests.filter(r => r.id !== request.id);
		return this.resolve([]);
	}

	rejectFriendRequest(request) {
		this.info('rejectFriendRequest', ...arguments);
		this.data.receivedRequests = this.data.receivedRequests.filter(r => r.id !== request.id);
		return this.resolve([]);
	}

	getAllUserGames(gameAttributes) {
		this.info('getAllUserGames', ...arguments);
		const userGames = this.data.userGames.map(data => ({
			...data,
			game: this.getObjectAttributes(data.game, gameAttributes),
		}));
		return this.resolve(userGames);
	}

	getGames(ids, attributes) {
		this.info('getGames', ...arguments);
		const found = this.data.games.filter(game => ids.indexOf(game.id) !== -1);

		return this.resolve(this.getObjectsAttributes(found, attributes));
	}

	getCart(gameAttributes) {
		this.info('getCart', ...arguments);
		const cart = {
			...this.data.cart,
			items: this.data.cart.items.map(cartItem => {
				if (cartItem.type !== 'game') {
					return cartItem;
				}

				return {
					...cartItem,
					game: this.getObjectAttributes(cartItem.game, gameAttributes),
				};
			}),
		};
		return this.resolve(cart);
	}

	addCartItem(item) {
		this.info('addCartItem', ...arguments);
		const newItem = item.serialize();
		newItem.id = `nci_${this.data.cart.items.length}`;
		this.data.cart.items.push(newItem);
		return this.resolve({ id: newItem.id });
	}

	removeCartItem(item) {
		this.info('removeCartItem', ...arguments);
		remove(this.data.cart.items, data => data.id === item.id);
		return this.resolve(null);
	}

	buyCartItems() {
		this.info('buyCartItems', ...arguments);

		const order = new Order();
		order.update({
			id: this.generateId(),
			items: this.data.cart.items,
			total: new BigNumber(100),
			paymentStatus: 'success',
			paymentStatusUpdatedAt: '2019-08-24',
			number: '123456',
			status: Order.STATUS.COMPLETED,
		});

		const tokenBalance = this.data.currentUser.tokenBalance.div(2); // random value
		this.data.currentUser.tokenBalance = tokenBalance;

		this.data.cart.items = [];
		this.data.orders.push(order);

		return this.resolve({ order, tokenBalance });
	}

	getOrders(ids, attributes) {
		this.info('getPaymentMethods', ...arguments);
		const orders = this.data.orders.filter(order => ids.indexOf(order.id) >= 0);
		return this.resolve({
			entries: this.getObjectsAttributes(orders, attributes),
		});
	}

	getPaymentMethods() {
		this.info('getPaymentMethods', ...arguments);
		return this.resolve(this.data.paymentMethods);
	}

	getStoreFrontPage(gameAttributes) {
		this.info('getStoreFrontPage', ...arguments);
		return this.resolve({ storeCategories: this.data.storeCategories });
	}

	searchUsers(query, userAttributes, page = 1, pageSize = 10) {
		this.info('searchUsers', ...arguments);
		const users = query === 'none' ? [] : this.data.users.filter(user => user !== this.data.currentUser);
		const chunks = chunk(users, pageSize);
		const pageResults = chunks.length >= page ? chunks[page - 1] : [];
		return this.resolve({
			hasMore: chunks.length > page,
			entries: this.getObjectsAttributes(pageResults, userAttributes),
		});
	}

	inviteUser(user) {
		this.info('inviteUser', ...arguments);
		return this.resolve(this.generateId());
	}

	unfriend(user) {
		this.info('unfriend', ...arguments);
		this.data.friends = this.data.friends.filter(friend => friend !== user);
		return this.resolve(null);
	}

	sendTokens(amount, user) {
		this.info('sendTokens', ...arguments);
		const newBalance = this.data.currentUser.tokenBalance.minus(amount);
		this.data.currentUser.tokenBalance = newBalance;
		return this.resolve(newBalance);
	}

	purchaseTokens(paymentMethod, amount) {
		this.info('purchaseTokens', ...arguments);
		this.data.currentUser.tokenBalance = this.data.currentUser.tokenBalance.plus(amount);
		const order = new Order();
		order.update({
			status: Order.STATUS.COMPLETED,
		});

		// If a new credit card, save it in user's payment methods
		if (!paymentMethod.isSaved() && paymentMethod instanceof CreditCard) {
			const newCard = new CreditCard();
			newCard.id = this.generateId();
			newCard.last4 = '1234';
			this.data.paymentMethods.push(newCard);
		}

		return this.resolve({
			order,
			tokenBalance: this.data.currentUser.tokenBalance,
		});
	}

	uploadConversationAttachment(conversation, file) {
		this.info('uploadConversationAttachment', ...arguments);
		return this.resolve();
	}

	/**
	 * Returns only the requested attributes of an object. If `idAttribute` is set, the field will be added to the list of attributes
	 * @param {object} object
	 * @param {string[]} attributes
	 * @param {string} idAttribute
	 * @return {object}
	 */
	getObjectAttributes(object, attributes, idAttribute = 'id') {
		const pickAttributes = idAttribute ? [...attributes, idAttribute] : attributes;
		return deepPick(object, pickAttributes);
	}

	/**
	 * Like getObjectAttributes but for multiple objects.
	 * @param {object[]} objects
	 * @param {string[]} attributes
	 * @param {string} idAttribute
	 * @return {object[]}
	 */
	getObjectsAttributes(objects, attributes, idAttribute = 'id') {
		return objects.map(o => this.getObjectAttributes(o, attributes, idAttribute));
	}

	/**
	 * @param {*} data
	 * @param {boolean} authenticated If true and `this.loggedIn` is false, rejects with an authentication error.
	 * @return {Promise}
	 */
	resolve(data = null, authenticated = true) {
		if (authenticated && !this.loggedIn) {
			return this.rejectAuthentication();
		}

		if (this.delay === 0) {
			return Promise.resolve(data);
		}

		return new Promise(resolve => {
			setTimeout(() => {
				resolve(data);
			}, this.delay);
		});
	}

	/**
	 * Rejects with an authentication error (INVALID_TOKEN) and invalidates the authenticated
	 * session.
	 * @return {Promise}
	 */
	rejectAuthentication() {
		const auth = IoC.make('auth');
		return this.reject(new ServerError(ServerError.INVALID_TOKEN, 'You are not authenticated.')).catch(e => {
			if (e.is(ServerError.INVALID_TOKEN)) {
				auth.invalidate();
			}
			return Promise.reject(e);
		});
	}

	/**
	 * @param {*} data
	 * @return {Promise}
	 */
	reject(data = null) {
		if (this.delay === 0) {
			return Promise.reject(data);
		}

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(data);
			}, this.delay);
		});
	}

	info(type, ...data) {
		if (this.loggingEnabled) {
			// eslint-disable-next-line no-console
			console.debug(`Mock Server: ${type}`, ...data);
		}
	}

	generateId() {
		// eslint-disable-next-line no-plusplus
		return `temp_id_${this.nextId++}`;
	}
}

export default MockServer;
