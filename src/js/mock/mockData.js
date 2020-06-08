/* eslint-disable no-plusplus */
import merge from 'lodash/merge';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import CreditCard from '../app/ECommerce/CreditCard';
import Order from '../app/ECommerce/Order';

/**
 * Data of the MockServer. This sample file should not be modified. Copy (rename) it and use in your
 * env.dev.js if you use a MockServer. The .gitignore already ignores `mockData.js`, so you should
 * rename this file to this.
 *
 * See the api specification for the attributes of each fields.
 * @see https://app.swaggerhub.com/apis/TJB/TurboPlayAppAPI/1.0.0
 */

const oneDay = 1000 * 60 * 60 * 24;

/**
 * Users
 * @type {User[]}
 */
const allUsers = [
	{
		username: 'VAM',
		name: 'Vince McMullin',
		firstName: 'Vince',
		lastName: 'McMullin',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-5.jpg',
		},
		tokenBalance: '27.27',
		language: 'en',
		motto: 'The truth is out there.',
		status: {
			code: 'online',
			displayText: 'Currently online',
		},
	},
	{
		username: 'Johnny12',
		email: 'johnny12@gmail.com',
		name: 'Stephan Tunison',
		status: {
			code: 'online',
			displayText: 'Playing Destiny',
		},
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar.jpg',
		},
	},
	{
		username: 'Matthew_ts',
		name: 'Gerry Audet',
		status: {
			code: 'online',
			displayText: 'Playing World of Warcraft',
		},
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-2.jpg',
		},
	},
	{
		username: 'JamesShark',
		name: 'Martin Vaquera',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-3.jpg',
		},
	},
	{
		username: 'MarkH',
		name: 'Derick Quinonez',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-4.jpg',
		},
	},
	{
		username: 'Obi180',
		name: 'Alonzo Cobb',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-6.jpg',
		},
	},
	{
		username: 'BB_Bounc3',
		name: 'Donnie Damelio',
		status: {
			code: 'online',
			displayText: 'Online',
		},
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-7.jpg',
		},
	},
	{
		username: 'GGStylez',
		name: 'Melany Bob',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar.jpg',
		},
	},
	{
		username: 'BMX182',
		name: 'Kaye Benningfield',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-2.jpg',
		},
	},
	{
		username: 'F84l1ty',
		name: 'Mirella Schlager',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-3.jpg',
		},
	},
	{
		username: 'Ca$H',
		name: 'Ronna Streets',
		status: {
			code: 'online',
		},
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-4.jpg',
		},
	},
	{
		username: 'MarkyMark',
		name: 'Sharita Vickery',
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-6.jpg',
		},
	},
	{
		username: 'James_cassidy',
		name: 'Josef Oakes',
		status: {
			code: 'online',
			displayText: 'Playing Half-Life 2',
		},
		avatar: {
			url: 'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/user/profile-avatar-7.jpg',
		},
	},
].map((user, index) => {
	if (user.tokenBalance !== undefined) {
		user.tokenBalance = new BigNumber(user.tokenBalance);
	}

	return merge(
		{
			id: `u_${index + 1}`, // 1 is the id of the current user
			username: 'not-set',
			name: '[Not set]',
			avatar: {
				url: null,
			},
			tokenBalance: new BigNumber(0),
			language: 'en',
			motto: 'Make video games great again!',
			status: {
				code: 'offline',
				displayText: 'Offline',
			},
			email: 'aaa@example.com',
		},
		user,
	);
});

const currentUser = allUsers[0];

/**
 * Current user's conversations
 * @type {Conversation[]}
 */
