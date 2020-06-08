/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import get from 'lodash/get';
import omit from 'lodash/omit';
import Cookies from 'js-cookie';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import AbstractServer from './AbstractServer';
import ServerError from './ServerError';
import Conversation from '../Conversation';
import { attributesArrayToGraphQL } from '../utils';
import CreditCard from '../ECommerce/CreditCard';
import Order from '../ECommerce/Order';
import PaymentMethod from '../ECommerce/PaymentMethod';

const fragmentConversationMessageEvent = `
	id,
	insertedAt,
	message {
		content,
		media,
		media_thumb,
		ref,
		type,
		user {
			id
		}
	},
	type
`;

/**
 * Server class that uses the API.
 */
class ApiServer extends AbstractServer {
	static COOKIE_NAME = 'auth';

	/**
	 * Authentication token received when logging in and that must be sent with all protected
	 * requests.
	 * @type {string|null}
	 */
	authToken = null;

	/**
	 * @inheritDoc
	 */
	load() {
		const data = Cookies.get(ApiServer.COOKIE_NAME);

		if (data) {
			this.authToken = data;
		}

		return Promise.resolve();
	}

	/**
	 * Saves in a cookie the current authentication info. Only if the server.api.saveAuthentication
	 * config is true.
	 */
	updateAuthenticationCookie() {
		const config = IoC.make('config');
		if (config.get('server.api.saveAuthentication', false)) {
			Cookies.set(ApiServer.COOKIE_NAME, this.authToken);
		}
	}

	/**
	 * Removes the cookie with the authentication info.
	 */
	clearAuthenticationCookie() {
		Cookies.remove(ApiServer.COOKIE_NAME);
	}

