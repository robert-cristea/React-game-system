import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../appBar/Avatar';
import User from '../../app/User';
import Loading from '../Loading';

const propTypes = {
	user: PropTypes.instanceOf(User).isRequired,
	loading: PropTypes.bool,
	className: PropTypes.string,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	title: PropTypes.string,
	statusText: PropTypes.node,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

const defaultProps = {
	icon: null,
	statusText: null,
	loading: false,
	title: null,
	active: false,
	onClick: null,
	className: null,
};

function UserPreview(props) {
	const classNames = ['userPreview'];

	if (props.className) {
		classNames.push(props.className);
	}

	if (props.active) {
		classNames.push('userPreview--active');
	}

	// If loading
	if (props.loading) {
		return (
			<div className={`${classNames.join(' ')}`} onClick={props.onClick}>
				<Loading />
			</div>
		);
	}

	// If loaded
	let icon = props.icon;

	if (typeof props.icon === 'string') {
		icon = <span className={`userPreview__state userPreview__state--${props.icon}`} />;
	} else if (props.icon) {
		icon = <span className="userPreview__state">{props.icon}</span>;
	}

	return (
		<div className={`${classNames.join(' ')}`} onClick={props.onClick}>
			<div className="userPreview__avatar">
				<Avatar user={props.user} />
			</div>
			<div className="userPreview__text">
				<div className="userPreview__main">
					{icon}
					<span className="userPreview__name">{props.title || props.user.username}</span>
				</div>
				<div className="userPreview__status">{props.statusText}</div>
			</div>
		</div>
	);
}

UserPreview.propTypes = propTypes;
UserPreview.defaultProps = defaultProps;

export default UserPreview;
