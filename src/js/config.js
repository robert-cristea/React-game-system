import ApiServer from './app/Server/ApiServer';
import Authentication from './app/Authentication';
import UserRepository from './app/Repositories/UserRepository';
import AppLoader from './app/AppLoader';
import ConversationRepository from './app/Repositories/ConversationRepository';
import PhoenixConversationSocketConnector from './app/Server/SocketConnector/PhoenixConversationSocketConnector';
import ReceivedFriendRequestRepository from './app/Repositories/ReceivedFriendRequestRepository';
import SentFriendRequestRepository from './app/Repositories/SentFriendRequestRepository';
import GameRepository from './app/Repositories/GameRepository';
import OrderRepository from './app/Repositories/OrderRepository';
import Store from './app/EStore/Store';
import PhoenixUserUpdatesSocketConnector from './app/Server/SocketConnector/PhoenixUserUpdatesSocketConnector';
import UserUpdatesSocket from './app/Server/UserUpdatesSocket';
import NotificationsLiveUpdater from './app/NotificationsLiveUpdater';
import NotificationRepository from './app/Repositories/NotificationsRepository';
import UserDataLiveUpdater from './app/UserDataLiveUpdater';
import { fromStructureToArray } from './app/utils';
import DownloadManager from '../brwc/DownloadManager';
import PhoenixSocketCreator from './app/Server/PhoenixSocketCreator';
import ToastManager from './app/ToastManager';
import ConfirmDialog from './app/ConfirmDialog';
import Paymentwall from './app/Server/Paymentwall/Paymentwall';

const ONE_DAY = 1000 * 60 * 60 * 24;

// http://emailregex.com/
// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Comment about attributes definitions:
 * ===
 * Attribute lists are arrays of attribute names (string). Multilevel attributes
 * are supported. For example, a list of attributes to get the current user's username and her
 * friends' username would be:
 *
 * ['id', 'username', 'friends.id', 'friends.name']
 *
 * But attribute lists with a lot of levels may become confusing, so an utility function
 * (fromStructureToArray) allows you to define the attributes as a GraphQL structure (easier to read
 * and create) and converts the string to the equivalent array. The previous example would be:
 *
 * fromStructureToArray(`
 *   id,
 *   username,
 *   friends {
 *     id,
 *     username
 *   }
 * `)
 *
 * But don't forget, in the end, the list of attributes is simply an array. You *don't* have to use
 * `fromStructureToArray`, you can use simple arrays of attribute names. It's only there to make
 * this file easier to understand. The function is not used when it would not make the code easier
 * to understand, to prevent extra calculations.
 *
 * Don't forget ids!
 * ===
 * When querying attributes for an object that can be cached (like a user [current user, friend,
 * owner of conversation, etc], a game, a friend request,
 * ... -- look in js/app/Repositosies), don't forget to request the id, else the caching will not
 * recognize the object and might create a duplicate.
 *
 * Example for a query requesting the current user's games and friends:
 *
 * fromStructureToArray(`
 *   id,
 *   friends {
 *     id,
 *     username
 *   },
 *   games {
 *     id,
 *     name
 *   }
 * `)
 */

/**
 * Configuration object shared by all environments. See documentation to redefine some config per environment.
 */
