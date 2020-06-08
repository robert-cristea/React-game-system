/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { autorun, observable } from 'mobx';
import Router from './Router';

/**
 * Main class in charge of the UI. When starting, the UI will pass through different states:
 * - STATE_CREATED: the UI is created
 * - STATE_INITIALIZED: after `init()` was successfully called
 * - STATE_LOADING: The UI is currently waiting for all app data to load
 * - STATE_READY: all data was loaded and the main app UI is ready to be displayed
 */
class UI {
	/**
	 * Different state of the
	 */
	static STATE_CREATED = 'created';
	static STATE_INITIALIZED = 'initialized';
	static STATE_LOADING = 'loading';
	static STATE_READY = 'ready';

	/**
	 * Possible handlers
	 */
	static HANDLERS = ['cartShow', 'cartHide'];

	/**
	 * Stores that components (containers) can access with @inject(prop)
	 * @type {{}}
	 */
	stores = {};
	/**
	 * @type {Router}
	 */
	router = null;
	/**
	 * Function (handler) that will be called when we want to show the "send" tokens modal (called by
	 * `showSendTokensModal()`).
	 * @type {sendTokensModalHandlerCb}
	 */
	sendTokensModalHandler = null;
	/**
	 * Function (handler) that will be called when we want to show the "buy" tokens modal (called by
	 * `showBuyTokensModal()`).
	 * @type {sendTokensModalHandlerCb}
	 */
	buyTokensModalHandler = null;
	/**
	 * Map containing locations where a modal can be attached. Key is the location name and value is
	 * the DOM element. It is an observable Map so modals can be added asynchronously (for cases
	 * when the modal location is set after the modal could have been declared).
	 * @type {Map<string, Element>}
	 */
	@observable
	modalLocations = new Map();
	/**
	 * Current state of the UI
	 * @type {null|string}
	 */
	@observable
	state = UI.STATE_CREATED;

	/**
	 * Internal property to keep the last logged in state of the user. Used to compare to when the
	 * authentication state changes.
	 * @type {boolean}
	 */
	loggedIn = false;

	/**
	 * HANDLERS
	 */

	/**
	 * Called when we want to show the cart dropdown.
	 * @type {showCartHandler}
	 */
	showCartHandler = null;

	/**
	 * Called when we want to hide the cart dropdown.
	 * @type {hideCartHandler}
	 */
	hideCartHandler = null;

	/**
	 * Init internal properties
	 */
	init() {
		this.router = new Router();

		this.initStores();
		this.router.init();
		this.state = UI.STATE_INITIALIZED;
	}

	/**
	 * Starts the UI
	 */
	start() {
		this.watchAuthentication();
		this.autoConnectUserUpdatesSocket();
		IoC.make('notificationsLiveUpdater').start();
		IoC.make('userDataLiveUpdater').start();
	}

