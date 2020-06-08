import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	size: PropTypes.oneOf(['compact', 'cover']),
	text: PropTypes.string,
};

const defaultProps = {
	value: 0,
	size: 'compact',
	text: null,
};

function ProgressBar(props) {
	return (
		<div className={`progressBar progressBar--${props.size}`}>
			{props.text !== null && (
				<div className="progressBar__text">{`${props.text} ${Math.round(props.value * 100) / 100}%`}</div>
			)}
			<meter className="progressBar__meter" value={parseInt(props.value, 10)} min="0" max="100" />
		</div>
	);
}

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;

export default ProgressBar;
