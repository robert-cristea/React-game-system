import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import User from '../../app/User';
import Loading from '../Loading';
import Icon from '../icons/Icon';
import UserPreview from '../../containers/user/UserPreview';

@observer
class Friends extends Component {
	static propTypes = {
		friends: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		loadingFriends: PropTypes.bool,
		onFriendClick: PropTypes.func,
		onSendMessageClick: PropTypes.func,
	};

	static defaultProps = {
		friends: [],
		loadingFriends: false,
		onFriendClick: null,
		onSendMessageClick: null,
	};

	@computed
	get sortedFriends() {
		return [...this.sortFriends(this.getOnlineFriends()), ...this.sortFriends(this.getOfflineFriends())];
	}

	sortFriends(friends) {
		return friends.sort((a, b) => {
			// If a friend is later added, we may not immediately have her username
			// so, for now, we just push her to the top
			if (!a.username) {
				return -1;
			}
			if (!b.username) {
				return 1;
			}
			return a.username.localeCompare(b.username);
		});
	}

	getOnlineFriends() {
		return this.props.friends.filter(user => user.isOnline());
	}

	getOfflineFriends() {
		return this.props.friends.filter(user => !user.isOnline());
	}

	getStatus(user) {
		if (user.isOnline()) {
			return user.status.displayText ? user.status.displayText : 'Online';
		}

		return 'Offline';
	}

	handleFriendClick(user) {
		return () => {
			if (this.props.onFriendClick) {
				this.props.onFriendClick(user);
			}
		};
	}

	handleSendMessageClick(user) {
		return () => {
			if (this.props.onFriendClick) {
				this.props.onSendMessageClick(user);
			}
		};
	}

	renderFriends() {
		const sortedFriends = this.sortedFriends;

		if (sortedFriends.length) {
			return <div className="appSidebarFriends__list">{sortedFriends.map(user => this.renderFriend(user))}</div>;
		}

		return <p className="appSidebarFriends__empty">You haven&#39;t added any friends yet.</p>;
	}

	renderOverlay(user) {
		return (
			<div className="appSidebarFriends__overlay">
				<button className="appSidebarFriends__overlay-item" onClick={this.handleFriendClick(user)}>
					<Icon icon="profile" />
				</button>
				<button className="appSidebarFriends__overlay-item" onClick={this.handleSendMessageClick(user)}>
					<Icon icon="message" />
				</button>
			</div>
		);
	}

	renderFriend(user) {
		return (
			<div key={user.id} className="appSidebarFriends__item">
				<UserPreview user={user} icon={user.isOnline() ? 'online' : 'offline'} statusText={this.getStatus(user)} />
				{this.renderOverlay(user)}
			</div>
		);
	}

	render() {
		return (
			<div className="appSidebarFriends">
				{this.props.loadingFriends ? (
					<div className="appSidebarFriends__loading">
						<Loading />
					</div>
				) : (
					<Fragment>
						<h3 className="appSidebarFriends__title">Active Friends</h3>
						{this.renderFriends()}
					</Fragment>
				)}
			</div>
		);
	}
}

export default Friends;
