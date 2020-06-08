/* eslint-disable no-unused-vars */

/**
 * Abstract server class.
 * @abstract
 */
class AbstractServer {
	/**
	 * Called by the application when it is loading. Allows this instance to load any locally saved
	 * data before the first requests (like loading a locally saved authentication token). Returns a
	 * promise that resolves once loaded.
	 *
	 * @return {Promise}
	 */
	load() {
		return Promise.resolve();
	}

	/**
	 * Tries to login a user to the server with the specified username and password. Returns a
	 * promise that resolves with an object containing the response, else rejects with an error.
	 *
	 * @param {string} username
	 * @param {string} password
	 * @return {Promise<object>}
	 */
	login(username, password) {}

	/**
	 * Logs out the currently connected user. Returns a promise that resolves once the user is
	 * logged out.
	 *
	 * @return {Promise}
	 */
	logout() {}

	/**
	 * Sends a restore password request. Returns a promise that resolve or rejects based on the
	 * server response.
	 *
	 * @param {string} email
	 * @return {Promise}
	 */
	restorePassword(email) {}

	/**
	 * Signs up (creates) and new user. Returns a promise that resolves once the user is created.
	 * The created user will not be returned. Log in to retrieve it.
	 *
	 * @param {string} email
	 * @param {string} password
	 * @param {string} dateOfBirth Of format YYYY-MM-DD
	 * @return {Promise<Object>}
	 */
	signup(email, password, dateOfBirth) {}

	/**
	 * Returns a promise resolving with the currently authenticated user filled with the specified
	 * user attributes
	 *
	 * @param {string[]} attributes
	 * @return {Promise<object>}
	 */
	getAuthenticatedUser(attributes) {}

	/**
	 * Returns a promise resolving with a list of user objects corresponding to the specified `ids`. The
	 * user objects will have the requested `attributes`.
	 *
	 * @param {string[]} ids
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getUsers(ids, attributes) {}

	/**
	 * Returns a promise resolving with a list of conversation objects representing all the user's
	 * conversation. Each conversation object has a list of user objects which have the attributes
	 * specified by `userAttributes`. `nbEventsToLoad` is the number of events per conversation we which to load.
	 *
	 * @param {string[]} userAttributes
	 * @param {number} nbEventsToLoad
	 * @return {Promise<object[]>}
	 */
	getAllConversations(userAttributes, nbEventsToLoad) {}

	/**
	 * Returns a promise that resolves with the details of the conversation with the `id` (includes
	 * the `events`). The user objects will be filled with the requested attributes. Note that events (in
	 * `events`) that have users contain only the user id. `nbEventsToLoad` is the number of events we which to
	 * load for this conversation.
	 *
	 * @param {string} id
	 * @param {string[]} userAttributes
	 * @param {number} nbEventsToLoad
	 * @return {Promise<object>}
	 */
	getConversation(id, userAttributes, nbEventsToLoad) {}

	/**
	 * Deletes a conversation. Returns a Promise that resolves when successfully deleted
	 *
	 * @param {string|Conversation} idOrConversation The id or conversation instance to delete
	 * @return {Promise}
	 */
	deleteConversation(idOrConversation) {}

	/**
	 * Creates a new conversation with the specified users and title. Returns a Promise that
	 * resolves with the created conversation object. The `users` property of the object will be
	 * filled with the specified `userAttributes`
	 *
	 * @param {User[]} users
	 * @param {string} title Optional (set to false to ignore)
	 * @param {string[]} userAttributes
	 */
	createConversation(users, title, userAttributes) {}

	/**
	 * Loads `number` conversation events before (not including) the event specified by the `cursor`.
	 * Returns a promise with the events array.
	 *
	 * @param {string|Conversation} idOrConversation
	 * @param {string} cursor
	 * @param {number} number
	 * @return {Promise<object[]>}
	 */
	loadConversationEvents(idOrConversation, cursor, number) {}

	/**
	 * Returns a promise that resolves with a list of this user's friends. Each element is a user
	 * object with the requested `attributes`.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getFriends(attributes) {}

	/**
	 * Returns a promise that resolves with a list of this user's pending friend requests. Each user
	 * object has the requested `attributes`.
	 *
	 * @param {string[]} userAttributes
	 * @return {Promise<object[]>}
	 */
	getReceivedFriendRequests(userAttributes) {}

	/**
	 * Returns a promise that resolves with a list of this user's pending sent friend requests. Each
	 * user object has the requested `attributes`.
	 *
	 * @param {string[]} userAttributes
	 * @return {Promise<object[]>}
	 */
	getSentFriendRequests(userAttributes) {}

	/**
	 * Cancels a sent friend request. Returns a promise that resolves on success.
	 *
	 * @param {FriendRequest} request
	 * @return {Promise<object[]>}
	 */
	cancelSentFriendRequest(request) {}

