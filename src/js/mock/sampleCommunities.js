/* eslint-disable no-plusplus */
import sampleSize from 'lodash/sampleSize';
import sample from 'lodash/sample';
import MockObject from './MockObject';
import randomConversationHistory from './randomConversationHistory';
import sampleUsers from './sampleUsers';

let counter = 0;

const communities = [
	{
		name: 'Stellar Official Community',
		nbMembers: 10853,
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/stellar-community/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/stellar-community/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/stellar-community/store.jpg',
		},
	},
	{
		name: 'Fallout Community',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fallout-4/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fallout-4/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fallout-4/store.jpg',
		},
	},
	{
		name: 'Bitcoin Community',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/bitcoin/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/bitcoin/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/bitcoin/store.jpg',
		},
	},
	{
		name: 'Overwatch Group',
		nbMembers: 4543,
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/overwatch/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/overwatch/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/overwatch/store.jpg',
		},
	},
	{
		name: 'FIFA 18 Group',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fifa-18/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fifa-18/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/fifa-18/store.jpg',
		},
	},
	{
		name: 'Halo 5',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/halo-5/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/halo-5/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/community/halo-5/store.jpg',
		},
	},
].map(
	community =>
		new MockObject({
			id: `${counter++}`,
			nbMembers: 2135,
			language: 'English',
			description: 'Red vs Blue',
			conversation: randomConversationHistory(sample(sampleUsers), sampleSize(sampleUsers, 3), counter),
			playing: sampleSize(sampleUsers, 5),
			members: [...sampleUsers],
			...community,
		}),
);

export default communities;

export function findCommunityById(id) {
	return communities.find(community => community.id === id);
}
