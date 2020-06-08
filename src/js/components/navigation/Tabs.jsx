import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	tabs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			isActive: PropTypes.bool,
			onClick: PropTypes.func,
		}),
	),
};

const defaultProps = {
	tabs: [],
};

function Tabs(props) {
	const tabs = props.tabs.map(tab => {
		let className = 'tabs__item';

		if (tab.isActive) {
			className += ' tabs__item--active';
		}

		return (
			<div className={className} key={tab.id} onClick={tab.onClick}>
				{tab.label}
			</div>
		);
	});

	return <div className="tabs">{tabs}</div>;
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
