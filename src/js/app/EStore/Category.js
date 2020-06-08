/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import CategorySection from './CategorySection';

/**
 * @property {string} id
 * @property {string} name
 * @property {Game[]} featuredGames
 * @property {CategorySection[]} sections
 */
class Category {
	featuredGames = [];
	sections = [];

	/**
	 * Updates the attributes of the current category with the data object. If cacheNewGames is true,
	 * the game objects it contains will be cached by the GameRepository.
	 *
	 * @param {object} data
	 * @param {bool} cacheNewGames
	 */
	update(data, cacheNewGames) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		if (data.storeCategories) {
			const featureCategory = data.storeCategories.filter(
				sectionData => sectionData.name.toLowerCase() === 'featured',
			)[0];

			this.featuredGames = repo.update(featureCategory.games, cacheNewGames);

			this.sections = data.storeCategories
				.filter(sectionData => sectionData.name.toLowerCase() !== 'featured')
				.map(sectionData => {
					const section = new CategorySection();
					section.update(sectionData, cacheNewGames);
					return section;
				});
		}
	}

	/**
	 * Creates a Category instance from the data. If cacheGames is true, the game objects will be
	 * cached by the GameRepository.
	 *
	 * @param {object} data
	 * @param {bool} cacheGames
	 * @return {Category}
	 */
	static create(data, cacheGames) {
		const category = new Category();
		category.update(data, cacheGames);
		return category;
	}
}

export default Category;
