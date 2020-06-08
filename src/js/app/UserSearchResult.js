/** @type {IoC} */
import IoC from '@aedart/js-ioc';

/**
 * @property {{page: number, hasNext: boolean}} pagination
 * @property {User[]} users
 */
class UserSearchResult {
	/**
	 * @type {User[]}
	 */
	users = [];

	/**
	 * True if this search result is not the last page
	 * @type {boolean}
	 */
	hasMore = false;

	/**
	 * Updates this instance with the serialized `data` object. If `cacheNewUsers` is true, new
	 * users will be cached in the UserRepository.
	 *
	 * @param {object} data
	 * @param {boolean} cacheNewUsers
	 */
	updateUsers(data, cacheNewUsers = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');

		// We get User objects from the serialized `data.users`
		if (data) {
			this.users = repo.update(data, cacheNewUsers);
		}
	}
}

export default UserSearchResult;