	/**
	 * When the user gets logged out (once the UI is in the 'ready' state), we redirect to the login
	 * screen.
	 */
	watchAuthentication() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		autorun(() => {
			if (this.state !== UI.STATE_READY) {
				return;
			}

			// TODO: This validation stoped working
			if (this.loggedIn && !auth.isAuthenticated()) {
				this.router.goTo('/welcome/login');
			}

			this.loggedIn = auth.isAuthenticated();
		});
	}

	/**
	 * When a user authenticates, will make the UserUpdatesSocket start listening for
	 * notifications. When the user logs out, stops the socket from listening.
	 */
	autoConnectUserUpdatesSocket() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');

		autorun(() => {
			if (this.state !== UI.STATE_READY) {
				return;
			}

			/** @type {UserUpdatesSocket} */
			const socket = IoC.make('userUpdatesSocket');

			// When the user logs out, we stop listening to the user updates socket
			if (!auth.isAuthenticated()) {
				socket.stopListening();
			} else {
				// When the user logs in, we start listening to its notifications socket
				const connector = IoC.make('userUpdatesSocketConnector', { user: auth.getUser() });
				socket.setConnector(connector);
				socket.startListening();
			}
		});
	}

	/**
	 * Initializes the store attributes that components will be able to access with @inject
	 */
	initStores() {
		this.stores = {
			ui: this,
			auth: IoC.make('auth'),
			config: IoC.make('config'),
			conversationRepository: IoC.make('conversationRepository'),
			userRepository: IoC.make('userRepository'),
			gameRepository: IoC.make('gameRepository'),
			orderRepository: IoC.make('orderRepository'),
			notificationRepository: IoC.make('notificationRepository'),
			receivedFriendRequestRepository: IoC.make('receivedFriendRequestRepository'),
			sentFriendRequestRepository: IoC.make('sentFriendRequestRepository'),
			eStore: IoC.make('eStore'),
			downloadManager: IoC.make('downloadManager'),
			toast: IoC.make('toastManager'),
			confirm: IoC.make('confirm'),
			paymentwall: IoC.make('paymentwall'),
		};
	}

	/**
	 * @return {{}}
	 */
	getStores() {
		return this.stores;
	}

	/**
	 * @param {string} id
	 * @param {function} handler
	 */
	registerHandler(id, handler) {
		if (UI.HANDLERS.includes(id)) {
			this[id] = handler;
		}
	}

	/**
	 * @param {string} id
	 * @param {object} attributes
	 */
	call(id, attributes = {}) {
		if (typeof this[id] === 'function') {
			this[id](attributes);
		}
	}

	/**
	 * @param {string} location
	 * @param {Element} element
	 */
	registerModalLocation(location, element) {
		this.modalLocations.set(location, element);
	}

	/**
	 * @param {string} location
	 * @return {Element}
	 */
	getModalLocation(location) {
		return this.modalLocations.get(location);
	}

	/**
	 * Since multiple screens use the "send token" modal, a specific method was created to show it
	 * (and reduce code duplication).
	 *
	 * The `callback` will receive the amount entered.
	 *
	 * Note that there must be a `MODAL_LOCATION_SEND_BUY_TOKENS` modal location defined.
	 *
	 * @param {User} toUser
	 * @param {buySendTokensModalCallback} callback
	 */
	showSendTokensModal(toUser, callback = () => {}) {
		this.sendTokensModalHandler(toUser, callback);
	}

	/**
	 * Since multiple screens use the "buy token" modal, a specific method was created to show it
	 * (and reduce code duplication).
	 *
	 * The `callback` will be called with the Order. `context` defines in which context the modal was opened and is used
	 * by the modal to alter design or user flow.
	 *
	 * Note that there must be a `MODAL_LOCATION_SEND_BUY_TOKENS` modal location defined.
	 *
	 * @param {buySendTokensModalCallback} callback
	 * @param {string} context
	 */
	showBuyTokensModal(callback = () => {}, context = null) {
		this.buyTokensModalHandler(callback, context);
	}

	/**
	 * @param {sendTokensModalHandlerCb} handler
	 */
	registerSendTokensModalHandler(handler) {
		this.sendTokensModalHandler = handler;
	}

	/**
	 * @param {sendTokensModalHandlerCb} handler
	 */
	registerBuyTokensModalHandler(handler) {
		this.buyTokensModalHandler = handler;
	}

	/**
	 * Calling this function will put the UI in "loading" mode (will set the `state` attribute to
	 * STATE_LOADING). The `loader` parameter is a Promise object representing the loading process.
	 * When it resolves, the `state` is set to STATE_READY.
	 * @param {Promise} loader
	 */
	loading(loader) {
		this.state = UI.STATE_LOADING;
		loader.then(() => {
			this.state = UI.STATE_READY;
		});
	}
}

/**
 * @callback buySendTokensModalCallback
 * @param {number} amount
 */

/**
 * @callback sendTokensModalHandlerCb
 * @param {MockObject} toUser
 * @param {buySendTokensModalCallback} callback
 */
/**
 * @callback buyTokensModalHandlerCb
 * @param {buySendTokensModalCallback} callback
 */

export default UI;