export default {
	server: {
		/**
		 * ApiServer configuration
		 */
		api: {
			// GraphQL Api URL
			graphqlUrl: 'https://example.com/api/1.0.0/graphql',
			// Legacy Api URL
			baseUrl: 'https://example.com/api/1.0.0',
			oauthAppID: '12345',
			// If true, all server errors will be logged in the console
			logErrors: false,
			// If true, authentication info will be saved locally and reloaded at next startup
			// (allows to automatically relogin the user, else the user must re-authenticate at each
			// startup)
			saveAuthentication: true,
		},
	},

	paymentwall: {
		// Url where to send Paymentwall requests
		url: 'https://www.example.com',
		// Public key for Paymentwall
		publicKey: '123abc',
	},

	phoenixSocket: {
		path: 'wss://example.com/socket',
		logEnabled: false,
	},

	auth: {
		user: {
			/**
			 * Base set of attributes to load for the current user.
			 */
			baseAttributes: ['id', 'email', 'avatar', 'status', 'username', 'tokenBalance'],
		},
		maxRestorePasswordAttempts: 5,
		emailRegex: EMAIL_REGEX,
	},

	userGames: {
		// UserGame with a purchase date no older that the following will be flagged as "New"
		newMaxAge: ONE_DAY * 5,
	},

	conversations: {
		// When the user starts typing, it sends a "[User] is typing" event to the other users. When
		// the user stops typing and doesn't send his/her message, the "[User] stopped typing" event
		// will be sent after the following delay (in milliseconds).
		typingStopTimeout: 5000,
		// Number of events to load at a time when scrolling back in time
		pageSize: 20,
	},

	friends: {
		search: {
			// Number of users to load at a time when search in Friends
			pageSize: 20,
		},
	},

	// Centralized list of required game attributes
	gameAttributes: {
		// Cart
		// Note: see "Comment about attributes definitions" at the top of this file
		cart: fromStructureToArray(`
			id,
			name,
			onSale,
			price,
			salePrice,
			studio { name },
			shopDetails: shopDetailsCurrentLive {
				covers {
					id,
					thumbSmall
				}
			}
		`),

		// My Games Page
		// Note: see "Comment about attributes definitions" at the top of this file
		userGames: fromStructureToArray(`
			id,
			name,
			userDownloaded,
			shopDetails: shopDetailsCurrentLive {
				covers {
					id,
					title,
					thumb,
					type { id, name }
				},
				package {
					id,
					externalId,
					installSize,
					defaultDest
				},
				gameCategories {
					id,
					title
				}
			}
		`),

		// Store Page
		// Note: see "Comment about attributes definitions" at the top of this file
		store: auth =>
			fromStructureToArray(`
			id,
			name,
			sortLatest,
			sortTopRated,
			sortMostPlayed,
			games {
				id,
				name,
				onSale,
				price,
				salePrice,
				playCount,
				published,
				publishedAt,
				studio { name },
				${auth ? 'userPurchased, userDownloaded,' : ''}
				rating {
					denominator,
					numerator,
					populationSize
				},
				shopDetails: shopDetailsCurrentLive {
					gameCategories { title },
					medias {
						id,
						title,
						thumbSmall,
						type { name }
					}
				}
			}
		`),

		// Store Page
		// Note: see "Comment about attributes definitions" at the top of this file
		search: auth =>
			fromStructureToArray(`
			id,
			name,
			onSale,
			price,
			salePrice,
			playCount,
			published,
			publishedAt,
			studio { name },
			${auth ? 'userPurchased, userDownloaded,' : ''}
			rating {
				denominator,
				numerator,
				populationSize
			},
			shopDetails: shopDetailsCurrentLive {
				gameCategories { title },
				medias {
					id,
					title,
					thumbSmall,
					type { name }
				}
			}
		`),

		// Launch Game Page
		// Note: see "Comment about attributes definitions" at the top of this file
		launch: fromStructureToArray(`
			id,
			name,
			shopDetails: shopDetailsCurrentLive {
				banners {
					thumb,
					type { name }
				}
			}
		`),

		// Game Details Page
		// Note: see "Comment about attributes definitions" at the top of this file
		details: auth =>
			fromStructureToArray(`
			id,
			name,
			onSale,
			price,
			salePrice,
			published,
			${auth ? 'userPurchased, userDownloaded,' : ''}
			rating {
				denominator,
				numerator,
				populationSize
			},
			shopDetails: shopDetailsCurrentLive {
				shortDescription,
				longDescription,
				medias {
					id,
					title,
					src,
					thumb,
					type { name }
				},
				gameCategories { title },
			}
		`),
	},

	// Centralized list of required Order attributes
	orderAttributes: {
		// Purchase History Page
		// Note: see "Comment about attributes definitions" at the top of this file
		history: fromStructureToArray(`
			id,
			type,
			number,
			total,
			insertedAt,
			items {
				id,
				game {
					id,
					name
				}
			}
		`),

		// Order Details Modal
		// Note: see "Comment about attributes definitions" at the top of this file
		details: fromStructureToArray(`
			id,
			type,
			number,
			total,
			status,
			insertedAt,
			refundable,
			paymentStatus,
			paymentStatusUpdatedAt,
			paymentMethod {
				id,
				creditCard {
					id,
					type,
					firstName,
					lastName,
					last4,
					expMonth,
					expYear
				},
				billingAddress {
					id,
					address1,
					address2,
					city,
					country,
					state,
					zipcode
				}
			},
			items {
				id,
				price,
				status,
				game {
					id,
					name,
					shopDetails: shopDetailsCurrentLive {
						covers { thumbSmall }
					}
				}
			}
		`),

		// Single order
		// Note: see "Comment about attributes definitions" at the top of this file
		view: fromStructureToArray(`
			id,
			type,
			number,
			total,
			status,
			insertedAt,
			paymentStatus,
			paymentStatusUpdatedAt,
			items {
				id,
				price,
				status,
				game {
					id,
					name
				}
			}
		`),
	},

	// Centralized list of required user attributes
	userAttributes: {
		userPreview: ['id', 'username', 'avatar', 'status'],
		notification: ['id', 'username', 'avatar'],
		balance: ['id', 'tokenBalance'],
		// The "Search new friends" user list
		search: ['id', 'avatar', 'username', 'status'],
		conversations: {
			// The "New conversation" screen, listing the friends
			new: ['id', 'username', 'status', 'avatar'],
			// Conversations list
			list: ['id', 'email', 'name', 'username', 'status', 'avatar'],
			userEvent: ['id', 'username'],
			view: ['id', 'name', 'avatar'],
		},
		friendsList: ['id', 'username', 'status', 'avatar'],
		// The user profile modal
		details: {
			user: ['id', 'email', 'status', 'avatar', 'username', 'tokenBalance'],
			friends: ['id', 'avatar'],
		},
		profilePreview: {
			currentUser: ['id', 'username', 'avatar', 'ewallet', 'tokenBalance'],
			otherUser: ['id', 'username', 'avatar', 'tokenBalance'],
		},
	},

	/**
	 * Services to register in the service container (IoC). Key is the service name, value is a
	 * service register function which will receive the IoC instance and the service name (same as
	 * key). The `name` attribute received by the function is exactly the key of the object, so you
	 * might wonder why `services` is not an array. It is because with an object, a specific service
	 * register function can be overwritten in `env.dev.js`
	 * @see serviceRegisterFunction below
	 * @type {Object.<string, serviceRegisterFunction>}
	 */
	services: {
		server: (ioc, name) => {
			ioc.singleton(name, () => new ApiServer());
		},
		userRepository: (ioc, name) => {
			ioc.singleton(name, () => new UserRepository());
		},
		gameRepository: (ioc, name) => {
			ioc.singleton(name, () => new GameRepository());
		},
		orderRepository: (ioc, name) => {
			ioc.singleton(name, () => new OrderRepository());
		},
		conversationRepository: (ioc, name) => {
			ioc.singleton(name, () => new ConversationRepository());
		},
		receivedFriendRequestRepository: (ioc, name) => {
			ioc.singleton(name, () => new ReceivedFriendRequestRepository());
		},
		sentFriendRequestRepository: (ioc, name) => {
			ioc.singleton(name, () => new SentFriendRequestRepository());
		},
		notificationRepository: (ioc, name) => {
			ioc.singleton(name, () => new NotificationRepository());
		},
		userUpdatesSocket: (ioc, name) => {
			ioc.singleton(name, () => new UserUpdatesSocket());
		},
		auth: (ioc, name) => {
			ioc.singleton(name, () => new Authentication());
		},
		appLoader: (ioc, name) => {
			ioc.singleton(name, () => new AppLoader());
		},
		notificationsLiveUpdater: (ioc, name) => {
			ioc.singleton(name, () => new NotificationsLiveUpdater());
		},
		userDataLiveUpdater: (ioc, name) => {
			ioc.singleton(name, () => new UserDataLiveUpdater());
		},
		conversationSocketConnector: (ioc, name) => {
			ioc.bind(name, (iocInstance, params) => new PhoenixConversationSocketConnector(params.conversation));
		},
		userUpdatesSocketConnector: (ioc, name) => {
			ioc.bind(name, (iocInstance, params) => new PhoenixUserUpdatesSocketConnector(params.user));
		},
		phoenixSocket: (ioc, name) => {
			ioc.singleton(name, PhoenixSocketCreator.create);
		},
		eStore: (ioc, name) => {
			ioc.singleton(name, () => new Store());
		},
		downloadManager: (ioc, name) => {
			ioc.singleton(name, () => new DownloadManager());
		},
		toastManager: (ioc, name) => {
			ioc.singleton(name, () => new ToastManager());
		},
		confirm: (ioc, name) => {
			ioc.singleton(name, () => new ConfirmDialog());
		},
		paymentwall: (ioc, name) => {
			ioc.singleton(name, () => new Paymentwall());
		},
	},
};

/**
 * @callback serviceRegisterFunction
 * @param {IoC} ioc
 * @param {string} name
 * @see https://github.com/aedart/js-ioc
 */
