import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
};

const defaultProps = {
	children: null,
	className: null,
	style: null,
};

function Sidebar(props) {
	const className = `sidebar ${props.className || ''}`;
	return (
		<div className={className} style={props.style}>
			{props.children}
		</div>
	);
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
