import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Avatar from '../user/Avatar';
import Icon from '../icons/Icon';
import ProgressBar from '../ProgressBar';
import SectionTabs from '../navigation/SectionTabs';
import ScrollableView from '../ScrollableView';
import User from '../../app/User';
import Loading from '../Loading';
import { formatToken } from '../../app/utils';

function renderTimeParticle(nb) {
	return `${nb < 10 ? '0' : ''}${nb}`;
}

@observer
class ProfilePreview extends Component {
	static propTypes = {
		user: PropTypes.instanceOf(User).isRequired,
		loading: PropTypes.bool,
		external: PropTypes.bool,
		sectionTabs: PropTypes.arrayOf(PropTypes.object),
		onWatchStreamClick: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		external: false,
		sectionTabs: [],
		onWatchStreamClick: null,
	};

	/**
	 * Used to display the time since the start of the stream. Not updated if not "external" profile
	 * @type {*|moment.Moment}
	 */
	@observable
	now = moment();

	updateTimer = null;

	componentDidMount() {
		this.setStreamTimer();
	}

	componentWillReceiveProps(props) {
		this.setStreamTimer(props);
	}

	setStreamTimer(props = this.props) {
		window.clearInterval(this.updateTimer);
		this.updateTimer = null;

		if (!props.external) {
			return;
		}

		this.updateTimer = window.setInterval(() => {
			this.now = moment();
		}, 1000);
	}

	renderTrophies() {
		if (!this.props.external) {
			return null;
		}

		return (
			<div className="profilePreview__trophies">
				<div className="trophies__collection">
					<div className="trophies__current trophies__trophy">
						<Icon icon="trophy" />7
					</div>
					<div className="trophies__wall">
						<div className="trophies__gold trophies__trophy">
							<Icon icon="trophy" />
							91
						</div>
						<div className="trophies__silver trophies__trophy">
							<Icon icon="trophy" />
							199
						</div>
						<div className="trophies__bronze trophies__trophy">
							<Icon icon="trophy" />
							247
						</div>
					</div>
				</div>
				<ProgressBar value={34} text="" />
			</div>
		);
	}

	renderSectionTabs() {
		if (!this.props.sectionTabs.length) {
			return null;
		}

		return (
			<div className="profilePreview__sectionTabs">
				<SectionTabs sectionTabs={this.props.sectionTabs} />
			</div>
		);
	}

	renderStream() {
		if (!this.props.external) {
			return null;
		}

		const { stream } = this.props.user;

		if (!stream) {
			return null;
		}

		const duration = moment.duration(this.now.diff(stream.startDateTime));
		const hours = Math.floor(duration.asHours());
		const minutes = duration.minutes();
		const seconds = duration.seconds();

		return (
			<div className="profilePreview__stream activities__card card__small">
				<div className="activities__meta">
					<img className="stream__gameTag-thumbnail" src={stream.game.images.cover.url} alt={stream.game.name} />
					<div className="activities__text">
						<div>Playing {stream.game.name}</div>
						<div className="profilePreview__stream-description">{stream.game.publisher}</div>
						<div className="profilePreview__stream-clock">
							<Icon icon="clock" />
							{`${renderTimeParticle(hours)}:${renderTimeParticle(minutes)}:${renderTimeParticle(seconds)}`}
						</div>
					</div>
					<button className="profilePreview__stream-watch btn cart__remove" onClick={this.props.onWatchStreamClick}>
						<Icon icon="eye" />
						Watch
					</button>
				</div>
			</div>
		);
	}

	renderLoading() {
		return (
			<div className="profilePreview__loading">
				<Loading />
			</div>
		);
	}

	renderContent() {
		const user = this.props.user;

		return (
			<Fragment>
				<div className="profilePreview__head">
					<div className="profilePreview__avatar">
						<Avatar user={user} />
					</div>
					<div className="profilePreview__displayName">{user.displayName}</div>
					<div className="profilePreview__username">{user.username}</div>
				</div>
				{this.renderSectionTabs()}
				{this.props.external && (
					<div className="profilePreview__now">
						{this.renderTrophies()}
						{this.renderStream()}
					</div>
				)}
				<div className="profilePreview__details">
					<div className="profilePreview__details-item profilePreview__balance">
						<Icon icon="logo" />
						{formatToken(user.tokenBalance)} Tokens Available
					</div>
					<div className="profilePreview__details-item profilePreview__language">
						<Icon icon="globe" />
						English
					</div>
					<div className="profilePreview__details-item profilePreview__motto">
						<Icon icon="info-circle" />
						&quot;No pain - no gain!&quot;
					</div>
					{!this.props.external && (
						<div className="profilePreview__details-item profilePreview__wallet">
							<Icon icon="logo" />
							<div className="profilePreview__wallet-number">{user.ewallet}</div>
						</div>
					)}
				</div>
			</Fragment>
		);
	}

	render() {
		const content = this.props.loading ? this.renderLoading() : this.renderContent();

		return <ScrollableView className="profilePreview">{content}</ScrollableView>;
	}
}

export default ProfilePreview;
