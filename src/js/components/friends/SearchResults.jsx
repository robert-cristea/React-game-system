import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import Icon from '../icons/Icon';
import Loading from '../Loading';
import User from '../../containers/friends/User';
import ScrollTrigger from '../ScrollTrigger';

@observer
class SearchResults extends ReactComponent {
	static propTypes = {
		searchingOffline: PropTypes.bool,
		searchingOnline: PropTypes.bool,
		friends: MobxPropTypes.arrayOrObservableArray,
		friendRequests: MobxPropTypes.arrayOrObservableArray,
		searchResults: MobxPropTypes.arrayOrObservableArray,
		hasMoreSearchResults: PropTypes.bool,
		onSearchMore: PropTypes.func,
	};

	static defaultProps = {
		searchingOffline: false,
		searchingOnline: false,
		friends: [],
		friendRequests: [],
		searchResults: [],
		hasMoreSearchResults: false,
		onSearchMore: null,
	};

	componentDidUpdate() {
		this.refreshTooltips();
	}

	refreshTooltips() {
		// ReactTooltip does not update automatically when new buttons are added/removed so
		// we force a refresh
		ReactTooltip.rebuild();
	}

	renderLoading() {
		return (
			<div className="friendsList__loader">
				<Loading />
			</div>
		);
	}

	renderEmpty(message) {
		return <div className="friendsList__empty">{message}</div>;
	}

	renderUsers(usersData) {
		return usersData.map(userData => {
			const user = userData.user;
			return <User userData={userData} key={user.id} />;
		});
	}

	renderFriends() {
		// Show the loading only if we are searching and we were not already showing matching friends
		if (this.props.searchingOffline && !this.props.friends.length) {
			return this.renderLoading();
		}

		if (!this.props.friends.length) {
			return this.renderEmpty('No friends match');
		}

		return <div className="friendsList__list">{this.renderUsers(this.props.friends)}</div>;
	}

	renderFriendRequests() {
		if (this.props.searchingOffline && !this.props.friendRequests.length) {
			return null;
		}

		if (!this.props.friendRequests.length) {
			return null;
		}

		return <div className="friendsList__list">{this.renderUsers(this.props.friendRequests)}</div>;
	}

	renderLoadMore() {
		if (!this.props.searchingOnline && !this.props.hasMoreSearchResults) {
			return null;
		}

		return this.renderLoading();
	}

	renderSearchResults() {
		let content = null;

		if (!this.props.searchingOnline) {
			if (!this.props.searchResults.length) {
				content = this.renderEmpty('No matches');
			} else {
				content = <div className="friendsList__list">{this.renderUsers(this.props.searchResults)}</div>;
			}
		}

		return (
			<ScrollTrigger enabled={this.props.hasMoreSearchResults} onTrigger={this.props.onSearchMore} threshold={100}>
				{content}
				{this.renderLoadMore()}
			</ScrollTrigger>
		);
	}

	render() {
		const sections = [
			{
				key: 'friends',
				icon: 'friends',
				title: 'Friends',
				content: this.renderFriends(),
			},
			{
				key: 'friendRequests',
				icon: 'clock',
				title: 'Pending friend requests',
				content: this.renderFriendRequests(),
			},
			{
				key: 'searchResults',
				icon: 'search',
				title: 'More people',
				content: this.renderSearchResults(),
			},
		];

		return sections.map(section => {
			if (!section.content) {
				return null;
			}

			return (
				<div className="friendsList__section" key={section.key}>
					<div className="friendsList__header">
						<div className="friendsList__title">
							<div className="friendsList__titleIcon">
								<Icon icon={section.icon} />
							</div>
							<h1 className="friendsList__titleText">{section.title}</h1>
						</div>
					</div>
					{section.content}
				</div>
			);
		});
	}
}

export default SearchResults;
