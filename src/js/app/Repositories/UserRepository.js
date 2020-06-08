/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import User from '../User';
import UserSearchResult from '../UserSearchResult';

class UserRepository {
	/**
	 * @protected
	 * @type {Map<string, User>}
	 */
	users = new Map();

	/**
	 * Signs up (creates) and new user. Returns a promise when successfully created. The Promise
	 * does not contain the created user. Log in to retrieve it.
	 *
	 * @param {Object} user
	 * @return {Promise<User>}
	 */
	signup(user) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.signup(user);
	}

	/**
	 * Loads a specific user from the server by its id.  Returns a
	 * Promise that resolves with the User instance. The user will be filled with the
	 * specified `attributes`. If `cacheNew` is false, the loaded user will not be cached if it is
	 * not already cached. This method always load from the server, even if the user is cached.
	 *
	 * @param {string} id
	 * @param {string[]} attributes
	 * @param {boolean} cacheNew
	 * @return {Promise<User>}
	 */
	load(id, attributes, cacheNew = true) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server
			.getUsers([id], attributes)
			.then(data => (data.entries.length ? this.update(data.entries[0], cacheNew) : null));
	}

	/**
	 * From an array of serialized user objects, update the internal user list. If a user already
	 * exists, it will be updated, else a new user will be created. The list of updated user
	 * instances will be returned in the same order. `data` can also be a single serialized user
	 * object; in that case, the updated user will be returned. If `cacheNew` is false, new user
	 * objects will not be cached internally. Already cached users will be updated though.
	 *
	 * @param {Array<Object>|Object} data
	 * @param {boolean} cacheNew
	 * @return {User[]|User}
	 */
	update(data, cacheNew = true) {
		if (!Array.isArray(data)) {
			return this.update([data])[0];
		}

		const updated = [];

		data.forEach(userData => {
			const id = userData.id;
			const isNewUser = !this.users.has(id);
			/** @type {User} */
			const user = isNewUser ? new User() : this.users.get(id);

			if (isNewUser && cacheNew === true) {
				this.users.set(id, user);
			}

			user.update(userData);
			updated.push(user);
		});

		return updated;
	}

	/**
	 * Fills all the specified users with the requested attributes. If one or more user don't have
	 * all the attributes, the server is used to get the missing attributes. Returns promise that
	 * resolves with the user instances when they are all filled.
	 * @param {User[]} users
	 * @param {string[]} attributes
	 * @param {boolean} forceReload
	 * @return {Promise<User[]>}
	 */
	fill(users, attributes, forceReload = false) {
		const incomplete = forceReload ? users : users.filter(user => !user.hasAttributes(attributes));
		/** @type {AbstractServer} */
		const server = IoC.make('server');

		// All users have the requested attributes
		if (!incomplete.length) {
			return Promise.resolve(users);
		}

		const incompleteIds = incomplete.map(user => user.id);

		return server.getUsers(incompleteIds, attributes).then(data => this.update(data.entries));
	}

	/**
	 * Retrieves from the list of already loaded users the one with the specified id. Returns null
	 * if not found.
	 *
	 * @param {string} id
	 * @return {User|null}
	 */
	retrieve(id) {
		return this.users.has(id) ? this.users.get(id) : null;
	}

	/**
	 * Searches on the server for user with the specified query. Returned users will be filled with
	 * the specified attributes. If `cacheNew` is false, returned users will not be cached. Returns
	 * a Promise that resolves with a UserSearchResult.
	 *
	 * @param {string} query
	 * @param {string[]} attributes
	 * @param {number} page Page number
	 * @param {number} pageSize
	 * @param {boolean} cacheNew
	 * @return {Promise<UserSearchResult>}
	 */
	search(query, attributes, page = 1, pageSize = 10, cacheNew = false) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.searchUsers(query, attributes, page, pageSize).then(({ entries, hasMore }) => {
			const result = new UserSearchResult();
			result.updateUsers(entries, cacheNew);
			result.hasMore = hasMore;
			return result;
		});
	}

	/**
	 * Clear the UserRepository. Called during `logout`.
	 */
	clear() {
		this.users.clear();
	}
}

export default UserRepository;