	/**
	 * Approves the specified friend request. Returns a promise that resolves once the request
	 * is approved.
	 *
	 * @param {FriendRequest} request
	 * @return {Promise}
	 */
	approveFriendRequest(request) {}

	/**
	 * Rejects the specified friend request. Returns a promise that resolves once the request
	 * is rejected.
	 *
	 * @param {FriendRequest} request
	 * @return {Promise}
	 */
	rejectFriendRequest(request) {}

	/**
	 * Returns a promise that resolves with all of this user's "user games" (objects containing a
	 * game object and user related data about the game). The game objects have the requested
	 * `gameAttributes`.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object[]>}
	 */
	getAllUserGames(gameAttributes) {}

	/**
	 * Returns a promise resolving with a list of game objects corresponding to the specified `ids`. The
	 * game objects will have the requested `attributes`.
	 *
	 * @param {string[]} ids
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getGames(ids, attributes) {}

	/**
	 * Returns a promise resolving with a game object corresponding to the specified `id`. The
	 * game object will have the requested `attributes`.
	 *
	 * @param {string} id
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getGame(id, attributes) {}

	/**
	 * Returns a promise that resolves with the current user's cart data. Each game objects in the
	 * items are filled with the specified attributes.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object>}
	 */
	getCart(gameAttributes) {}

	/**
	 * Adds the specified item to the cart. Returns a promise that resolves with a partial cart item
	 * object (the created id).
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise<object>}
	 */
	addCartItem(item) {}

	/**
	 * Removes the specified item from the cart. Returns a promise that resolves when the item is
	 * removed.
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise}
	 */
	removeCartItem(item) {}

	/**
	 * Buys all items in the cart. Returns a Promise that resolves with an object containing the Order on success (the
	 * Order may have a "declined" or "pending" status though) and the user's new token balance.
	 *
	 * @return {Promise<{
	 * 	order: {Order}
	 * 	tokenBalance: {BigNumber}
	 * }>}
	 */
	buyCartItems() {}

	/**
	 * Returns a promise resolving with a list of game objects corresponding to the specified `ids`. The
	 * game objects will have the requested `attributes`.
	 *
	 * @param {string[]} ids
	 * @param {string[]} attributes
	 * @param {number} page
	 * @param {number} pageSize
	 * @param {string} type
	 * @return {Promise<object[]>}
	 */
	getOrders(ids, attributes, page, pageSize, type) {}

	/**
	 * Refunds the `items` for Order with `id`.
	 *
	 * @param {string} id
	 * @param {string[]} items
	 * @return {Promise<object[]>}
	 */
	refundOrder(id, items, attributes) {}

	/**
	 * Get payment methods of the user. Returns a promise that resolves with a list of PaymentMethod
	 *
	 * @return {Promise<PaymentMethod[]>}
	 */
	getPaymentMethods() {}

	/**
	 * Returns a promise that resolves with the root category object of the store. Game objects have
	 * the requested attributes.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object>}
	 */
	getStoreFrontPage(gameAttributes) {}

	/**
	 * Searches the users with the `query`. Returns the paginated result set of page `page`.
	 * Returned users are filled with the `userAttributes`. Returns a promise that resolves with a
	 * search result object.
	 *
	 * @param {string} query
	 * @param {string[]} userAttributes
	 * @param {number} page
	 * @param {number} pageSize
	 * @return {Promise<{
	 *     entries: {object[]},
	 *     hasMore: {boolean}
	 * }>}
	 */
	searchUsers(query, userAttributes, page = 1, pageSize = 10) {}

	/**
	 * Sends a friend requests to the specified user. Resolves with the generated id for the
	 * invitation
	 * @param {User} user
	 * @return {Promise<string>}
	 */
	inviteUser(user) {}

	/**
	 * Removes the specified user from the list of friends
	 * @param {User} user
	 */
	unfriend(user) {}

	/**
	 * Sends the specified amount of tokens to the specified user. Returns a Promise that resolves
	 * with the current user's new token balance (as a BigNumber).
	 *
	 * @param {BigNumber} amount
	 * @param {User} user
	 * @return {Promise<BigNumber>}
	 */
	sendTokens(amount, user) {}

	/**
	 * Purchases tokens for the user with the specified payment method. Returns a Promise that resolves with an object:
	 * {
	 *   order {Order} the order
	 *   tokenBalance {BigNumber} the user's new token balance
	 * }
	 *
	 * @param {PaymentMethod} paymentMethod
	 * @param {BigNumber} amount
	 * @return {Promise<{
	 * 	 order: {Order},
	 * 	 tokenBalance: {BigNumber},
	 * }>}
	 */
	purchaseTokens(paymentMethod, amount) {}

	/**
	 * Uploads an attachment to a conversation
	 * @param {Conversation} conversation
	 * @param {File} file
	 */
	uploadConversationAttachment(conversation, file) {}
}

export default AbstractServer;
