import React from 'react';
import PropTypes from 'prop-types';
import Tool from './Tool';

const propTypes = {
	tools: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			icon: PropTypes.string.isRequired,
			onClick: PropTypes.func,
		}),
	),
};

const defaultProps = {
	tools: [],
};

function ToolBar(props) {
	const tools = props.tools.map(tool => <Tool icon={tool.icon} key={tool.id} onClick={tool.onClick} />);

	return <div className="stream__toolbar">{tools}</div>;
}

ToolBar.propTypes = propTypes;
ToolBar.defaultProps = defaultProps;

export default ToolBar;
