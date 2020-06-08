import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icons/Icon';

const propTypes = {
	size: PropTypes.oneOf(['small', 'medium']),
};

const defaultProps = {
	size: 'medium',
};

function Loading(props) {
	return (
		<div className={`loading loading--${props.size && props.size}`}>
			<Icon icon="loading" />
		</div>
	);
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
