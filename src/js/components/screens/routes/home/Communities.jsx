import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { observable } from 'mobx';
import MockObject from '../../../../mock/MockObject';
import Icon from '../../../icons/Icon';
import Loading from '../../../Loading';
import ListFilters from '../../../listFilters/ListFilters';
import ListFilter from '../../../listFilters/ListFilter';
import CommunityPreview from '../../../community/CommunityPreview';

@observer
class Community extends Component {
	static propTypes = {
		currentUserSubscriptions: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(MockObject)),
		allCommunities: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		onCommunityClick: PropTypes.func,
		loading: PropTypes.bool,
	};

	static defaultProps = {
		currentUserSubscriptions: [],
		allCommunities: [],
		onCommunityClick: null,
		loading: false,
	};

	/**
	 * @type {'userCommunities'|'allCommunities'}
	 */
	@observable
	view = '';

	componentWillMount() {
		this.view = 'userCommunities';
	}

	handleViewClick = view => {
		this.view = view;
	};

	handleCommunityClick = community => () => {
		if (this.props.onCommunityClick) {
			this.props.onCommunityClick(community);
		}
	};

	getTitle() {
		return (
			<div className="friendsList__title">
				<div className="friendsList__titleIcon">
					<Icon icon="communities" />
				</div>
				<h1 className="friendsList__titleText">COMMUNITIES</h1>
			</div>
		);
	}

	renderCommunity(community, role = null) {
		const tags = [community.language];

		if (role) {
			tags.push(role);
		}

		return (
			<CommunityPreview
				key={community.id}
				community={community}
				tags={tags}
				onClick={this.handleCommunityClick(community)}
			/>
		);
	}

	renderList() {
		const communities =
			this.view === 'userCommunities'
				? this.props.currentUserSubscriptions.map(s => this.renderCommunity(s.community, s.role))
				: this.props.allCommunities.map(c => this.renderCommunity(c));

		return (
			<div className="friendsList__list grid">
				<div className="row">{communities}</div>
			</div>
		);
	}

	renderHeader() {
		return (
			<div className="friendsList__header">
				{this.getTitle()}
				<ListFilters>
					<ListFilter
						label="Your Communities"
						onClick={() => this.handleViewClick('userCommunities')}
						active={this.view === 'userCommunities'}
					/>
					<ListFilter
						label="Discover"
						onClick={() => this.handleViewClick('allCommunities')}
						active={this.view === 'allCommunities'}
					/>
				</ListFilters>
			</div>
		);
	}

	renderLoading() {
		return (
			<div className="friendsList__loading">
				<Loading />
			</div>
		);
	}

	render() {
		let content;

		if (this.props.loading) {
			content = this.renderLoading();
		} else {
			content = this.renderList();
		}

		return (
			<div className="friendsList">
				{this.renderHeader()}
				{content}
			</div>
		);
	}
}

export default Community;
