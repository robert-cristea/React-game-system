import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

const propTypes = {
	children: PropTypes.node.isRequired,
	placement: PropTypes.string.isRequired,
};
const defaultProps = {};

function ToastContainer({ children, placement }) {
	const classes = ['toastContainer', `toastContainer--${placement}`];

	if (!Children.count(children)) {
		classes.push('toastContainer--empty');
	}

	return (
		<div className={classes.join(' ')}>
			<TransitionGroup component={null}>{children}</TransitionGroup>
		</div>
	);
}

ToastContainer.propTypes = propTypes;
ToastContainer.defaultProps = defaultProps;

export default ToastContainer;
