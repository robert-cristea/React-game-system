import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const defaultProps = {};

function ListFilters(props) {
	return <div className="listFilters">{props.children}</div>;
}

ListFilters.propTypes = propTypes;
ListFilters.defaultProps = defaultProps;

export default ListFilters;
