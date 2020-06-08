import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import Loading from '../../../Loading';
import FriendsAndRequests from '../../../../containers/friends/FriendsAndRequests';
import Search from '../../../Search';
import SearchResults from '../../../../containers/friends/SearchResults';

@observer
class Friends extends Component {
	static propTypes = {
		loadingUsers: PropTypes.bool,
		startView: PropTypes.string,
	};

	static defaultProps = {
		loadingUsers: false,
		startView: null,
	};

	@observable
	searchValue = '';

	componentWillMount() {
		this.searchValue = '';
	}

	handleSearch = searchValue => {
		this.searchValue = searchValue.trim();
	};

	renderSearch() {
		return (
			<div className="friendsList__search">
				<Search placeholder="Find friends by display name" onChange={this.handleSearch} />
			</div>
		);
	}

	renderLoadingUsers() {
		return (
			<div className="friendsList__loading">
				<Loading />
			</div>
		);
	}

	render() {
		let content;

		if (this.props.loadingUsers) {
			content = this.renderLoadingUsers();
		} else if (this.searchValue.length) {
			content = <SearchResults searchValue={this.searchValue} />;
		} else {
			content = <FriendsAndRequests startView={this.props.startView} />;
		}

		return (
			<div className="friendsList">
				{this.renderSearch()}
				{content}
				<ReactTooltip id="tooltip-user-list" className="tooltip" place="bottom" effect="solid" />
			</div>
		);
	}
}

export default Friends;
