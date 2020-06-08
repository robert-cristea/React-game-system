/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import UserListItem from '../../../user/UserListItem';
import ScrollableView from '../../../ScrollableView';
import Icon from '../../../icons/Icon';
import User from '../../../../app/User';
import Loading from '../../../Loading';

@observer
class New extends Component {
	static propTypes = {
		users: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		selectedUsers: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		loading: PropTypes.bool,
		creating: PropTypes.bool,
		onUserClick: PropTypes.func,
		onStartConversation: PropTypes.func,
		onGoToFriends: PropTypes.func,
	};

	static defaultProps = {
		users: [],
		selectedUsers: [],
		loading: false,
		creating: false,
		onUserClick: null,
		onStartConversation: null,
		onGoToFriends: null,
	};

	handleUserClick(user) {
		return () => {
			if (this.props.onUserClick) {
				this.props.onUserClick(user);
			}
		};
	}

	renderUsers() {
		return this.props.users.map(user => {
			const handleClick = this.handleUserClick(user);
			const isSelected = this.props.selectedUsers.indexOf(user) !== -1;
			const icon = isSelected ? 'times-circle' : 'plus-circle';

			return (
				<UserListItem
					key={user.id}
					className={`invitations userList ${isSelected ? 'userList__user--selected' : ''}`}
					user={user}
					onClick={handleClick}
					post={<Icon icon={icon} onClick={handleClick} />}
				/>
			);
		});
	}

	renderLoading() {
		return (
			<div className="screenGroupMessages__loading">
				<Loading />
			</div>
		);
	}

	renderCreating() {
		return (
			<div className="screenGroupMessages__loading">
				<Loading />
			</div>
		);
	}

	renderSelectedUsers() {
		return this.props.selectedUsers.map(u => (
			<span key={u.id} className="userListInput__user--active">
				{u.displayName}
			</span>
		));
	}

	renderNoFriends() {
		return (
			<div className="conversation__noFriends">
				<p>You didn't add any friends yet.</p>
				<p>
					<button type="button" className="btn btn--main" onClick={this.props.onGoToFriends}>
						Go to my friends list
					</button>
				</p>
			</div>
		);
	}

	renderStartButton() {
		if (!this.props.users.length) {
			return null;
		}

		return (
			<div className="conversation__start-button">
				<button
					className="btn btn--main"
					disabled={this.props.selectedUsers.length === 0}
					onClick={this.props.onStartConversation}
				>
					Start conversation
				</button>
			</div>
		);
	}

	render() {
		let content = null;

		if (this.props.loading) {
			content = this.renderLoading();
		} else if (this.props.creating) {
			content = this.renderCreating();
		} else if (!this.props.users.length) {
			content = this.renderNoFriends();
		} else {
			content = this.renderUsers();
		}

		return (
			<div className="flex-container">
				<div className="conversation__recipients">
					<div className="conversation__recipients-box">To: {this.renderSelectedUsers()}</div>
				</div>
				<ScrollableView>{content}</ScrollableView>
				{this.renderStartButton()}
			</div>
		);
	}
}

export default New;
