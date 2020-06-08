import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionTab from './SectionTab';

class SectionTabs extends Component {
	static propTypes = {
		sectionTabs: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				icon: PropTypes.string,
				isActive: PropTypes.bool,
				callback: PropTypes.func,
			}),
		),
	};
	static defaultProps = {
		sectionTabs: [],
	};

	renderTabs(sectionTabs) {
		return sectionTabs.map(tab => (
			<div key={tab.id} className="sectionTabs__tab">
				<SectionTab {...tab} />
			</div>
		));
	}

	render() {
		const { sectionTabs } = this.props;

		return sectionTabs && sectionTabs.length ? <div className="sectionTabs">{this.renderTabs(sectionTabs)}</div> : null;
	}
}

export default SectionTabs;