const conversations = [
	{
		users: [allUsers[4]],
		events: {
			entries: [
				{
					type: 'message:sent',
					message: {
						user: allUsers[4],
						content: 'Message 1',
					},
				},
			],
		},
	},
	{
		title: "Let's play!",
		users: [allUsers[2], allUsers[3], allUsers[4], allUsers[5]],
		events: {
			entries: [
				{
					type: 'message:sent',
					message: {
						user: allUsers[2],
						content: 'Message content',
					},
				},
				{
					type: 'user:left',
					user: allUsers[8],
				},
				{
					type: 'user:joined',
					user: allUsers[3],
				},
				{
					type: 'message:sent',
					message: {
						user: allUsers[3],
						content: 'My other message',
					},
				},
				{
					type: 'message:sent',
					message: {
						user: allUsers[3],
						content: 'My other message',
					},
				},
				{
					type: 'message:sent',
					message: {
						user: allUsers[3],
						content: 'My other message',
					},
				},
				{
					type: 'message:sent',
					message: {
						user: allUsers[3],
						content: 'My other message',
					},
				},
				{
					type: 'message:sent',
					message: {
						user: allUsers[0],
						content: 'My message',
					},
				},
				{
					type: 'user:left',
					user: allUsers[3],
				},
			],
		},
	},
].map((data, index) => {
	if (data.events && data.events.entries) {
		data.events.entries.forEach((eventData, eventIndex) => {
			if (eventData.type.indexOf('message:') === 0) {
				const userId = eventData.message.user.id;
				delete eventData.message.user;
				eventData.message = {
					id: `m_${eventIndex + 10000}`,
					ref: null,
					creationDate: Math.round(new Date().getTime() / 1000),
					type: 'text',
					content: '',
					user: { id: userId },
					...eventData.message,
				};
			}

			if (eventData.type.indexOf('user:') === 0) {
				eventData.user = { id: eventData.user.id };
			}

			merge(eventData, {
				id: `e_${eventIndex + 1}`,
				date: Math.round(new Date().getTime() / 1000),
			});
		});
	}

	if (data.users) {
		data.users.push(currentUser);
	}

	return {
		id: `c_${index + 1}`,
		title: null,
		creationDate: Math.round(new Date().getTime() / 1000),
		users: [currentUser],
		isFavorite: false,
		events: [],
		...data,
	};
});

