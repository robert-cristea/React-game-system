import React from 'react';
import PropTypes from 'prop-types';

function Welcome({ children }) {
	return <div className="screenGroupWelcome">{children}</div>;
}

Welcome.propTypes = {
	children: PropTypes.element.isRequired,
};

export default Welcome;
