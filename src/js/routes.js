import Route from './app/Routing/Route';
import Group from './app/Routing/Group';
import Simple from './app/RoutingAnimation/Animations/Simple';
import OrderBased from './app/RoutingAnimation/Animations/OrderBased';

// Groups components
import Welcome from './components/screens/groups/Welcome';
import Dashboard from './containers/screens/groups/Dashboard';
import Messages from './containers/screens/groups/Messages';

// Routes

// Welcome
import Login from './containers/screens/routes/welcome/Login';
import ForgotPassword from './containers/screens/routes/welcome/ForgotPassword';
import Register from './containers/screens/routes/welcome/Register';
import Terms from './containers/screens/routes/welcome/Terms';

// Dashboard
import Activity from './components/screens/routes/home/Activity';
import Friends from './containers/screens/routes/home/Friends';
import Communities from './containers/screens/routes/home/Communities';
import Events from './containers/screens/routes/home/Events';
import Trophies from './containers/screens/routes/home/Trophies';
import UserProfile from './containers/user/UserProfileModal';

// Settings
import Account from './containers/screens/routes/settings/Account';
import Notification from './containers/screens/routes/settings/Notification';
import Privacy from './containers/screens/routes/settings/Privacy';
import Orders from './containers/screens/routes/settings/Orders';

import MessagesIndex from './components/screens/routes/messages/Index';
import Conversation from './containers/screens/routes/messages/Conversation';
import NewConversation from './containers/screens/routes/messages/New';

import LiveIndex from './containers/screens/routes/live/Index';
import ShopIndex from './containers/screens/routes/shop/Index';
import GamesIndex from './containers/screens/routes/games/Index';

import GameDetails from './containers/screens/routes/GameDetails';

import LaunchGame from './containers/screens/routes/launch/LaunchGame';

import Checkout from './containers/screens/routes/checkout/Index';
import CheckoutOrder from './containers/screens/routes/checkout/Order';

/**
 * Routes of the application. Routes are grouped in Group. A Group can also contain sub groups. A
 * Group has an Animation instance used to animate the transition between routes of the same group.
 * The Animation used is the one of the closest group enclosing the two routes.
 *
 * Example, you have the following structure:
 * group-root
 *   route-1
 *   group-a
 *     route-a1
 *     route-a2
 *   group-b
 *     route-b1
 *     route-b2
 *
 * - If you go from route-a1 to route-a2 (same group), the animation of group-a will be used
 * - If you go from route-a1 to route-b2 (different group), the animation of group-root will be used
 * - If you go from route-a2 to route-1, the animation of group-root will be used.
 *
 * A Group can also have a component. The inner routes will be passed as the `children` property to
 * the component. Use this feature to add a fixed header or footer to all the inner routes, for
 * example.
 *
 * The full path of a route is built from it `path` attribute appended to all its parent group
 * `base`. This is required to correctly determine the hierarchy to the route. So, the `path`
 * attribute of a route is NOT THE ABSOLUTE path to the route (like in React Router) but the
 * relative path to its parent group.
 *
 * Note that for some animations, order of routes is important because the animation is different if
 * we are going to a "higher" or "lower" route. Generally, a route defined after another is
 * considered to be "higher".
 */

export default new Group()
	.setBase('/')
	.setAnimation(new OrderBased('loginGarageDoor', 1200))
	.setChildren([
		/**
		 * Dashboard
		 */
		new Group()
			.setBase('dashboard/')
			.setAnimation(new OrderBased('lateralPush', 800))
			.setComponent(Dashboard)
			.setChildren([
				new Group()
					.makePrivate()
					.setBase('games/')
					.setAnimation(new Simple('fade', 800))
					.setChildren([
						new Route({
							path: 'index',
							component: GamesIndex,
						}),
						new Route({
							path: 'details/:gameId?',
							component: GameDetails,
						}),
					]),

				new Group()
					.setBase('shop/')
					.setAnimation(new Simple('fade', 800))
					.setChildren([
						new Route({
							path: 'index',
							component: ShopIndex,
						}),
						new Route({
							path: 'details/:gameId?',
							component: GameDetails,
						}),
					]),

				new Route({
					path: 'activity',
					component: Activity,
				}),

				new Route({
					path: 'friends/:friend?',
					component: Friends,
					private: true,
				}),

				new Route({
					path: 'communities/:community?',
					component: Communities,
				}),

				new Group().setBase('live/').setChildren([
					new Route({
						path: 'index/:stream?',
						component: LiveIndex,
					}),
				]),

				new Route({
					path: 'trophies/:game?',
					component: Trophies,
				}),

				new Route({
					path: 'events/:event?',
					component: Events,
				}),

				new Group()
					.makePrivate()
					.setBase('checkout/')
					.setChildren([
						new Route({
							path: 'index',
							component: Checkout,
							private: true,
						}),
						new Route({
							path: 'order/:order?',
							component: CheckoutOrder,
						}),
					]),

				new Group()
					.makePrivate()
					.setBase('messages/')
					.setComponent(Messages)
					// no animation
					.setChildren([
						new Route({
							path: 'index',
							component: MessagesIndex,
						}),

						new Route({
							path: 'conversation/:id',
							component: Conversation,
						}),

						new Route({
							path: 'new',
							component: NewConversation,
						}),
					]),

				new Route({
					path: 'user/:user',
					component: UserProfile,
					private: true,
				}),

				new Route({
					path: 'account',
					component: Account,
				}),

				new Route({
					path: 'notification',
					component: Notification,
				}),

				new Route({
					path: 'privacy',
					component: Privacy,
				}),

				new Route({
					path: 'orders/:order?',
					component: Orders,
				}),
			]),

		/**
		 * Welcome
		 */
		new Group()
			.setBase('welcome/')
			.setAnimation(new OrderBased('lateralPush', 800))
			.setComponent(Welcome)
			.setChildren([
				new Route({
					path: 'login',
					component: Login,
				}),
				new Route({
					path: 'restore',
					component: ForgotPassword,
				}),
				new Route({
					path: 'register',
					component: Register,
				}),
				new Route({
					path: 'terms',
					component: Terms,
				}),
			]),

		/**
		 * Launch Game
		 */
		new Group()
			.makePrivate()
			.setBase('launch/')
			.setChildren([
				new Route({
					path: 'index/:gameId?',
					component: LaunchGame,
					private: true,
				}),
			]),
	]);
