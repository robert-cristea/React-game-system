import React, { Component as ReactComponent } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import Component from '../../components/sidebar/AppSidebar';
import Authentication from '../../app/Authentication';
import UI from '../../app/UI';

const routes = {
	main: [
		{
			id: 'games',
			match: '/dashboard/games',
			path: '/dashboard/games/index',
			title: 'My Games',
			private: true,
		},
		{
			id: 'shop',
			match: '/dashboard/shop',
			path: '/dashboard/shop/index',
			title: 'Store',
			private: false,
		},
		{
			id: 'activity',
			match: '/dashboard/activity',
			path: '/dashboard/activity',
			title: 'Activity',
			private: true,
		},
		{
			id: 'friends',
			match: '/dashboard/friends',
			path: '/dashboard/friends',
			title: 'Friends',
			private: true,
		},
		{
			id: 'community',
			match: '/dashboard/communities',
			path: '/dashboard/communities',
			title: 'Community',
			private: false,
		},
		{
			id: 'live',
			match: '/dashboard/live',
			path: '/dashboard/live/index',
			title: 'Streams',
			private: false,
		},
		{
			id: 'trophies',
			match: '/dashboard/trophies',
			path: '/dashboard/trophies',
			title: 'Awards',
			private: true,
		},
		{
			id: 'events',
			match: '/dashboard/events',
			path: '/dashboard/events',
			title: 'Events',
			private: false,
		},
	],
	settings: [
		{
			id: 'account',
			match: '/dashboard/account',
			path: '/dashboard/account',
			title: 'Account Settings',
			private: true,
		},
		{
			id: 'notification',
			match: '/dashboard/notification',
			path: '/dashboard/notification',
			title: 'Notification Settings',
			private: true,
		},
		{
			id: 'privacy',
			match: '/dashboard/privacy',
			path: '/dashboard/privacy',
			title: 'Privacy Settings',
			private: true,
		},
		{
			id: 'manageTokens',
			title: 'Manage Tokens',
			onClick: scope => scope.handleManageTokens,
		},
		{
			id: 'orders',
			match: '/dashboard/orders',
			path: '/dashboard/orders',
			title: 'Purchase History',
			private: true,
		},
		{
			id: 'Logout',
			title: 'Log out',
			onClick: scope => scope.handleLogout,
		},
	],
};

@inject('auth', 'ui')
class AppSidebar extends ReactComponent {
	static propTypes = {
		type: PropTypes.string,
	};
	static defaultProps = {
		type: 'main',
	};

	handleLinkClick(route) {
		return () => {
			this.props.ui.router.goTo(route.path);
		};
	}

	handleLogout = () => {
		// Redirection to login page will happen automatically after calling following method
		this.props.auth.logout();
	};

	handleManageTokens = () => {
		this.props.ui.showBuyTokensModal();
	};

	isRouteActive(route) {
		return this.props.ui.router.matchesPath(route.match);
	}

	getLinks() {
		return (
			routes[this.props.type]
				// TODO: Uncomment to hide private routes
				// .filter(route => this.props.ui.loggedIn ? true : !route.private)
				.map(route => ({
					...pick(route, ['id', 'title', 'icon']),
					isActive: this.isRouteActive(route),
					callback: route.onClick ? route.onClick(this) : this.handleLinkClick(route),
				}))
		);
	}

	render() {
		return (
			<Component
				type={this.props.type}
				links={this.getLinks()}
				loggedIn={this.props.ui.loggedIn}
				onLogout={this.handleLogout}
			/>
		);
	}
}

// Injected props
AppSidebar.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppSidebar;
