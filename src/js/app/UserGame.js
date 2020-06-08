/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';
// import moment from 'moment';

/**
 * @property {Game} game
 * @property {Moment} purchaseDate
 */
class UserGame {
	/**
	 * Update internal property from a serialized object data
	 * @param {object} data
	 */
	update(data) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		// this.purchaseDate = moment(data.purchaseDate * 1000);
		this.game = repo.update(data);
	}
}

export default UserGame;
