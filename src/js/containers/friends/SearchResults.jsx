import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ReactTimeout from 'react-timeout';
import { observable, computed } from 'mobx';
import { normalizeString } from '../../app/utils';
import Component from '../../components/friends/SearchResults';
import Authentication from '../../app/Authentication';
import ReceivedFriendRequestRepository from '../../app/Repositories/ReceivedFriendRequestRepository';
import SentFriendRequestRepository from '../../app/Repositories/SentFriendRequestRepository';
import UserRepository from '../../app/Repositories/UserRepository';
import Config from '../../app/Config';
import ToastManager from '../../app/ToastManager';
import UserComponent from '../../components/friends/User';

const TIMEOUT_OFFLINE = 'offline';
const TIMEOUT_ONLINE = 'online';

/**
 * Shows search results, but offline (in already loaded friends and friend requests) and online (searches all users in
 * the system). Note that this container does not load friends and friend requests, they must already be loaded before
 * this container is mounted.
 */
@ReactTimeout
@inject('auth', 'receivedFriendRequestRepository', 'sentFriendRequestRepository', 'userRepository', 'config', 'toast')
@observer
class SearchResults extends ReactComponent {
	static propTypes = {
		searchValue: PropTypes.string,
	};

	static defaultProps = {
		searchValue: '',
	};

	/**
	 * True if the offline filtering of friends and requests will happen soon (a small delay is used)
	 * @type {boolean}
	 */
	@observable
	searchingOffline = false;

	/**
	 * True if currently waiting for an initial (page 1) search on the server
	 * @type {boolean}
	 */
	@observable
	searchingOnline = false;

	/**
	 * True if currently waiting for a search on the server for a page (page > 1)
	 * @type {boolean}
	 */
	searchingOnlineMore = false;

	/**
	 * Results of online search
	 * @type {UserData[]}
	 */
	@observable
	searchResults = [];

	/**
	 * True if the online search still has more results to query in a next page
	 * @type {boolean}
	 */
	@observable
	hasMoreSearchResults = false;

	/**
	 * Window timeouts
	 * @type {{}}
	 */
	timeouts = {};

	/**
	 * Current search page
	 * @type {number}
	 */
	searchPage = 1;

