import merge from 'lodash/merge';
import omit from 'lodash/omit';
import IoC from '@aedart/js-ioc/index';

/**
 * @property {string} id
 * @property {User} user
 * @property {Moment} date
 */
class FriendRequest {
	/**
	 * Update the attributes of this FriendRequest with the supplied data object. Also updates the
	 * user object it contains.
	 *
	 * @param {object} data
	 */
	update(data) {
		const updateData = omit(data, ['user']);
		merge(this, updateData);

		if (data.user) {
			/** @type {UserRepository} */
			const repo = IoC.make('userRepository');
			this.user = repo.update([data.user])[0];
		}
	}
}

export default FriendRequest;
