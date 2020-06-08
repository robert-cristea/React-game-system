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

function AppTab(props) {
	let className = 'appTab';

	if (props.isActive) {
		className = `${className} appTab--active`;
	}

	return (
		<div className={className} onClick={props.callback}>
			<Icon icon={props.icon} />
			<div className="appTab__title">{props.title}</div>
		</div>
	);
}

AppTab.propTypes = propTypes;
AppTab.defaultProps = defaultProps;

export default AppTab;
