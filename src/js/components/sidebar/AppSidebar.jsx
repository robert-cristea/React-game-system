import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppSidebarLink from './AppSidebarLink';
import AppSidebarFriends from '../../containers/sidebar/AppSidebarFriends';
import ScrollableView from '../ScrollableView';

class AppSidebar extends Component {
	static propTypes = {
		links: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				isActive: PropTypes.bool,
				callback: PropTypes.func,
			}),
		),
		type: PropTypes.string.isRequired,
		loggedIn: PropTypes.bool,
	};
	static defaultProps = {
		links: [],
		loggedIn: false,
	};

	renderLinks() {
		return this.props.links.map(link => <AppSidebarLink key={link.id} {...link} />);
	}

	render() {
		return (
			<ScrollableView className={`appSidebar appSidebar--${this.props.type}`}>
				<div className="appSidebar__links">{this.renderLinks()}</div>
				{this.props.loggedIn && this.props.type === 'main' && <AppSidebarFriends />}
			</ScrollableView>
		);
	}
}

export default AppSidebar;
