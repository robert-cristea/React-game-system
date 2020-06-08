import React, { Component as ReactComponent } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import Component from '../components/navigation/AppTabs';
import UI from '../app/UI';

const routes = [
	{
		id: 'home',
		match: '/dashboard',
		path: '/dashboard/games',
		title: 'Home',
		icon: 'home',
	},
	{
		id: 'shop',
		match: '/dashboard/shop',
		path: '/dashboard/shop/index',
		title: 'Shop',
		icon: 'shopping-cart',
	},
	{
		id: 'messages',
		match: '/dashboard/messages',
		path: '/dashboard/messages/index',
		title: 'Messages',
		icon: 'envelope',
	},
	{
		id: 'live',
		match: '/dashboard/live',
		path: '/dashboard/live/index',
		title: 'Live',
		icon: 'video',
	},
];

@inject('ui')
class AppTabs extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	handleTabClick(route) {
		return () => {
			this.props.ui.router.goTo(route.path);
		};
	}

	isRouteActive(route) {
		return this.props.ui.router.matchesPath(route.match);
	}

	getTabs() {
		return routes.map(route => ({
			...pick(route, ['id', 'title', 'icon']),
			isActive: this.isRouteActive(route),
			callback: this.handleTabClick(route),
		}));
	}

	render() {
		return <Component tabs={this.getTabs()} />;
	}
}

// Injected props
AppTabs.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppTabs;
