import React from 'react';
import PropTypes from 'prop-types';
import iconList from './iconList';

const propTypes = {
	icon: PropTypes.string.isRequired,
	className: PropTypes.string,
	inline: PropTypes.bool,
	onClick: PropTypes.func,
};

const defaultProps = {
	inline: false,
	className: '',
	onClick: null,
};

const Icon = props => {
	const iconData = iconList[props.icon];
	const HTMLElement = props.inline ? 'span' : 'div';

	if (!iconData) return null;

	return Array.isArray(iconData) ? (
		<HTMLElement className={`icon icon-${props.icon} ${props.className}`} onClick={props.onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${iconData[0]} ${iconData[1]}`}>
				<path d={`${iconData[2]}`} />
			</svg>
		</HTMLElement>
	) : (
		<HTMLElement className={`icon icon-${props.icon} ${props.className}`} onClick={props.onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${iconData.width} ${iconData.height}`}>
				{iconData.paths.map((path, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<path key={i} d={path} />
				))}
			</svg>
		</HTMLElement>
	);
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
