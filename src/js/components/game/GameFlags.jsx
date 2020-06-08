import React from 'react';
import PropTypes from 'prop-types';
import Game from '../../app/Game';

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GameFlags(props) {
	/* TODO: make it work for real */

	// eslint-disable-next-line no-unused-vars
	const { game } = props;

	return (
		<div className="gameDetails__flags">
			<img
				className="gameDetails__flag"
				src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/pegi/pegi-1.png"
				alt="Pegi: 18+"
			/>
			<img
				className="gameDetails__flag"
				src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/pegi/pegi-2.png"
				alt="Pegi: Violence"
			/>
			<img
				className="gameDetails__flag"
				src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/pegi/pegi-3.png"
				alt="Pegi: Bad Language"
			/>
		</div>
	);
}

GameFlags.propTypes = propTypes;
GameFlags.defaultProps = defaultProps;

export default GameFlags;
