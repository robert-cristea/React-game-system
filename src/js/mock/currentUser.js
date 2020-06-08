/* eslint-disable no-plusplus */
import { observable } from 'mobx';
import MockObject from './MockObject';
import sampleGames from './sampleGames';
import { cart } from './shop';
import sampleUsers from './sampleUsers';
import sampleCommunities from './sampleCommunities';

let counter = 0;

const invitations = [sampleUsers[1], sampleUsers[2]].map(
	user =>
		new MockObject({
			user,
			id: `${counter++}`,
		}),
);

const subscriptions = [
	{ role: 'Member', community: sampleCommunities[0] },
	{ role: 'Owner', community: sampleCommunities[1] },
].map(
	community =>
		new MockObject({
			...community,
			id: `${counter++}`,
		}),
);

const trophies = [
	{ game: sampleGames[12], won: 0.34 },
	{ game: sampleGames[13], won: 0.91 },
	{ game: sampleGames[14], won: 0.63 },
].map(
	trophy =>
		new MockObject({
			...trophy,
			id: `${counter++}`,
		}),
);

const data = {
	id: 'currentUser',
	username: 'RaptorRage',
	displayName: 'Jason Blake',
	language: 'en',
	motto: 'Make Video games great again!',
	games: sampleGames.map(
		game =>
			new MockObject({
				id: `${counter++}`,
				nbFriends: 8,
				game,
			}),
	),
	cart,
	tokenBalance: 25200,
	friends: [...sampleUsers],
	avatar: {
		url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-5.jpg',
	},
	invitations: observable(invitations),
	subscriptions: observable(subscriptions),
	trophies,
};

export default new MockObject(data);

export function isSubscribed(community) {
	return !!data.subscriptions.find(s => s.community === community);
}

export function subscribe(community, role = 'Member') {
	data.subscriptions.push(
		new MockObject({
			id: `${counter++}`,
			role,
			community,
		}),
	);
}

export function unsubscribe(community) {
	const subscription = data.subscriptions.find(s => s.community === community);

	if (subscription) {
		data.subscriptions.remove(subscription);
	}
}
