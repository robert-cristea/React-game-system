import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	children: PropTypes.node.isRequired,
	appearance: PropTypes.string,
	transitionState: PropTypes.string,
	onDismiss: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

const defaultProps = {
	appearance: 'info',
	transitionState: null,
	onDismiss: null,
	onMouseEnter: null,
	onMouseLeave: null,
};

function Toast(props) {
	const classes = ['toast', `toast--${props.appearance}`, `toast--${props.transitionState}`];
	let dismiss = null;
	let icon = null;

	if (props.appearance === 'error') {
		icon = 'exclamation-circle';
	}

	if (props.appearance === 'warning') {
		icon = 'exclamation-circle';
	}

	if (props.onDismiss) {
		dismiss = (
			<div className="toast__close" onClick={props.onDismiss}>
				<Icon icon="remove" />
			</div>
		);
	}

	return (
		<div className={classes.join(' ')} onMouseLeave={props.onMouseLeave} onMouseEnter={props.onMouseEnter}>
			<div className="toast__content">
				{icon && (
					<div className="toast__icon">
						<Icon icon={icon} />
					</div>
				)}
				<div className="toast__message">{props.children}</div>
				{dismiss}
			</div>
		</div>
	);
}

Toast.propTypes = propTypes;
Toast.defaultProps = defaultProps;

export default Toast;