const games = [
	{
		name: 'A Duel Hand Disaster: Trackher',
		onSale: true,
		playCount: 3900000,
		published: true,
		publishedAt: '2019-08-13T16:56:00.000000',
		rating: {
			denominator: 5,
			numerator: 4.2,
			populationSize: 8502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Action',
				},
				{
					title: 'FPS',
				},
				{
					title: 'Puzzle',
				},
			],
			medias: [
				{
					id: '5c597843-b2cd-4332-90e3-e0805e7619cf',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					title: 'A Duel Hand Disaster: Trackher cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '9ed96c92-2f85-446f-bd5b-55056a5af460',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					title: 'A Duel Hand Disaster: Trackher banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(19.99),
			salePrice: new BigNumber(14.99),
		},
		price: new BigNumber(19.99),
		salePrice: new BigNumber(14.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'Galaxy of Pen and Paper',
		onSale: false,
		playCount: 4100000,
		published: true,
		publishedAt: '2019-08-13T16:56:01.243238',
		rating: {
			denominator: 5,
			numerator: 4.3,
			populationSize: 8102306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'RPG',
				},
			],
			medias: [
				{
					id: '9db49007-9b45-4129-9414-ca29277f9e4b',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					title: 'Galaxy of Pen and Paper cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '2cceacba-5d4c-42be-a304-7bad8fc43c32',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					title: 'Galaxy of Pen and Paper banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: true,
	},
	{
		name: 'Mutant Football League',
		onSale: false,
		playCount: 200000,
		published: true,
		publishedAt: '2019-08-13T16:56:02.739853',
		rating: {
			denominator: 5,
			numerator: 4.1,
			populationSize: 9502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Stealth Shooter',
				},
			],
			medias: [
				{
					id: '0e349a99-a773-4fa1-821f-2f54ae36171c',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					title: 'Mutant Football League cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '4d4f76d1-b4c5-4490-885f-aeb6317d3f94',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					title: 'Mutant Football League banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'One: Sample game',
		onSale: true,
		playCount: 3900000,
		published: true,
		publishedAt: '2019-08-13T16:56:00.000000',
		rating: {
			denominator: 5,
			numerator: 4.2,
			populationSize: 8502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Action',
				},
				{
					title: 'FPS',
				},
				{
					title: 'Puzzle',
				},
			],
			medias: [
				{
					id: '5c597843-b2cd-4332-90e3-e0805e7619cf',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					title: 'A Duel Hand Disaster: Trackher cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '9ed96c92-2f85-446f-bd5b-55056a5af460',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					title: 'A Duel Hand Disaster: Trackher banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(19.99),
			salePrice: new BigNumber(14.99),
		},
		price: new BigNumber(19.99),
		salePrice: new BigNumber(14.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'Two: Sample game',
		onSale: false,
		playCount: 4100000,
		published: true,
		publishedAt: '2019-08-13T16:56:01.243238',
		rating: {
			denominator: 5,
			numerator: 4.3,
			populationSize: 8102306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'RPG',
				},
			],
			medias: [
				{
					id: '9db49007-9b45-4129-9414-ca29277f9e4b',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					title: 'Galaxy of Pen and Paper cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '2cceacba-5d4c-42be-a304-7bad8fc43c32',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					title: 'Galaxy of Pen and Paper banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: true,
	},
	{
		name: 'Three: Sample game',
		onSale: false,
		playCount: 200000,
		published: true,
		publishedAt: '2019-08-13T16:56:02.739853',
		rating: {
			denominator: 5,
			numerator: 4.1,
			populationSize: 9502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Stealth Shooter',
				},
			],
			medias: [
				{
					id: '0e349a99-a773-4fa1-821f-2f54ae36171c',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					title: 'Mutant Football League cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '4d4f76d1-b4c5-4490-885f-aeb6317d3f94',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					title: 'Mutant Football League banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'Four: Sample game',
		onSale: false,
		playCount: 200000,
		published: true,
		publishedAt: '2019-08-13T16:56:02.739853',
		rating: {
			denominator: 5,
			numerator: 4.1,
			populationSize: 9502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Stealth Shooter',
				},
			],
			medias: [
				{
					id: '0e349a99-a773-4fa1-821f-2f54ae36171c',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/0e349a99-a773-4fa1-821f-2f54ae36171c_thumb.png',
					title: 'Mutant Football League cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '4d4f76d1-b4c5-4490-885f-aeb6317d3f94',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/4d4f76d1-b4c5-4490-885f-aeb6317d3f94_thumb.png',
					title: 'Mutant Football League banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'Five: Sample game',
		onSale: true,
		playCount: 3900000,
		published: true,
		publishedAt: '2019-08-13T16:56:00.000000',
		rating: {
			denominator: 5,
			numerator: 4.2,
			populationSize: 8502306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'Action',
				},
				{
					title: 'FPS',
				},
				{
					title: 'Puzzle',
				},
			],
			medias: [
				{
					id: '5c597843-b2cd-4332-90e3-e0805e7619cf',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/5c597843-b2cd-4332-90e3-e0805e7619cf_thumb.png',
					title: 'A Duel Hand Disaster: Trackher cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '9ed96c92-2f85-446f-bd5b-55056a5af460',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9ed96c92-2f85-446f-bd5b-55056a5af460_thumb.png',
					title: 'A Duel Hand Disaster: Trackher banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(19.99),
			salePrice: new BigNumber(14.99),
		},
		price: new BigNumber(19.99),
		salePrice: new BigNumber(14.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: false,
	},
	{
		name: 'Six: Sample game',
		onSale: false,
		playCount: 4100000,
		published: true,
		publishedAt: '2019-08-13T16:56:01.243238',
		rating: {
			denominator: 5,
			numerator: 4.3,
			populationSize: 8102306,
		},
		shopDetails: {
			gameCategories: [
				{
					title: 'RPG',
				},
			],
			medias: [
				{
					id: '9db49007-9b45-4129-9414-ca29277f9e4b',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
					title: 'Galaxy of Pen and Paper cover image',
					type: {
						name: 'cover',
					},
				},
				{
					id: '2cceacba-5d4c-42be-a304-7bad8fc43c32',
					thumb:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					thumbSmall:
						'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
					title: 'Galaxy of Pen and Paper banner image',
					type: {
						name: 'banner',
					},
				},
			],
			price: new BigNumber(24.99),
			salePrice: null,
		},
		price: new BigNumber(24.99),
		studio: {
			name: 'Studio 1',
		},
		userDownloaded: false,
		userPurchased: true,
	},
].map((data, index) =>
	merge(
		{
			id: `g_${index + 1}`,
			name: '[No name]',
			onSale: false,
			playCount: 4100000,
			published: true,
			publishedAt: '2019-08-13T16:56:01.243238',
			rating: {
				denominator: 5,
				numerator: 4.3,
				populationSize: 8102306,
			},
			shopDetails: {
				gameCategories: [
					{
						title: 'RPG',
					},
				],
				medias: [
					{
						id: '9db49007-9b45-4129-9414-ca29277f9e4b',
						thumb:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
						thumbSmall:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
						title: 'Galaxy of Pen and Paper cover image',
						type: {
							name: 'cover',
						},
					},
					{
						id: '2cceacba-5d4c-42be-a304-7bad8fc43c32',
						thumb:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
						thumbSmall:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/2cceacba-5d4c-42be-a304-7bad8fc43c32_thumb.png',
						title: 'Galaxy of Pen and Paper banner image',
						type: {
							name: 'banner',
						},
					},
				],
				covers: [
					{
						id: '9db49007-9b45-4129-9414-ca29277f9e4b',
						thumb:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
						thumbSmall:
							'https://turboplay-media.s3.amazonaws.com/uploads/game_media/9db49007-9b45-4129-9414-ca29277f9e4b_thumb.png',
						title: 'Galaxy of Pen and Paper cover image',
						type: {
							name: 'cover',
						},
					},
				],
				price: new BigNumber(24.99),
				salePrice: null,
			},
			price: new BigNumber(24.99),
			salePrice: null,
			studio: {
				name: 'Studio 1',
			},
			userDownloaded: false,
			userPurchased: true,
		},
		data,
	),
);

const userGames = [
	{
		game: games[0],
		purchaseDate: Math.round((new Date().getTime() - 20 * oneDay) / 1000),
	},
	{
		game: games[1],
		purchaseDate: Math.round((new Date().getTime() - 20 * oneDay) / 1000),
	},
	{
		game: games[2],
		purchaseDate: Math.round((new Date().getTime() - 1000 * 60 * 5) / 1000),
	},
	{
		game: games[3],
	},
].map(data => ({
	purchaseDate: Math.round((new Date().getTime() - 2 * oneDay) / 1000),
	...data,
}));

const receivedRequests = [allUsers[5], allUsers[6]].map((user, index) => ({
	id: `frr_${index + 1}`,
	date: moment(Math.round(new Date().getTime())),
	user,
}));

const sentRequests = [allUsers[7]].map((user, index) => ({
	id: `frs_${index + 1}`,
	date: moment(Math.round(new Date().getTime())),
	user,
}));

const cart = {
	id: 'mock-cart',
	items: [
		{
			game: games[4],
		},
		{
			game: games[7],
		},
	].map((itemData, index) => ({
		id: `ci_${index}`,
		...itemData,
	})),
};

const storeCategories = [
	{
		name: 'Featured',
		sortLatest: true,
		sortMostPlayed: false,
		sortTopRated: true,
		games: [games[1], games[2], games[3]],
	},
	{
		name: 'Top Games',
		sortLatest: true,
		sortMostPlayed: true,
		sortTopRated: false,
		games: [games[4], games[5], games[6]],
	},
	{
		name: 'Trending',
		sortLatest: true,
		sortMostPlayed: true,
		sortTopRated: false,
		games: [games[2], games[7], games[4]],
	},
].map((data, index) => ({
	id: `sc_${index}`,
	...data,
}));

const card = new CreditCard();
card.update({
	id: 'sample-card-id',
	last4: '6789',
});

const orders = [
	{
		status: Order.STATUS.COMPLETED,
		items: [
			{
				id: 'item_1',
				price: new BigNumber(10),
				game: games[0],
				qty: 1,
			},
			{
				id: 'item_2',
				price: new BigNumber(2.34),
				game: games[1],
				qty: 1,
			},
		],
		total: new BigNumber(12.34),
	},
].map((data, index) => {
	const order = new Order();
	order.update(
		merge(
			{
				id: `ord_${index}`,
				number: `sample-${index}`,
				status: Order.STATUS.COMPLETED,
				paymentStatus: 'success',
				paymentStatusUpdatedAt: '2019-08-24',
				items: [],
				total: new BigNumber(0),
			},
			data,
		),
	);
	return order;
});

const paymentMethods = [card];

export default {
	currentUser,
	users: allUsers,
	friends: [allUsers[1], allUsers[2], allUsers[3], allUsers[4]],
	conversations,
	receivedRequests,
	sentRequests,
	games,
	userGames,
	cart,
	storeCategories,
	paymentMethods,
	orders,
};
