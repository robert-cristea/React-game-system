import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	label: PropTypes.string,
	showArrow: PropTypes.bool,
	onClick: PropTypes.func,
};

const defaultProps = {
	label: null,
	showArrow: true,
	onClick: null,
};

function Back(props) {
	return (
		<button className="appBar__pre-cancel" onClick={props.onClick}>
			{props.showArrow ? <Icon icon="chevron-left" /> : null}
			{props.label}
		</button>
	);
}

Back.propTypes = propTypes;
Back.defaultProps = defaultProps;

export default Back;
