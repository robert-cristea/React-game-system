import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	callback: PropTypes.func,
};

const defaultProps = {
	isActive: false,
	callback: null,
};

function SectionTab(props) {
	let className = 'sectionTab';

	if (props.isActive) {
		className = `${className} sectionTab--active`;
	}

	return (
		<div className={className} onClick={props.callback}>
			<Icon icon={props.icon} />
			<div className="sectionTab__title">{props.title}</div>
		</div>
	);
}

SectionTab.propTypes = propTypes;
SectionTab.defaultProps = defaultProps;

export default SectionTab;
