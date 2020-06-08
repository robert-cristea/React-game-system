import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import SectionTabs from '../../../navigation/SectionTabs';
import StreamList from '../../../stream/StreamList';
import MockObject from '../../../../mock/MockObject';

@observer
class Index extends Component {
	static propTypes = {
		playNetwork: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		interactive: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		byHost: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		onStreamClick: PropTypes.func,
	};

	static defaultProps = {
		playNetwork: [],
		interactive: [],
		byHost: [],
		onStreamClick: null,
	};

	/**
	 * For the 'by host' section, this variable holds the host that is currently shown
	 * @type {null}
	 */
	@observable
	selectedTab = null;

	componentWillMount() {
		// eslint-disable-next-line prefer-destructuring
		this.selectedTab = this.props.byHost[0];
	}

	getSectionTabs() {
		return this.props.byHost.map(data => ({
			id: data.host.id,
			title: data.host.name,
			icon: data.host.icon,
			isActive: data.host.id === this.selectedTab.host.id,
			callback: this.handleTabClick(data),
		}));
	}

	handleTabClick(tab) {
		return () => {
			this.selectedTab = tab;
		};
	}

	render() {
		const byHostStreams = this.selectedTab.streams;

		return (
			<div className="streams">
				<div className="streamList__container">
					<StreamList
						streams={this.props.playNetwork}
						onStreamClick={this.props.onStreamClick}
						title="LIVE FROM PLAY NETWORK"
						icon="games"
					/>
				</div>
				<div className="streamList__container">
					<StreamList
						streams={this.props.interactive}
						onStreamClick={this.props.onStreamClick}
						title="INTERACTIVE"
						icon="interactive"
					/>
				</div>
				<div className="streamList__container">
					<SectionTabs sectionTabs={this.getSectionTabs()} />
				</div>
				<div className="streamList__container">
					<StreamList streams={byHostStreams} onStreamClick={this.props.onStreamClick} />
				</div>
			</div>
		);
	}
}

export default Index;
