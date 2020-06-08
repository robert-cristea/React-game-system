import { observable } from 'mobx';
import MockObject from './MockObject';

let counter = 0;

const games = [
	{
		id: '41d636d4-40bf-4875-bf65-0e0f257f29e5',
		name: 'Deus Ex: Mankind Divided',
		publisher: 'Feral Interactive',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/deus-ex-mankind/activity.jpg',
				},
			],
		},
	},
	{
		id: '28842418-a756-4f8f-9202-e4eea78e9dc9',
		name: 'FIFA 18',
		publisher: 'Feral Interactive',
		medias: {
			activity: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fifa-18/activity.jpg',
				},
			],
		},
	},
	{
		id: '4f9432aa-6969-486c-932c-92eb49187943',
		name: 'Batman: Arkham City',
		publisher: 'Feral Interactive',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/batman-arkham-city/activity.jpg',
				},
			],
		},
	},
	{
		id: 'e33babfa-22bc-457d-954e-e1ef446a3a3e',
		name: 'StarCraft 2',
		publisher: 'Havok',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/starcraft-2/activity.jpg',
				},
			],
		},
	},
	{
		// 4
		id: '118518ea-a774-4b47-8b1e-ca65d9fd5b63',
		name: 'Destiny: Rise of Iron',
		publisher: 'Bungie',
		medias: {
			activity: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/destiny/activity.jpg',
				},
			],
		},
	},
	{
		id: '62082dfe-4f09-4124-8ba9-89f2c94e2ed1',
		name: 'DragonBall Raging Blast 3',
		publisher: 'RocketLeague',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dragon-ball-raging-blast/activity.jpg',
				},
			],
		},
	},
	{
		id: 'ee19746f-3fd2-4db6-b2af-4bece92c5010',
		name: 'Half Life 2',
		publisher: 'Valve',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/half-life-2/activity.jpg',
				},
			],
		},
	},
	{
		id: '9a166759-22a7-4eb7-8160-8bfe7da78d3d',
		name: 'Dota 2',
		publisher: 'Valve',
		medias: {
			activity: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/trailer-1.mp4',
					poster: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/trailer-2.mp4',
					poster: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/dota-2/activity.jpg',
				},
			],
		},
	},
	{
		// 8
		id: '67758c62-48f1-4076-8042-a6c2d7412a55',
		name: 'Resident Evil 6',
		publisher: 'Capcom',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-2/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/resident-evil-6/activity.jpg',
				},
			],
		},
	},
	{
		id: '2a63a1c7-345b-4920-be4d-f8c6dd3335f1',
		name: "PlayerUnknown's Battlegrounds",
		publisher: 'PUBG',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/activity.jpg',
			cover:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/cover.jpg',
			store:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/playerunknown-battleground/activity.jpg',
				},
			],
		},
	},
	{
		id: 'd98675e8-b8dc-4317-97e2-89e411623430',
		name: 'Hurtworld',
		publisher: 'Bankroll Studios',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/hurtworld/activity.jpg',
				},
			],
		},
	},
	{
		id: '65469050-d255-4351-9abf-18f619b9c7d7',
		name: 'Halo 5',
		publisher: '343 Industries',
		medias: {
			activity: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/trailer-1.mp4',
					poster: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/trailer-2.mp4',
					poster: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/halo-5/activity.jpg',
				},
			],
		},
	},
	{
		// 12
		id: '22e53985-69aa-4a2f-a345-4922506a4f53',
		name: 'Fallout 4',
		publisher: '343 Industries',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/activity.jpg',
				},
			],
		},
	},
	{
		id: '36247546-c346-49bb-b21d-c860e47c51fd',
		name: 'Call of Duty 4',
		publisher: '343 Industries',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/call-of-duty/activity.jpg',
				},
			],
		},
	},
	{
		id: '139baf96-0357-4ae1-8ca1-27a878f67965',
		name: 'Day of Defeat',
		publisher: '343 Industries',
		medias: {
			activity:
				'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/activity.jpg',
			cover: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/cover.jpg',
			store: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/trailer-1.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/trailer-2.mp4',
					poster:
						'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/day-of-defeat/activity.jpg',
				},
			],
		},
	},
].map(
	game =>
		new MockObject({
			// eslint-disable-next-line no-plusplus
			id: `${counter++}`,
			tokensEarned: 38500000,
			numberOfRatings: 8200000,
			rating: 4,
			description: `
	<p>PLAYERUNKNOWN'S BATTLEGROUNDS is a last-man-standing shooter being developed with community feedback. Starting with nothing, players must fight to locate weapons and supplies in a battle to be the lone survivor. This realistic, high tension game is set on a massive 8x8 km island with a level of detail that showcases Unreal Engine 4's capabilities.</p>

	<p>PLAYERUNKNOWN aka Brendan Greene, is a pioneer of the Battle Royale genre. As the creator of the Battle Royale game-mode found in the ARMA series and H1Z1 : King of the Kill, Greene is co-developing the game with veteran team at Bluehole to create the most diverse and robust Battle Royale experience to date.</p>
	`,
			nbLikes: 825,
			nbCommunities: 2600,
			nbStreaming: 123,
			nbVideos: 5000,
			nbCaptures: 228,
			tokenPrice: 250,
			platform: 'PC',
			// observable primitive, so use isCurrentUserFavourite.get() and isCurrentUserFavourite.set()
			isCurrentUserFavourite: observable(false),
			...game,
		}),
);

export default games;

export function getGameById(id) {
	return games.find(game => game.id === id);
}
