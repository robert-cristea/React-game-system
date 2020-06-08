import React from 'react';
import PropTypes from 'prop-types';
import AppHeaderItem from './AppHeaderItem';

const propTypes = {
	onClick: PropTypes.func,
	count: PropTypes.number,
};

const defaultProps = {
	onClick: null,
	count: 0,
};

function AppHeaderMessages(props) {
	return (
		<div className="appHeader__item">
			<AppHeaderItem onClick={props.onClick} icon="message" itemsCount={props.count} tooltip="Messages" />
		</div>
	);
}

AppHeaderMessages.propTypes = propTypes;
AppHeaderMessages.defaultProps = defaultProps;

export default AppHeaderMessages;
