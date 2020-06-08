import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import Icon from '../icons/Icon';
import ListFilters from '../listFilters/ListFilters';
import ListFilter from '../listFilters/ListFilter';
import User from '../../containers/friends/User';

@observer
class FriendsAndRequests extends Component {
	static propTypes = {
		users: PropTypes.array,
		view: PropTypes.string,
		onViewChange: PropTypes.func,
	};

	static defaultProps = {
		users: [],
		view: null,
		onViewChange: null,
	};

	static VIEW_ALL = 'all';
	static VIEW_ONLINE = 'online';
	static VIEW_OFFLINE = 'offline';
	static VIEW_PENDING = 'pending';

	componentDidUpdate() {
		this.refreshTooltips();
	}

	refreshTooltips() {
		// ReactTooltip does not update automatically when new buttons are added/removed so
		// we force a refresh
		ReactTooltip.rebuild();
	}

	handleViewClick = type => () => {
		if (this.props.onViewChange) {
			this.props.onViewChange(type);
		}
	};

	getEmptyMessage() {
		switch (this.props.view) {
			case FriendsAndRequests.VIEW_ALL:
				return "You haven't added any friends yet.";
			case FriendsAndRequests.VIEW_ONLINE:
				return 'None of your friends are online.';
			case FriendsAndRequests.VIEW_OFFLINE:
				return 'None of your friends are offline.';
			case FriendsAndRequests.VIEW_PENDING:
				return "You don't have any pending friend requests.";
			default:
				return '';
		}
	}

	getTitle() {
		let label = 'Friends';
		let icon = 'friends';

		if (this.props.view === FriendsAndRequests.VIEW_PENDING) {
			label = 'Pending friend requests';
			icon = 'clock';
		}

		return (
			<div className="friendsList__title">
				<div className="friendsList__titleIcon">
					<Icon icon={icon} />
				</div>
				<h1 className="friendsList__titleText">{label}</h1>
			</div>
		);
	}

	renderUser(userData) {
		const user = userData.user;

		return <User userData={userData} key={user.id} />;
	}

	renderUsersList() {
		const users = this.props.users.map(userData => this.renderUser(userData));

		if (!users.length) {
			return <div className="friendsList__none">{this.getEmptyMessage()}</div>;
		}

		return (
			<Fragment>
				<div key="byName" className="friendsList__list">
					{users}
				</div>
			</Fragment>
		);
	}

	renderHeader() {
		return (
			<div className="friendsList__header">
				{this.getTitle()}
				<ListFilters>
					<ListFilter
						label="All"
						onClick={this.handleViewClick(FriendsAndRequests.VIEW_ALL)}
						active={this.props.view === FriendsAndRequests.VIEW_ALL}
					/>
					<ListFilter
						label="Online"
						icon={<span className="friendsList__filter--online" />}
						onClick={this.handleViewClick(FriendsAndRequests.VIEW_ONLINE)}
						active={this.props.view === FriendsAndRequests.VIEW_ONLINE}
					/>
					<ListFilter
						label="Offline"
						icon={<span className="friendsList__filter--offline" />}
						onClick={this.handleViewClick(FriendsAndRequests.VIEW_OFFLINE)}
						active={this.props.view === FriendsAndRequests.VIEW_OFFLINE}
					/>
					<ListFilter
						label="Pending"
						icon={
							<span className="friendsList__filter--pending">
								<Icon icon="pending" />
							</span>
						}
						onClick={this.handleViewClick(FriendsAndRequests.VIEW_PENDING)}
						active={this.props.view === FriendsAndRequests.VIEW_PENDING}
					/>
				</ListFilters>
			</div>
		);
	}

	render() {
		return (
			<Fragment>
				{this.renderHeader()}
				{this.renderUsersList()}
			</Fragment>
		);
	}
}

export default FriendsAndRequests;
