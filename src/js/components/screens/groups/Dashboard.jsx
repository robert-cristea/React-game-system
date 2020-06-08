import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import AppSidebar from '../../../containers/sidebar/AppSidebar';
import AppHeader from '../../../containers/header/AppHeader';

class Dashboard extends Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		location: PropTypes.object.isRequired,
		registerModalLocation: PropTypes.func,
		sendBuyTokensLocationName: PropTypes.string.isRequired,
	};

	static defaultProps = {
		registerModalLocation: null,
	};

	handleContainerRef = location => node => {
		if (this.props.registerModalLocation) {
			this.props.registerModalLocation(location, node);
		}
	};

	locationIncludes(path) {
		const list = Array.isArray(path) ? path : [path];
		return list.find(item => this.props.location.pathname.includes(item));
	}

	@computed
	get showSidebar() {
		const hideForLocations = ['/checkout', '/messages'];
		return this.props.location && !this.locationIncludes(hideForLocations);
	}

	@computed
	get sidebarType() {
		const settingsLocations = ['/account', '/notification', '/privacy', '/orders'];
		return this.props.location && this.locationIncludes(settingsLocations) ? 'settings' : 'main';
	}

	render() {
		return (
			<div className="screenGroupDashboard">
				<div className="screenGroupDashboard__header">
					<AppHeader />
				</div>
				<div className="screenGroupDashboard__content">
					{this.showSidebar && (
						<div className="screenGroupDashboard__sidebar">
							<AppSidebar type={this.sidebarType} />
						</div>
					)}
					<div className="screenGroupDashboard__main">{this.props.children}</div>
				</div>
				<div ref={this.handleContainerRef('dashboard-0')} className="screenGroupDashboard__modal0" />
				<div ref={this.handleContainerRef('dashboard-1')} className="screenGroupDashboard__modal1" />
				{/* Since multiple screens use the sendTokens modal, it is always here */}
				<div
					ref={this.handleContainerRef(this.props.sendBuyTokensLocationName)}
					className="screenGroupDashboard__sendTokensModal"
				/>
			</div>
		);
	}
}

export default Dashboard;
