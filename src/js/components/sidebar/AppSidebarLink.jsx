import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
	isActive: PropTypes.bool,
	callback: PropTypes.func,
};

const defaultProps = {
	isActive: false,
	callback: null,
	icon: null,
};

function AppSidebarLink(props) {
	const className = 'appSidebar__link';

	return (
		<button className={`${className} ${props.isActive ? `${className}--active` : ''}`} onClick={props.callback}>
			{props.icon && <Icon icon={props.icon} />}
			<div className={`${className}-title`}>{props.title}</div>
		</button>
	);
}

AppSidebarLink.propTypes = propTypes;
AppSidebarLink.defaultProps = defaultProps;

export default AppSidebarLink;
