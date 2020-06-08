import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import ScrollableView from '../ScrollableView';
import Loading from '../Loading';
import UserSearchResult from '../../app/UserSearchResult';
import UserListItem from './UserListItem';

@observer
class SearchModal extends Component {
	static propTypes = {
		searchResult: PropTypes.instanceOf(UserSearchResult),
		invitedUserIds: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.string),
		loading: PropTypes.bool,
		onBack: PropTypes.func,
		onSearch: PropTypes.func,
		onInvite: PropTypes.func,
	};
	static defaultProps = {
		searchResult: null,
		invitedUserIds: [],
		loading: false,
		onBack: null,
		onSearch: null,
		onInvite: null,
	};

	@observable
	searchValue = '';

	searchTimeout = null;

	handleSearchChange = event => {
		this.searchValue = event.target.value;
		this.startSearchTimeout();
	};

	handleInviteUser(user) {
		return () => {
			if (this.props.onInvite) {
				this.props.onInvite(user);
			}
		};
	}

	startSearchTimeout() {
		if (this.searchTimeout) {
			clearTimeout(this.searchTimeout);
			this.searchTimeout = null;
		}

		this.searchTimeout = setTimeout(this.doSearch, 1000);
	}

	doSearch = () => {
		if (this.searchValue.trim().length && this.props.onSearch) {
			this.props.onSearch(this.searchValue);
		}
	};

	renderSearchInput() {
		return (
			<div className="userSearchModal__search">
				<input type="text" placeholder="Search" onChange={this.handleSearchChange} value={this.searchValue} />
			</div>
		);
	}

	renderEmpty() {
		if (this.props.loading) {
			return null;
		}

		let message = '';

		if (!this.props.searchResult) {
			message = 'Start searching friends';
		} else if (!this.props.searchResult.users.length) {
			message = 'No users match this request';
		} else {
			return null;
		}

		return <div className="friendsList__none">{message}</div>;
	}

	renderUsers() {
		/** @type {UserSearchResult} */
		const result = this.props.searchResult;

		if (!result || this.props.loading) {
			return null;
		}

		const users = result.users.map(user => {
			let post;

			if (this.props.invitedUserIds.indexOf(user.id) === -1) {
				post = (
					<button className="btn btn--main btn-sm" onClick={this.handleInviteUser(user)}>
						Send invite
					</button>
				);
			} else {
				post = (
					<button className="btn btn--main btn-sm" disabled>
						Invite sent
					</button>
				);
			}

			return (
				<div key={user.id}>
					<UserListItem user={user} post={post} />
				</div>
			);
		});

		return <div>{users}</div>;
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return (
			<div className="userSearchModal__loading">
				<Loading />
			</div>
		);
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar pre={<Back onClick={this.props.onBack} />} title="Search Users" />
				<ScrollableView>
					<div className="userSearchModal">
						{this.renderSearchInput()}
						{this.renderLoading()}
						{this.renderEmpty()}
						{this.renderUsers()}
					</div>
				</ScrollableView>
			</div>
		);
	}
}

export default SearchModal;
