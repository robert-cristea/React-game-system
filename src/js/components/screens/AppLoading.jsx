import React from 'react';
import Loading from '../Loading';

const propTypes = {};

const defaultProps = {};

function AppLoading() {
	return (
		<div className="screenLoading">
			<Loading />
		</div>
	);
}

AppLoading.propTypes = propTypes;
AppLoading.defaultProps = defaultProps;

export default AppLoading;
