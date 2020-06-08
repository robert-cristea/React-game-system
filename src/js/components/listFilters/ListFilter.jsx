import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	label: PropTypes.string,
	icon: PropTypes.node,
	className: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

const defaultProps = {
	label: '',
	icon: null,
	className: null,
	active: false,
	onClick: null,
};

function ListFilter(props) {
	let className = `listFilter ${props.className || ''}`;

	if (props.active) {
		className += 'listFilter--active';
	}

	const onClickHandler = () => {
		if (props.onClick) {
			props.onClick();
		}
	};

	let icon = null;

	if (props.icon) {
		icon = <span className="listFilter__icon">{props.icon}</span>;
	}

	return (
		<div className="listFilters__filter">
			<span className={className} onClick={onClickHandler}>
				{icon}
				{props.label}
			</span>
		</div>
	);
}

ListFilter.propTypes = propTypes;
ListFilter.defaultProps = defaultProps;

export default ListFilter;