	/**
	 * @inheritDoc
	 */
	getAuthenticatedUser(attributes) {
		const query = `query {
			me {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query).then(result => result.me);
	}

	/**
	 * @inheritDoc
	 */
	login(username, password) {
		const config = IoC.make('config');
		this.clearAuthData();
		const clientId = config.get('server.api.oauthAppID');
		const grantType = 'password';

		return this.request(
			'/oauth/token',
			{
				client_id: clientId,
				grant_type: grantType,
				username,
				password,
			},
			false,
		).then(result => {
			this.processLoginResult(result);
			return result;
		});
	}

	/**
	 * @inheritDoc
	 */
	logout() {
		const res = this.request('/auth.logout');
		this.clearAuthData(); // Must be after the request
		return res;
	}

	/**
	 * @inheritDoc
	 */
	restorePassword(email) {
		// TODO: Implement restore password functionality
		// const res = this.request('/auth.restore', {
		// 	email,
		// });
		// return res;

		return Promise.resolve(email);
	}

	/**
	 * @inheritDoc
	 */
	signup(user) {
		this.clearAuthData();
		return this.request('/users.signup', { ...user }, false);
	}

	/**
	 * @inheritDoc
	 */
	getUsers(ids, attributes) {
		const query = `query($ids: [ID]) {
			users(ids: $ids) {
				entries {
					${attributesArrayToGraphQL(attributes)}
				}
				pageNumber,
				pageSize,
				totalEntries,
				totalPages
			}
		}`;

		return this.graphQLRequest(query, { ids }, false).then(result => result.users);
	}

	/**
	 * @inheritDoc
	 */
	getAllConversations(userAttributes, nbEventsToLoad = 5) {
		const query = `query($limit: Int) {
			conversations {
				id,
				title,
				events(limit: $limit) {
					entries {
						...Entries
					}
				},
				users {
					${attributesArrayToGraphQL(userAttributes)}
				}
			}
		}
		fragment Entries on ConversationMessageEvent {
			${fragmentConversationMessageEvent}
		}
		`;

		return this.graphQLRequest(query, { limit: nbEventsToLoad }).then(result => {
			result.conversations.forEach(conversation => {
				ApiServer.prepareConversation(conversation);
			});

			return result.conversations;
		});
	}

	/**
	 * @inheritDoc
	 */
	getConversation(id, userAttributes, nbEventsToLoad = 5) {
		const query = `query($id: ID!, $limit: Int) {
			conversation(id: $id) {
				id,
				title,
				events(limit: $limit) {
					entries {
						...Entries
					},
					metadata {
						after
					}
				},
				users {
					${attributesArrayToGraphQL(userAttributes)}
				}
			}
		}
		fragment Entries on ConversationMessageEvent {
			${fragmentConversationMessageEvent}
		}
		`;

		return this.graphQLRequest(query, { id, limit: nbEventsToLoad }).then(result =>
			ApiServer.prepareConversation(result.conversation),
		);
	}

	/**
	 * @inheritDoc
	 */
	deleteConversation(idOrConversation) {
		const id = idOrConversation instanceof Conversation ? idOrConversation.id : idOrConversation;
		return this.request(`/conversations.delete/${id}`);
	}

	/**
	 * @inheritDoc
	 */
	createConversation(users, rawTitle, userAttributes) {
		const title = typeof rawTitle === 'string' ? rawTitle : '';
		const userIds = users.map(user => user.id);

		const query = `mutation($title: String!, $userIds: [ID]!) {
			createConversation(title: $title, userIds: $userIds) {
				id,
				title,
				users {
					${attributesArrayToGraphQL(userAttributes)}
				}
			}
		}`;

		return this.graphQLRequest(query, { title, userIds }).then(result => result.createConversation);
	}

	/**
	 * @inheritDoc
	 */
	loadConversationEvents(idOrConversation, cursor, number) {
		const id = idOrConversation instanceof Conversation ? idOrConversation.id : idOrConversation;
		const query = `query($id: ID!, $limit: Int, $cursor: String) {
			conversation(id: $id) {
				events(limit: $limit, cursor: $cursor) {
					entries {
						...Entries
					},
					metadata {
						after
					}
				}
			}
		}
		fragment Entries on ConversationMessageEvent {
			${fragmentConversationMessageEvent}
		}
		`;

		return this.graphQLRequest(query, { id, limit: number, cursor }).then(result => {
			ApiServer.prepareConversation(result.conversation);
			return result.conversation.events;
		});
	}

	/**
	 * @inheritDoc
	 */
	getFriends(attributes) {
		const query = `query {
			friends {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query).then(result => result.friends);
	}

	/**
	 * @inheritDoc
	 */
	getReceivedFriendRequests(userAttributes) {
		// When a FriendshipRequest object will be returned:
		const query = `query {
			pendingFriendshipRequestsReceived {
				id,
				insertedAt,
				fromUser {
					${attributesArrayToGraphQL(userAttributes)}
				}
			}
		}`;

		return (
			this.graphQLRequest(query)
				// The internal FriendshipRequest object has a `user` attribute but the object received
				// has a `fromUser` attribute instead, so we update it before returning it
				.then(result =>
					result.pendingFriendshipRequestsReceived.map(fsr => ({
						...omit(fsr, ['fromUser', 'insertedAt']),
						user: fsr.fromUser,
						date: moment.utc(fsr.insertedAt, 'YYYY-MM-DDTHH:mm:ss'),
					})),
				)
		);
	}

	/**
	 * @inheritDoc
	 */
	getSentFriendRequests(userAttributes) {
		// When a FriendshipRequest object will be returned:
		const query = `query {
			pendingFriendshipRequestsSent {
				id,
				insertedAt,
				toUser {
					${attributesArrayToGraphQL(userAttributes)}
				}
			}
		}`;

		return (
			this.graphQLRequest(query)
				// The internal FriendshipRequest object has a `user` attribute but the object received
				// has a `toUser` attribute instead, so we update it before returning it
				.then(result =>
					result.pendingFriendshipRequestsSent.map(fsr => ({
						...omit(fsr, ['toUser', 'insertedAt']),
						user: fsr.toUser,
						date: ApiServer.parseDateTime(fsr.insertedAt),
					})),
				)
		);
	}

	cancelSentFriendRequest(request) {
		const query = `mutation($id: ID!) {
			deleteFriendship(id: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: request.id });
	}

	/**
	 * @inheritDoc
	 */
	approveFriendRequest(request) {
		const query = `mutation($id: ID!) {
			acceptFriendshipRequest(id: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: request.id });
	}

	/**
	 * @inheritDoc
	 */
	rejectFriendRequest(request) {
		const query = `mutation($id: ID!) {
			rejectFriendshipRequest(id: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: request.id });
	}

	/**
	 * @inheritDoc
	 */
	unfriend(user) {
		const query = `mutation($id: ID!) {
			unfriend(friendId: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: user.id });
	}

	/**
	 * @inheritDoc
	 */
	getAllUserGames(attributes) {
		const query = `query {
			myGames {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query).then(result => result.myGames);
	}

	/**
	 * @inheritDoc
	 */
	getGames(ids, attributes, authenticated) {
		const query = `query($ids: [ID]) {
			games(ids: $ids) {
				entries {
					${attributesArrayToGraphQL(attributes)}
				}
				pageNumber,
				pageSize,
				totalEntries,
				totalPages
			}
		}`;

		return this.graphQLRequest(query, { ids }, authenticated).then(result => result.games);
	}

	/**
	 * @inheritDoc
	 */
	getGame(id, attributes, authenticated) {
		const query = `query($id: [ID]) {
			game(id: $id) {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query, { id }, authenticated).then(result => result.game);
	}

	/**
	 * @inheritDoc
	 */
	getStoreFrontPage(attributes, authenticated) {
		const query = `query {
			storeCategories {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query, null, authenticated);
	}

	/**
	 * @inheritDoc
	 */
	inviteUser(user) {
		const query = `mutation($id: ID!) {
			sendFriendshipRequest(friendId: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: user.id }).then(result => result.sendFriendshipRequest.id);
	}

	/**
	 * @inheritDoc
	 */
	sendTokens(amount, user) {
		// We need the updated token balance of the current user
		const query = `mutation($amount: Cents!, $userId: ID!) {
			sendTokenToFriend(amount: $amount, friendId: $userId) {
				from { tokenBalance }
			}
		}`;
		const amountAsNumber = amount.toNumber();

		// We return the new tokenBalance as a BigNumber
		return this.graphQLRequest(query, { amount: amountAsNumber, userId: user.id }).then(
			result => new BigNumber(result.sendTokenToFriend.from.tokenBalance),
		);
	}

	/**
	 * @inheritDoc
	 * @param {PaymentMethod} paymentMethod
	 * @param {BigNumber} amount
	 * @return {Promise<Order>}
	 */
	purchaseTokens(paymentMethod, amount) {
		const queryParams = {};
		const graphQlParams = {};

		queryParams.amount = amount.toNumber();
		graphQlParams.amount = 'Int!';

		if (!paymentMethod.isSaved() && paymentMethod instanceof CreditCard) {
			const billingAddress = paymentMethod.billingAddress;

			queryParams.billingAddress = {
				address1: billingAddress.address1,
				address2: billingAddress.address2,
				city: billingAddress.city,
				state: billingAddress.region,
				country: billingAddress.country,
				zipcode: billingAddress.zipPostalCode,
			};

			queryParams.creditCard = {
				firstName: billingAddress.firstName,
				lastName: billingAddress.lastName,
				token: paymentMethod.token.value,
			};

			graphQlParams.billingAddress = 'InputAddress';
			graphQlParams.creditCard = 'InputCreditCard';
		} else {
			queryParams.paymentMethodId = paymentMethod.id;
			graphQlParams.paymentMethodId = 'String';
		}

		const mutationParams = Object.entries(graphQlParams)
			.map(([key, value]) => `$${key}: ${value}`)
			.join(', ');

		const purchaseTokensParams = Object.keys(graphQlParams)
			.map(key => `${key}: $${key}`)
			.join(', ');

		const query = `mutation(${mutationParams}) {
			purchaseTokens(${purchaseTokensParams}) {
				id,
				status,
				user {
					tokenBalance
				}
			}
		}`;

		return this.graphQLRequest(query, queryParams).then(result => {
			const tokenBalance = new BigNumber(result.purchaseTokens.user.tokenBalance);
			const order = new Order();
			order.update(omit(result.purchaseTokens, ['user']));

			return {
				order,
				tokenBalance,
			};
		});
	}

	/**
	 * @inheritDoc
	 * @param {Conversation} conversation
	 * @param {File} file
	 */
	uploadConversationAttachment(conversation, file) {
		const fileUUID = `fileupload_${conversation.id}_${new Date().getTime()}`;
		const fileName = file.name;

		const query = `mutation($conversationId: ID!, $ref: String!, $media: Upload!) {
			uploadConversationAttachment(conversationId: $conversationId, ref: $ref, media: $media) {
				id
			}
		}`;
		const upload = {
			name: fileName,
			file,
		};

		return this.graphQLRequest(
			query,
			{ conversationId: conversation.id, ref: fileUUID, media: fileName },
			true,
			upload,
		);
	}

	/**
	 * @inheritDoc
	 */
	getCart(attributes) {
		const query = `query {
			cart {
				id,
				items {
					id,
					game {
						${attributesArrayToGraphQL(attributes)}
					}
				}
			}
		}`;

		return this.graphQLRequest(query).then(result => result.cart);
	}

	/**
	 * @inheritDoc
	 */
	addCartItem(item) {
		const query = `mutation($id: ID!) {
			addToCart(gameId: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: item.game.id }).then(result => result.addToCart);
	}

	/**
	 * @inheritDoc
	 */
	removeCartItem(item) {
		const query = `mutation($id: ID!) {
			removeFromCart(cartItemId: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: item.id });
	}

	/**
	 * @inheritDoc
	 */
	buyCartItems() {
		const query = `mutation {
			completePurchase {
				id,
				user {
					tokenBalance
				}
			}
		}`;

		return this.graphQLRequest(query).then(result => ({
			order: omit(result.completePurchase, ['user']),
			tokenBalance: new BigNumber(result.completePurchase.user.tokenBalance),
		}));
	}

	/**
	 * @inheritDoc
	 */
	getOrders(ids, attributes, page, pageSize, type) {
		const query = `query($ids: [ID], $page: Int, $pageSize: Int, $type: String) {
			orders(ids: $ids, page: $page, pageSize: $pageSize, type: $type) {
				entries {
					${attributesArrayToGraphQL(attributes)}
				}
				pageNumber,
				pageSize,
				totalEntries,
				totalPages
			}
		}`;

		return this.graphQLRequest(query, { ids, page, pageSize, type }).then(result => result.orders);
	}

	/**
	 * @inheritDoc
	 */
	refundOrder(id, items, attributes) {
		const query = `mutation($id: ID, $itemsIds: [ID]) {
			refundOrder(id: $id, itemsIds: $itemsIds) {
				${attributesArrayToGraphQL(attributes)}
			}
		}`;

		return this.graphQLRequest(query, { id, itemsIds: items }).then(result => result.refundOrder);
	}

	/**
	 * @inheritDoc
	 */
	getPaymentMethods() {
		const query = `query {
			paymentMethods {
				id,
				type,
				creditCard {
					last4
				}
			}
		}`;

		return this.graphQLRequest(query).then(result =>
			result.paymentMethods.map(data => {
				if (data.type === 'credit_card') {
					const cc = new CreditCard();
					cc.update({
						id: data.id,
						saved: true,
						last4: data.creditCard.last4,
					});
					return cc;
				}

				// Unknown payment method type (we create a simple PaymentMethod)
				// eslint-disable-next-line no-console
				console.warn(`Unkown payment method type: ${data.type}`);
				const pm = new PaymentMethod();
				pm.update({
					id: data.id,
					saved: true,
				});
				return pm;
			}),
		);
	}

	/**
	 * @inheritDoc
	 */
	completeGameDownload(gameId) {
		const query = `mutation($id: ID!) {
			completedGameDownload(id: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: gameId });
	}

	/**
	 * @inheritDoc
	 */
	completeGameLaunch(gameId) {
		const query = `mutation($id: ID!) {
			playGame(id: $id) { id }
		}`;

		return this.graphQLRequest(query, { id: gameId });
	}

	/**
	 * @inheritDoc
	 */
	searchUsers(searchQuery, userAttributes, page = 1, pageSize = 10) {
		const query = `query($query: String, $page: Int, $pageSize: Int) {
			users(query: $query, page: $page, pageSize: $pageSize) {
				entries {
					${attributesArrayToGraphQL(userAttributes)}
				}
				pageNumber,
				totalPages
			}
		}`;

		return this.graphQLRequest(query, { query: searchQuery, page, pageSize }).then(result => {
			const data = result.users;

			return {
				entries: data.entries,
				hasMore: data.pageNumber < data.totalPages,
			};
		});
	}

	/**
	 * @inheritDoc
	 * Pagination not used for now
	 */
	// eslint-disable-next-line no-unused-vars
	searchGames(searchQuery, gameAttributes, authenticated, page = 1) {
		const query = `query($query: String) {
			games(query: $query) {
				entries {
					${attributesArrayToGraphQL(gameAttributes)}
				}
				pageNumber,
				pageSize,
				totalEntries,
				totalPages
			}
		}`;

		return this.graphQLRequest(query, { query: searchQuery }, authenticated).then(result => result.games);
	}

	/**
	 * Makes the actual requests. Will then process the response. Returns a Promise that resolves
	 * with the response's `data` content, or rejects with a ServerError if any kind of error
	 * occurred. By default, the request will send the authentication token. Set `authenticated` to
	 * false for non-protected requests (like the login). Note that if doing an authenticated
	 * request and we do not have the required auth data (username and token), it will reject
	 * immediately, without sending the request to the server.
	 *
	 * @protected
	 * @param {string} path
	 * @param {*} body
	 * @param {boolean} authenticated
	 * @return {Promise}
	 */
	request(path, body = null, authenticated = true) {
		/** @type {Config} */
		const config = IoC.make('config');

		const init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		};

		if (body !== null) {
			init.body = JSON.stringify(body);
		}

		const fullPath = config.get('server.api.baseUrl') + path;

		return this.doRequest(fullPath, init, authenticated);
	}

	/**
	 * Makes the QraphQL requests. Will then process the response. Returns a Promise that resolves
	 * with the response's `data` content, or rejects with a ServerError if any kind of error
	 * occurred. By default, the request will send the authentication token. Set `authenticated` to
	 * false for non-protected requests (like the login). Note that if doing an authenticated
	 * request and we do not have the required auth data (username and token), it will reject
	 * immediately, without sending the request to the server.
	 *
	 * If an `upload` object is passed, the file will be uploaded and this query will be
	 * sent as a multipart/form-data
	 *
	 * @protected
	 * @param {string} query
	 * @param {string} variables
	 * @param {boolean} authenticated
	 * @param {{ file: File, name: string}} upload
	 * @return {Promise<any>}
	 */
	graphQLRequest(query, variables = null, authenticated = true, upload = null) {
		/** @type {Config} */
		const config = IoC.make('config');

		// Remove newlines and tabs
		const cleanQuery = query.replace(/(?:\n(?:\s*))+/g, ' ').trim();

		let body;

		if (upload === null) {
			body = JSON.stringify({
				query: cleanQuery,
				variables,
			});
		} else {
			const formData = new FormData();
			formData.append('query', cleanQuery);
			if (variables) {
				formData.append('variables', JSON.stringify(variables));
			}
			formData.append(upload.name, upload.file);
			body = formData;
		}

		const init = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body,
		};

		if (upload === null) {
			init.headers['Content-Type'] = 'application/json';
		} else {
			// IMPORTANT: do NOT set the 'Content-Type' header if we are sending as a
			// "multipart/form-data" because we must let the browser create it so it has a valid
			// `boundary` property
		}

		return this.doRequest(config.get('server.api.graphqlUrl'), init, authenticated);
	}

	/**
	 * Does a `fetch` request to the specified `path` with the `requestInit` init object. Then
	 * analyses the response for any ill-formed response or errors in the response, in which case
	 * the returned promise fails. Also retrieves any information in the response concerning
	 * authentication (log in and log out info). The returned promise will resolve with the `data`
	 * attribute's value of the reponse object.
	 *
	 * @param {string} path
	 * @param {RequestInit} requestInit
	 * @param {boolean} authenticated True if the user must be authenticated to do the request
	 * @return {Promise}
	 */
	doRequest(path, requestInit, authenticated) {
		if (authenticated) {
			// Reject immediately if we don't have the required authentication data for authenticated
			// requests.
			if (!this.canRequestAuthenticated()) {
				const error = new ServerError(ServerError.NOT_AUTHENTICATED, 'You must be authenticated to do this request');
				this.logError(error);
				return Promise.reject(error);
			}

			this.addAuthenticationHeader(requestInit.headers);
		}

		return (
			fetch(path, requestInit)
				// 1. Check if we were simply not able to connect to the server
				.catch(e => {
					if (e instanceof TypeError) {
						return Promise.reject(new ServerError(ServerError.NETWORK_ERROR, e.message));
					}

					return Promise.reject(e);
				})
				// 2. Check that the HTTP response was successful (also check for 'Not Authorized' HTTP
				//    errors)
				// Note that the server always returns 200 status (except 403). If an error occurred, the
				// server will specify it in the JSON object (see step 6.)
				.then(response => this.validateHTTPResponse(response))
				// 3. Parse JSON
				.then(response => response.json())
				// 4. If JSON parsing failed
				.catch(e => {
					// Invalid JSON
					if (e instanceof SyntaxError) {
						return Promise.reject(new ServerError(ServerError.INVALID_RESPONSE, e.message));
					}

					return Promise.reject(e);
				})
				// 5. Because of server limitations, authentication responses are not formatted as
				//    expected
				.then(json => this.reformatAuthResponse(json))
				// 6. Validates that the response JSON object is well formed and does not contain error
				//    messages set by the server
				.then(json => this.validateResponseBody(json))
				// 7. Return the value in the `data` attribute of the JSON response
				.then(json => this.getResponseData(json))
				.catch(e => {
					// If the error is an authentication error, we log out the user
					this.logOutIfAuthenticationError(e);
					this.logError(e);
					return Promise.reject(e);
				})
		);
	}

	/**
	 * Log out the user if the error is an authentication error.
	 * @param {ServerError|*} e
	 */
	logOutIfAuthenticationError(e) {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		const authErrors = [
			ServerError.AUTH_DENIED,
			ServerError.AUTH_FAILED,
			ServerError.INVALID_TOKEN,
			ServerError.NOT_AUTHENTICATED,
		];

		if (e instanceof ServerError && authErrors.indexOf(e.code) !== -1) {
			this.clearAuthData();
			auth.invalidate();
		}
	}

	/**
	 * Clears any saved data used for authentication
	 */
	clearAuthData() {
		this.authToken = null;
		this.clearAuthenticationCookie();
	}

	/**
	 * Retrieves information from a login response data for future authenticated requests
	 *
	 * @param {object} data
	 */
	processLoginResult(data) {
		this.authToken = data.access_token;
		this.updateAuthenticationCookie();
	}

	/**
	 * Returns true if we have the required authentication info to do an authenticated request.
	 *
	 * @return {boolean}
	 */
	canRequestAuthenticated() {
		return typeof this.authToken === 'string';
	}

	/**
	 * Adds the Authorization HTTP header built from the  authToken to the supplied
	 * headers object. Do not call this method if we don't have the authentication data (call
	 * `canRequestAuthenticated()` before)
	 * @param {object} headers
	 */
	addAuthenticationHeader(headers) {
		const key = this.getAuthenticationKey();

		headers.Authorization = `Bearer ${key}`;
	}

	/**
	 * Validates the HTTP response code. If a 401/3 was returned, we log out the user. Else, the
	 * server will always return 200 responses, even if it wants to report an error (it will put
	 * the error in the JSON object). So if we get anything else of 200, it's an unhandled error.
	 *
	 * @param {Response} response
	 * @return {Promise|Response}
	 */
	validateHTTPResponse(response) {
		if (response.status === 401 && response.status === 403) {
			return Promise.reject(new ServerError(ServerError.AUTH_DENIED));
		}

		if (!response.ok) {
			const message = `HTTP error code: ${response.status}`;
			return Promise.reject(new ServerError(ServerError.SERVER_ERROR, message));
		}

		return response;
	}

	/**
	 * oAuth login responses don't have the expected format of a `data` attribute
	 * containing the response. If we find authentication attributes, we put them in the `data`
	 * attribute and return the new formatted json object.
	 *
	 * @param {object} json
	 * @return {object}
	 */
	reformatAuthResponse(json) {
		const authAttributes = ['access_token', 'token_type', 'refresh_token', 'user'];

		const newJson = { ...json };
		const keys = Object.keys(newJson);

		if (!newJson.data) {
			newJson.data = {};
		}

		authAttributes.forEach(attribute => {
			if (keys.indexOf(attribute) >= 0) {
				newJson.data[attribute] = json[attribute];
			}
		});

		return newJson;
	}

	/**
	 * Analyses the response body to check if it is well formed. If not, throws with an error. If
	 * the response body is an error object, throws an error. Returns the same json object.
	 *
	 * @protected
	 * @param {object} json
	 * @return {object}
	 */
	validateResponseBody(json) {
		if (typeof json !== 'object' || json === null) {
			throw new ServerError(ServerError.INVALID_RESPONSE, 'Response is not an object');
		}

		// If the response contains a `result` attribute with an "error" value (happens when doing
		// a non-GraphQL query, like login-in or login-out)
		if (get(json, 'result') === 'error') {
			// Special case for authentication errors
			if (get(json, 'error.code') === ServerError.INVALID_TOKEN) {
				throw new ServerError(ServerError.INVALID_TOKEN);
			}

			if (get(json, 'error.description') === 'access_token_not_found') {
				throw new ServerError(ServerError.INVALID_TOKEN);
			}

			throw new ServerError(
				get(json, 'error.code', ServerError.UNKNOWN_ERROR),
				get(json, 'error.message', get(json, 'error.description')),
			);
		}

		// If the response contains a `errors` array (happens with GraphQL queries)
		if (json.errors && json.errors.length) {
			// We only throw for the first error encountered, not for each
			const error = json.errors[0];

			// Check for authentication error
			if (get(error, 'message') === 'access_denied') {
				throw new ServerError(ServerError.AUTH_DENIED);
			}

			throw new ServerError(ServerError.UNKNOWN_ERROR, error.message);
		}

		if (!json.data) {
			throw new ServerError(ServerError.INVALID_RESPONSE, 'Missing `data` attribute');
		}

		return json;
	}

	/**
	 * Returns the data value of the response, if set, else returns null.
	 *
	 * @protected
	 * @param {object} json
	 * @return {*}
	 */
	getResponseData(json) {
		return get(json, 'data', null);
	}

	/**
	 * Logs an error to the console if the config allows it
	 * @param {Error} error
	 */
	logError(error) {
		/** @type {Config} */
		const config = IoC.make('config');

		if (config.get('server.api.logErrors', false)) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	/**
	 * Returns the authentication key to use for basic authentication (base64(username:token)
	 *
	 * @return {string}
	 */
	getAuthenticationKey() {
		return this.authToken;
	}

	/**
	 * Prepares attributes of the conversation object before returning it
	 *
	 * @param {object} conversation
	 * @return {object}
	 */
	static prepareConversation(conversation) {
		if (conversation.events && conversation.events.entries) {
			conversation.events.entries.forEach(event => {
				if (event.insertedAt) {
					event.date = ApiServer.parseDateTime(event.insertedAt);
				}
			});
		}
		return conversation;
	}

	static parseDateTime(dateTime) {
		const date = moment.utc(dateTime, 'YYYY-MM-DDTHH:mm:ss');
		date.local();
		return date;
	}
}

export default ApiServer;
