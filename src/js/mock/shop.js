/* eslint-disable no-plusplus */
import { computed, observable } from 'mobx';
import MockObject from './MockObject';
import sampleGames from './sampleGames';

let counter = 0;

class Cart extends MockObject {
	/**
	 * @type {Array}
	 */
	@observable
	items = [];

	@computed
	get total() {
		return this.items.reduce((total, item) => total + (item.type === 'game' ? item.game.tokenPrice : item.amount), 0);
	}
}

export function createGameItem(game) {
	return new MockObject({
		id: `${counter++}`,
		type: 'game',
		game,
	});
}

export function createTokenItem(amount) {
	return new MockObject({
		id: `${counter++}`,
		type: 'token',
		amount,
	});
}

export const indexGames = {
	featured: [sampleGames[11], sampleGames[10], sampleGames[9], sampleGames[8]],
	latestGames: [sampleGames[9], sampleGames[8]],
	latestContent: [sampleGames[7], sampleGames[8], sampleGames[9], sampleGames[6]],
};

const subCategoryGames = [
	sampleGames[2],
	sampleGames[4],
	sampleGames[11],
	sampleGames[10],
	sampleGames[7],
	sampleGames[8],
];

export const categories = [
	{
		id: 'windows',
		icon: 'windows',
		title: 'PC',
		categories: [
			{ id: 'indie', title: 'Indie Games', games: subCategoryGames },
			{ id: 'scifi', title: 'Sci-fi Games', games: subCategoryGames },
			{ id: 'mobile', title: 'Mobile Games', games: subCategoryGames },
			{ id: 'fp2', title: 'FP2 Games', games: subCategoryGames },
			{ id: 'action', title: 'Action Games', games: subCategoryGames },
		],
	},
	{
		id: 'ios',
		icon: 'apple',
		title: 'iOS',
		categories: [
			{ id: 'scifi', title: 'Sci-fi Games', games: subCategoryGames },
			{ id: 'fp2', title: 'FP2 Games', games: subCategoryGames },
			{ id: 'indie', title: 'Indie Games', games: subCategoryGames },
			{ id: 'mobile', title: 'Mobile Games', games: subCategoryGames },
			{ id: 'action', title: 'Action Games', games: subCategoryGames },
		],
	},
	{
		id: 'android',
		icon: 'android',
		title: 'Android',
		categories: [
			{ id: 'action', title: 'Action Games', games: subCategoryGames },
			{ id: 'mobile', title: 'Mobile Games', games: subCategoryGames },
			{ id: 'indie', title: 'Indie Games', games: subCategoryGames },
			{ id: 'fp2', title: 'FP2 Games', games: subCategoryGames },
			{ id: 'scifi', title: 'Sci-fi Games', games: subCategoryGames },
		],
	},
].map(data => new MockObject(data));

const cartInstance = new Cart();

cartInstance.items.push(createGameItem(sampleGames[0]));
cartInstance.items.push(createGameItem(sampleGames[3]));
cartInstance.items.push(createTokenItem(250));

export const cart = cartInstance;
