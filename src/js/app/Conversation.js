/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { observable, computed } from 'mobx';
import MessageEvent from './ConversationEvent/MessageEvent';
import UserEvent from './ConversationEvent/UserEvent';
import UpdateEvent from './ConversationEvent/UpdateEvent';
import ConversationSocket from './Server/ConversationSocket';
import TextMessage from './ConversationMessage/TextMessage';

/**
 * @property {string} id
 * @property {string} title
 * @property {User[]} users
 * @property {User} owner
 */
class Conversation {
	/**
	 * Events of this conversation. The most recent is first (descending order)
	 * @type {ObservableArray<AbstractEvent>}
	 */
	@observable
	events = [];

	/**
	 * Stores the conversation socket. The same is always return every time we call `getSocket()`
	 * unless `forceNew` is true.
	 * @protected
	 * @type {ConversationSocket|null}
	 */
	socket = null;

	/**
	 * Data about pagination
	 * @type {{lastLoadWasEmpty: boolean, afterCursor: string|null}}
	 */
	@observable
	paginationData = {
		// if set, cursor to query next events. null if no more events
		afterCursor: null,
		// true if the last load return an empty result set
		lastLoadWasEmpty: true,
	};

	/**
	 * True if more previous events can be loaded. For now, it's determined from whether the last
	 * loaded events list was empty (false) or not (true).
	 *
	 * @return {boolean}
	 */
	@computed
	get hasMoreEvents() {
		if (this.events.length === 0) {
			return false;
		}

		if (this.paginationData.lastLoadWasEmpty) {
			return false;
		}

		return this.paginationData.afterCursor !== null;
	}

	/**
	 * Update the attributes of this Conversation with the supplied data object. Also updates the
	 * users object it contains (note that the user list will be completely replaced, not updated).
	 * @param {object} data
	 */
	update(data) {
		/** @type {UserRepository} */
		const userRepo = IoC.make('userRepository');
		const updateData = omit(data, ['users', 'owner', 'events']);
		merge(this, updateData);

		if (data.users) {
			this.users = userRepo.update(data.users);
		}

		if (data.owner) {
			this.owner = userRepo.update(data.owner);
		}

		const entries = get(data, 'events.entries', false);
		if (entries) {
			this.replaceEvents(entries);
		}

		if (data.events) {
			this.updatePagination(data.events);
		} else {
			this.clearPagination();
		}
	}

	/**
	 * Update pagination info from `events` structure returned by server
	 * @param {{entries: object[], metadata: {after: string}}} events
	 */
	updatePagination(events) {
		if (events.entries) {
			this.paginationData.lastLoadWasEmpty = events.entries.length === 0;
		}

		if (events.metadata) {
			this.paginationData.afterCursor = events.metadata.after || null;
		}
	}

	/**
	 * Resets pagination info like there is no more pages
	 */
	clearPagination() {
		this.paginationData.lastLoadWasEmpty = true;
		this.paginationData.afterCursor = null;
	}

	/**
	 * Replaces the `events` array with the ones in the `eventsData`.
	 * @param {object[]} eventsData
	 */
	replaceEvents(eventsData) {
		this.events.clear();
		this.paginationData.lastLoadWasEmpty = eventsData.length === 0;
		this.prependEvents(eventsData);
	}

	/**
	 * "Prepends" events data to the current list of `events`, the events are added before (in a
	 * time sense) the current events in `events`. In other words, since `events` goes
	 * from most recent to oldest, this method pushes the new events at the end. `eventsData` must
	 * already be sorted from earliest (closer to now) to latest (farthest from now), like
	 * `events`.
	 *
	 * @param {object} eventsData
	 */
	prependEvents(eventsData) {
		const newEvents = eventsData.map(e => Conversation.createEvent(e));
		this.events.push(...newEvents);
	}

	/**
	 * Applies a new event to this conversation. Based on the event, different things will happen:
	 * - It can be added to the list of `events`
	 * - It can modify data (update the conversation itself or a message)
	 * - It can simply be ignored
	 *
	 * If adding the event to `events`, it will be added as the most recent event (at index 0)
	 *
	 * @param {AbstractEvent} event
	 */
	applyEvent(event) {
		switch (event.type) {
			case 'message:sent':
			case 'user:joined':
			case 'user:left':
			case 'user:entered':
			case 'user:exited':
				this.events.unshift(event);
				break;
			default:
			// We ignore it
		}
	}

	/**
	 * Loads from the server the `nb` previous events before the earliest one we currently have.
	 * Once loaded, the events are added to `events`. If the returned list is empty, sets
	 * `hasMoreEvents` to false. Returns a promise that resolves when events were loaded. You should
	 * check if `hasMoreEvents` is true before calling this method.
	 *
	 * @param {int} nb
	 * @return {Promise}
	 */
	loadMoreEvents(nb) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		const cursor = this.paginationData.afterCursor;
		return server
			.loadConversationEvents(this, cursor, nb)
			.then(events => {
				this.updatePagination(events);
				if (events.entries) {
					this.prependEvents(events.entries);
				}
			})
			.catch(e => {
				this.clearPagination();
				return Promise.reject(e);
			});
	}

	/**
	 * Fills all users of this conversations with the specified `attributes`. Returns a Promise that
	 * resolves with the users once they are all filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User[]>}
	 */
	fillUsers(attributes) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.fill(this.users, attributes);
	}

	/**
	 * Returns the list of users excluding the ones specified (generally used to get users other
	 * than ourself)
	 *
	 * @param {User|User[]} usersToExclude
	 * @return {User[]}
	 */
	getOtherUsers(usersToExclude) {
		if (!Array.isArray(usersToExclude)) {
			return this.getOtherUsers([usersToExclude]);
		}

		return this.users.filter(user => usersToExclude.indexOf(user) === -1);
	}

	/**
	 * Creates and returns an event instance filled with the data. Can return a UserEvent, a
	 * MessageEvent or an UpdateEvent.
	 *
	 * @param {object} eventData
	 * @return {AbstractEvent|UserEvent|MessageEvent|UpdateEvent}
	 */
	static createEvent(eventData) {
		let event;

		if (eventData.type.indexOf('message:') === 0) {
			event = MessageEvent.deserialize(eventData);
		} else if (eventData.type.indexOf('user:') === 0) {
			event = UserEvent.deserialize(eventData);
		} else {
			event = UpdateEvent.deserialize(eventData);
		}

		return event;
	}

	/**
	 * @return {ObservableArray<AbstractEvent>}
	 */
	getEvents() {
		return this.events;
	}

	/**
	 * Returns the latest message event exchanged in the conversation
	 * @return {MessageEvent|undefined}
	 */
	getLatestTextMessageEvent() {
		return this.events.find(event => event instanceof MessageEvent && event.message.type === TextMessage.TYPE);
	}

	/**
	 * Returns a ConversationSocket for this connection. If `forceNew` is true, returns a new socket
	 * connection.
	 *
	 * @param {boolean} forceNew
	 * @return {ConversationSocket}
	 */
	getSocket(forceNew = false) {
		if (this.socket === null || forceNew) {
			const connector = IoC.make('conversationSocketConnector', { conversation: this });
			this.socket = new ConversationSocket(this, connector);
		}
		return this.socket;
	}

	/**
	 * Calls the server to upload the specified file to the current conversation. Returns a promise
	 * that resolves once the file is uploaded
	 * @param {File} file
	 */
	uploadAttachment(file) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.uploadConversationAttachment(this, file);
	}
}

export default Conversation;
