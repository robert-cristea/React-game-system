import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Component from '../../../components/screens/groups/Messages';
import Sidebar from '../../messages/Sidebar';

class Messages extends ReactComponent {
	static propTypes = {
		children: PropTypes.element.isRequired,
	};
	static defaultProps = {};

	/**
	 * Returns the Sidebar container "routed" so it has access to the current conversation id from
	 * the route.
	 */
	getRoutedSidebar() {
		return (
			<Switch>
				<Route path="/dashboard/messages/conversation/:id" component={Sidebar} />
				<Route component={Sidebar} />
			</Switch>
		);
	}

	render() {
		return <Component routedSidebar={this.getRoutedSidebar()}>{this.props.children}</Component>;
	}
}

export default Messages;
