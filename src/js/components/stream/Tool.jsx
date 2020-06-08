import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

const defaultProps = {
	onClick: null,
};

function Tool(props) {
	return (
		<div className="stream__tool" onClick={props.onClick}>
			<Icon icon={props.icon} />
		</div>
	);
}

Tool.propTypes = propTypes;
Tool.defaultProps = defaultProps;

export default Tool;
