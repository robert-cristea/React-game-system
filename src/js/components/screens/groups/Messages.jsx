import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	routedSidebar: PropTypes.node,
	children: PropTypes.element.isRequired,
};

const defaultProps = {
	routedSidebar: null,
};

function Messages(props) {
	return (
		<div className="screenGroupMessages">
			<div className="screenGroupMessages__content">
				<div className="screenGroupMessages__sidebar">{props.routedSidebar}</div>
				<div className="screenGroupMessages__main">{props.children}</div>
			</div>
		</div>
	);
}

Messages.propTypes = propTypes;
Messages.defaultProps = defaultProps;

export default Messages;