	/**
	 * Normalized value of the current search
	 * @type {string}
	 */
	@observable
	normalizedSearchValue = '';

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.reset();
		this.user = this.props.auth.getUser();
	}

	componentDidMount() {
		this.refreshSearch();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.searchValue !== this.props.searchValue) {
			this.refreshSearch();
		}
	}

	/**
	 * List of ids of all currently loaded friends and friend requests. Used to filter online search results (so we
	 * don't show friends in online results)
	 * @return {string[]}
	 */
	@computed
	get allOfflineUserIds() {
		const ids = this.user.getFriends().map(u => u.id);

		this.props.receivedFriendRequestRepository.getFriendRequests().forEach(fr => {
			ids.push(fr.user.id);
		});

		this.props.sentFriendRequestRepository.getFriendRequests().forEach(fr => {
			ids.push(fr.user.id);
		});

		return ids;
	}

	/**
	 * Friends (UserData) matching the current search
	 * @return {UserData[]}
	 */
	@computed
	get matchingFriends() {
		const friends = this.user.getFriends();
		const search = this.normalizedSearchValue;

		if (!search) {
			return [];
		}

		const foundFriends = friends.filter(friend => friend.matches(search, ['username'], true));
		return foundFriends.map(f => ({
			user: f,
			relation: UserComponent.RELATIONS.FRIEND,
		}));
	}

	/**
	 * Friend requests (UserData) matching the current search
	 * @return {UserData[]}
	 */
	@computed
	get matchingFriendRequests() {
		const allFriendRequests = [];
		const search = this.normalizedSearchValue;

		if (!search) {
			return [];
		}

		this.props.receivedFriendRequestRepository.getFriendRequests().forEach(fr => {
			allFriendRequests.push({
				relation: UserComponent.RELATIONS.INVITATION_RECEIVED,
				user: fr.user,
				friendshipRequest: fr,
			});
		});

		this.props.sentFriendRequestRepository.getFriendRequests().forEach(fr => {
			allFriendRequests.push({
				relation: UserComponent.RELATIONS.INVITATION_SENT,
				user: fr.user,
				friendshipRequest: fr,
			});
		});

		return allFriendRequests.filter(fr => fr.user.matches(search, ['username'], true));
	}

	reset() {
		this.searchingOffline = false;
		this.searchingOnline = false;
		this.searchingOnlineMore = false;
	}

	refreshSearch() {
		window.clearTimeout(this.timeouts[TIMEOUT_OFFLINE]);
		window.clearTimeout(this.timeouts[TIMEOUT_ONLINE]);

		this.searchingOnline = true;
		this.searchingOffline = true;

		// We quickly make an offline search (small timeout to prevent search with every key stroke)
		// The offline search will be triggered automatically once this.normalizedSearchValue is updated
		this.timeouts[TIMEOUT_OFFLINE] = this.props.setTimeout(() => {
			this.searchingOffline = false;
			this.normalizedSearchValue = normalizeString(this.props.searchValue);
		}, 300);

		// Search online a little later
		this.timeouts[TIMEOUT_ONLINE] = this.props.setTimeout(this.searchOnline, 800);
	}

	/**
	 * New search (page 1)
	 */
	searchOnline = () => {
		this.searchPage = 1;
		this.searchResults.clear();
		this.hasMoreSearchResults = false;
		this.searchingOnline = true;

		this.doOnlineSearch().finally(() => {
			this.searchingOnline = false;
		});
	};

	/**
	 * Search for the next page
	 */
	handleSearchMore = () => {
		if (this.searchingOnline || this.searchingOnlineMore) {
			return;
		}

		this.searchPage++;
		this.searchingOnlineMore = true;
		this.doOnlineSearch().finally(() => {
			this.searchingOnlineMore = false;
		});
	};

	doOnlineSearch() {
		const searchValue = this.props.searchValue;
		const searchPage = this.searchPage;

		return this.searchUsers(searchValue, searchPage)
			.then(results => {
				// If another search was done before this one finished, we ignore the current one
				if (searchValue !== this.props.searchValue || this.searchPage !== searchPage) {
					return;
				}

				this.hasMoreSearchResults = results.hasMore;
				const userDatas = this.processSearchResults(results.users);
				this.searchResults.push(...userDatas);
			})
			.catch(e => {
				this.hasMoreSearchResults = false;
				this.props.toast.error('An error occurred while searching');
				return Promise.reject(e);
			});
	}

	/**
	 * @param {string} query
	 * @param {number} page
	 * @return {Promise<UserSearchResult>}
	 */
	searchUsers(query, page) {
		/** @type {UserRepository} */
		const repo = this.props.userRepository;
		const attributes = this.props.config.get('userAttributes.friendsList');
		const pageSize = this.props.config.get('friends.search.pageSize');
		return repo.search(query, attributes, page, pageSize);
	}

	/**
	 * Filters out users that are already friends or in sent/received friend requests. Then creates UserData and returns
	 * them.
	 *
	 * @param {UserData[]} results
	 */
	processSearchResults(results) {
		const filteredResults = results.filter(user => this.allOfflineUserIds.indexOf(user.id) === -1);
		return filteredResults.map(result => ({
			user: result,
			relation: UserComponent.RELATIONS.UNKNOWN,
		}));
	}

	render() {
		return (
			<Component
				searchingOffline={this.searchingOffline}
				searchingOnline={this.searchingOnline}
				friends={this.matchingFriends}
				friendRequests={this.matchingFriendRequests}
				searchResults={this.searchResults}
				hasMoreSearchResults={this.hasMoreSearchResults}
				onSearchMore={this.handleSearchMore}
			/>
		);
	}
}

// Injected props
SearchResults.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	receivedFriendRequestRepository: PropTypes.instanceOf(ReceivedFriendRequestRepository).isRequired,
	sentFriendRequestRepository: PropTypes.instanceOf(SentFriendRequestRepository).isRequired,
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
	toast: PropTypes.instanceOf(ToastManager).isRequired,
};

export default SearchResults;

/**
 * @typedef {Object} UserData
 * @property {User} user
 * @property {string} relation
 * @property {FriendRequest} friendRequest
 */
