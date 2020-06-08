import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	tooltip: PropTypes.string,
	onClick: PropTypes.func,
	itemsCount: PropTypes.number,
	icon: PropTypes.string.isRequired,
};
const defaultProps = {
	tooltip: null,
	onClick: null,
	itemsCount: 0,
};

function AppHeaderItem(props) {
	const divExtraProps = {};

	if (props.tooltip) {
		divExtraProps['data-tip'] = props.tooltip;
		divExtraProps['data-for'] = 'tooltip-app-header';
	}

	return (
		<div className="appHeaderItem" onClick={props.onClick} {...divExtraProps}>
			{props.itemsCount > 0 && <div className="appHeaderItem__badge">{props.itemsCount}</div>}
			<Icon icon={props.icon} />
		</div>
	);
}

AppHeaderItem.propTypes = propTypes;
AppHeaderItem.defaultProps = defaultProps;

export default AppHeaderItem;
