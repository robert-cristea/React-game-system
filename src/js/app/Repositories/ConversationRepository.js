/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { observable } from 'mobx';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import Conversation from '../Conversation';

/**
 * This repository is only for the user's conversations.
 */
class ConversationRepository {
	/**
	 * Internal list of the user's conversations
	 * @protected
	 * @type {ObservableArray<Conversation>}
	 */
	@observable
	conversations = [];

	/**
	 * Flag indicating if we loaded data at least once by calling `loadAll()`
	 * @type {boolean}
	 */
	dataLoaded = false;

	/**
	 * Asks the server to create a new conversation with the specified users and title. The server
	 * will return the conversation object and we will update the `this.conversations` array (will
	 * be added first). Note that if a conversation on the server already exists with those users,
	 * the server will return the object of the existing conversation, not an object for a new (and
	 * empty) conversation. Returns a Promise that resolves with the Conversation instance. The
	 * users will be filled with the specified attributes. If no title, set it to false.
	 *
	 * @param {User[]} users
	 * @param {string|null} title
	 * @param {string} userAttributes
	 * @return {Promise<Conversation>}
	 */
	create(users, title, userAttributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.createConversation(users, title, userAttributes).then(data => this.update([data])[0]);
	}

	/**
	 * Loads this users conversations from the server and saves them in the `this.conversations`
	 * array. Returns a Promise that resolves with the list (so resolves with `this.conversations`).
	 * The user objects will be filled with the specified `userAttributes`. If the conversations are
	 * already loaded, they will be returned unless the `forceReload` parameter is true.
	 *
	 * @param {string[]} userAttributes  The users returned by the server will contain these attributes
	 * @param {number} nbEventsToLoad Number of events to load per conversation
	 * @param {boolean} forceReload
	 * @return {Promise<ObservableArray<Conversation>>}
	 */
	loadAll(userAttributes, nbEventsToLoad = 2, forceReload = true) {
		if (this.dataLoaded && !forceReload) {
			return this.fillUsers(userAttributes).then(() => this.conversations);
		}

		this.dataLoaded = false;
		this.conversations.clear();

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getAllConversations(userAttributes, nbEventsToLoad).then(data => {
			this.dataLoaded = true;
			return this.replace(data);
		});
	}

	/**
	 * Loads the detailed version of a specific conversation from the server by its id.  Returns a
	 * Promise that resolves with the Conversation instance. The user will be filled with the
	 * specified `userAttributes`. `nbEvents` events will be loaded
	 *
	 * @param {string} id
	 * @param {string[]} userAttributes
	 * @param {number} nbEvents
	 * @return {Promise<Conversation>}
	 */
	load(id, userAttributes, nbEvents) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getConversation(id, userAttributes, nbEvents).then(data => this.update([data])[0]);
	}

	/**
	 * Replace the conversations in this.conversations with the ones in the data. They will be added
	 * in the same order as the data.
	 *
	 * @param {object[]} conversationsData
	 * @return {ObservableArray<Conversation>} The updated value of this.conversations
	 */
	replace(conversationsData) {
		const newConversations = [];

		conversationsData.forEach(conversationData => {
			const id = conversationData.id;
			/** @type {Conversation} */
			const conversation = this.retrieve(id) || new Conversation();
			conversation.update(conversationData);
			newConversations.push(conversation);
		});

		this.conversations.replace(newConversations);
		return this.conversations;
	}

	/**
	 * Update the list of conversations with the supplied data. Existing conversations are updated,
	 * new ones are prepended. Returns only the updated conversation instances.
	 *
	 * @param {object[]} conversationsData
	 * @return {Array<Conversation>}
	 */
	update(conversationsData) {
		const updated = [];

		conversationsData.forEach(conversationData => {
			const id = conversationData.id;
			const existing = this.retrieve(id);
			/** @type {Conversation} */
			const conversation = existing || new Conversation();
			conversation.update(conversationData);

			if (!existing) {
				this.conversations.unshift(conversation);
			}

			updated.unshift(conversation);
		});

		return updated;
	}

	/**
	 * Fills all users of all currently loaded conversations with the specified `attributes`.
	 * Returns a Promise that resolves with the users once they are all filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User[]>}
	 */
	fillUsers(attributes) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		const users = [];
		this.conversations.forEach(
			/** @type {Conversation} */ conversation => {
				users.push(conversation.users);
			},
		);
		return repo.fill(uniq(users), attributes);
	}

	/**
	 * Removes a conversation from the list and removes it from the server. Returns a promise that
	 * resolves once it is removed on the server. The conversation is immediately removed from the
	 * list. If the server then returns an error, it is re-added.
	 *
	 * @param {Conversation} conversation
	 * @return {Promise}
	 */
	delete(conversation) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		const index = this.conversations.indexOf(conversation);
		this.conversations.remove(conversation);

		return server.deleteConversation(conversation).catch(e => {
			// in case of error, we re-add the conversation
			this.conversations.splice(index, 0, conversation);
			return Promise.reject(e);
		});
	}

	/**
	 * Returns the conversation instance with the specified id from the list of already loaded
	 * conversations. If it is not found, returns undefined (this method doesn't query the
	 * server).
	 *
	 * @param {string} id
	 * @return {Conversation|undefined}
	 */
	retrieve(id) {
		return this.conversations.find(c => c.id === id);
	}

	/**
	 * Returns the observable `conversations` array. This array can be used even before the
	 * conversations are loaded (will be empty). It is observable and will be filled once the
	 * conversations are loaded.
	 *
	 * @return {ObservableArray<Conversation>}
	 */
	getConversations() {
		return this.conversations;
	}

	/**
	 * Sort current conversations in `this.conversations` by date of last message (earliest first,
	 * oldest last)
	 */
	sortByLastMessage() {
		const sorted = this.conversations.slice().sort((a, b) => {
			/** @type {MessageEvent} */
			const aLatestMessage = a.getLatestTextMessageEvent();
			/** @type {MessageEvent} */
			const bLatestMessage = b.getLatestTextMessageEvent();

			if (!aLatestMessage) {
				return -1;
			}

			if (!bLatestMessage) {
				return 1;
			}

			return bLatestMessage.date.diff(aLatestMessage.date);
		});

		this.conversations.replace(sorted);
	}

	/**
	 * Finds in the list of already loaded conversations the one with the specified `users`. Returns
	 * null if it cannot be found.
	 *
	 * @param {User[]} users
	 * @return {Conversation|null}
	 */
	findConversationWith(users) {
		const found = this.conversations.find(c => {
			if (c.users.length !== users.length) {
				return false;
			}

			return difference(c.users, users).length === 0;
		});

		return found || null;
	}

	/**
	 * Clear the ConversationRepository. Called during `logout`.
	 */
	clear() {
		this.conversations = [];
	}
}

export default ConversationRepository;
