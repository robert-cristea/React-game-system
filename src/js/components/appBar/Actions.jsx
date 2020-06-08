import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	actions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			icon: PropTypes.string.isRequired,
			className: PropTypes.string,
			callback: PropTypes.func,
		}),
	),
};

const defaultProps = {
	actions: [],
};

function Actions(props) {
	const actions = props.actions.map(action => (
		<div key={action.id} className={`appBarActions__action appBarAction ${action.className}`} onClick={action.callback}>
			<Icon icon={action.icon} />
		</div>
	));
	return <div className="appBarActions">{actions}</div>;
}

Actions.propTypes = propTypes;
Actions.defaultProps = defaultProps;

export default Actions;
