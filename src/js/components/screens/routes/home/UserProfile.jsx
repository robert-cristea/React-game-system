import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import AppBar from '../../../AppBar';
import Back from '../../../appBar/Back';
import Sidebar from '../../../Sidebar';
import ProfilePreview from '../../../../containers/user/ProfilePreview';
import Icon from '../../../icons/Icon';
import Avatar from '../../../appBar/Avatar';
import User from '../../../../app/User';
import Loading from '../../../Loading';

@observer
class UserProfile extends Component {
	static propTypes = {
		user: PropTypes.instanceOf(User),
		mockFriends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
		loading: PropTypes.bool,
		external: PropTypes.bool,
		onBack: PropTypes.func,
		onSendMessageClick: PropTypes.func,
		onWatchStreamClick: PropTypes.func,
	};
	static defaultProps = {
		user: null,
		mockFriends: [],
		loading: false,
		external: true,
		onBack: null,
		onSendMessageClick: null,
		onWatchStreamClick: null,
	};

	@observable
	/**
	 * @type {'message'|'activity'|'friends'}
	 */
	view = 'activity';

	componentWillMount() {
		this.view = 'activity';
	}

	handleSendMessageClick = () => {
		if (this.props.onSendMessageClick) {
			this.props.onSendMessageClick();
		}
	};

	handleTabClick(id) {
		if (id === 'message') {
			return this.handleSendMessageClick;
		}
		return () => {
			this.view = id;
		};
	}

	getSectionTabs() {
		return Object.entries({
			// message: { title: 'Send message', icon: 'exclamation-circle' },
			activity: { title: 'See Activity', icon: 'info-circle' },
			friends: { title: 'See Friends', icon: 'users' },
		}).map(([id, data]) => ({
			id,
			title: data.title,
			icon: data.icon,
			isActive: this.view === id,
			callback: this.handleTabClick(id),
		}));
	}

	renderActivity() {
		const { user } = this.props;

		return (
			<div className="activity">
				<div className="activity__header">
					<Icon icon="games" />
					<h1 className="activity__title">LATEST ACTIVITY</h1>
				</div>

				<div className="activity__card">
					<div className="activity__card-wrap">
						<img
							className="activity__card-image"
							src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/cover.jpg"
							alt="Fallout 4"
						/>
						<div className="activity__card-info">
							<div className="activity__card-title">Played Fallout 4</div>
							<p className="activity__card-text">23 min ago</p>
						</div>
					</div>
					<div className="activity__image">
						<img
							src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/screenshot.jpg"
							alt="Fallout 4"
						/>
					</div>
				</div>

				<div className="activity__card">
					<div className="activity__card-wrap">
						<div className="activity__friends">
							<Avatar user={user} />
							<Avatar user={this.props.mockFriends[0]} />
						</div>
						<div className="activity__card-info">
							<div className="activity__card-title">
								{user.displayName} is friends with {this.props.mockFriends[0].username}
							</div>
							<div className="activity__card-text">2 days ago</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderFriends() {
		const friends = this.props.mockFriends.map(user => (
			<div key={user.id}>
				<Avatar user={user} />
			</div>
		));

		return (
			<div className="activity">
				<div className="activity__header">
					<Icon icon="games" />
					<h1 className="activity__title">FRIENDS</h1>
				</div>
				<div className="activity__friends">{friends}</div>
			</div>
		);
	}

	renderContent() {
		if (!this.props.user) {
			return null;
		}

		switch (this.view) {
			case 'friends':
				return this.renderFriends();
			default:
				return this.renderActivity();
		}
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return <Loading />;
	}

	renderProfilePreview() {
		if (!this.props.user) {
			return null;
		}

		return (
			<ProfilePreview
				user={this.props.user}
				sectionTabs={this.getSectionTabs()}
				external={this.props.external}
				onWatchStreamClick={this.props.onWatchStreamClick}
			/>
		);
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar pre={<Back onClick={this.props.onBack} />} />
				<div className="userProfile">
					<Sidebar className="userProfile__sidebar">{this.renderProfilePreview()}</Sidebar>
					<div className="flex-container">
						{this.renderLoading()}
						{this.renderContent()}
					</div>
				</div>
			</div>
		);
	}
}

export default UserProfile;
