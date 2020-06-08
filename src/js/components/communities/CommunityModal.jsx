import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ScrollableView from '../ScrollableView';
import MockObject from '../../mock/MockObject';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import Actions from '../appBar/Actions';
import SectionTabs from '../navigation/SectionTabs';
import ConversationHistory from '../conversations/ConversationHistory';
import MessageInput from '../conversations/MessageInput';
import Avatar from '../user/Avatar';
import Icon from '../icons/Icon';

@observer
class CommunityModal extends Component {
	static propTypes = {
		community: PropTypes.instanceOf(MockObject).isRequired,
		currentUser: PropTypes.instanceOf(MockObject).isRequired,
		onBack: PropTypes.func,
		userIsSubscribed: PropTypes.bool,
		onSubscribe: PropTypes.func,
		onUnsubscribe: PropTypes.func,
		onMessage: PropTypes.func,
	};
	static defaultProps = {
		userIsSubscribed: false,
		onBack: null,
		onSubscribe: null,
		onUnsubscribe: null,
		onMessage: null,
	};

	@observable
	subscriptionOptionsVisible = false;

	/**
	 * @type {'wall'|'playing'|'members'}
	 */
	@observable
	view = null;

	componentWillMount() {
		this.view = 'playing';
		this.subscriptionOptionsVisible = false;
	}

	closeSubscriptionOptions() {
		this.subscriptionOptionsVisible = false;
	}

	handleOptionsClick = () => {
		this.subscriptionOptionsVisible = !this.subscriptionOptionsVisible;
	};

	handleSubscribe = () => {
		this.closeSubscriptionOptions();

		if (this.props.userIsSubscribed) {
			return;
		}

		if (this.props.onSubscribe) {
			this.props.onSubscribe();
		}
	};

	handleUnsubscribe = () => {
		this.closeSubscriptionOptions();

		if (!this.props.userIsSubscribed) {
			return;
		}

		if (this.props.onUnsubscribe) {
			this.props.onUnsubscribe();
		}
	};

	handleTabClick = id => () => {
		this.view = id;
	};

	getTabs() {
		return Object.entries({
			playing: { title: 'Now playing', icon: 'gamepad' },
			wall: { title: 'Wall', icon: 'newspaper' },
			members: { title: 'Members', icon: 'users' },
		}).map(([id, data]) => ({
			id,
			title: data.title,
			icon: data.icon,
			isActive: this.view === id,
			callback: this.handleTabClick(id),
		}));
	}

	renderAppBar() {
		const actions = [{ id: 'more', icon: 'ellipsis-h', callback: this.handleOptionsClick }];

		return (
			<AppBar
				pre={<Back onClick={this.props.onBack} />}
				title={this.props.community.name}
				post={<Actions actions={actions} />}
			/>
		);
	}

	renderWall() {
		return (
			<Fragment>
				<ScrollableView>
					<ConversationHistory events={[]} currentUser={this.props.currentUser} />
				</ScrollableView>
				<MessageInput onMessage={this.props.onMessage} />
			</Fragment>
		);
	}

	renderUsers(users) {
		return users.map(user => (
			<div key={user.id} className="streamModal__viewer">
				<Avatar user={user} />
			</div>
		));
	}

	renderPlaying() {
		return this.renderMembers(); // simulation
	}

	renderMembers() {
		return (
			<ScrollableView>
				<div className="streamModal__viewers">
					<div className="streamList__title">
						<Icon icon="gamepad" />
						<h2>Friends</h2>
					</div>
					<div className="streamModal__viewers-grid">{this.renderUsers(this.props.community.playing)}</div>
					<div className="streamList__title">
						<Icon icon="gamepad" />
						<h2>Members</h2>
					</div>
					<div className="streamModal__viewers-grid">{this.renderUsers(this.props.community.playing)}</div>
				</div>
			</ScrollableView>
		);
	}

	renderContent() {
		switch (this.view) {
			case 'wall':
				return this.renderWall();
			case 'playing':
				return this.renderPlaying();
			default:
				return this.renderMembers();
		}
	}

	renderSubscriptionOptions() {
		let subscriptionOptionsStyle = {
			display: 'none',
		};

		if (this.subscriptionOptionsVisible) {
			subscriptionOptionsStyle = {
				display: 'flex',
			};
		}
		const subscribeProps = this.props.userIsSubscribed ? { opacity: 0.5 } : null;
		const unsubscribeProps = this.props.userIsSubscribed ? null : { opacity: 0.5 };

		return (
			<div className="communityModal__subscription" style={subscriptionOptionsStyle}>
				<button className="btn btn--main" style={subscribeProps} onClick={this.handleSubscribe}>
					Join Community
				</button>
				<button className="btn btn--main" style={unsubscribeProps} onClick={this.handleUnsubscribe}>
					Leave Community
				</button>
			</div>
		);
	}

	render() {
		const { community } = this.props;

		return (
			<div className="flex-container">
				{this.renderAppBar()}
				<div className="communityModal__hero" style={{ backgroundImage: `url(${community.medias.activity}` }}>
					<div className="communityModal__wrapper">
						<img className="communityModal__thumb" src={community.medias.cover} alt={community.name} />
						<div className="communityModal__name">{community.name}</div>
						<div className="profilePreview__username">{community.description}</div>
					</div>
					{this.renderSubscriptionOptions()}
				</div>
				<SectionTabs sectionTabs={this.getTabs()} />
				{this.renderContent()}
			</div>
		);
	}
}

export default CommunityModal;
