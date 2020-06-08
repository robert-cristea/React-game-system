import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Game from '../../app/Game';

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GameDescription(props) {
	const { game } = props;
	const description = get(game, 'shopDetails.longDescription');

	return description ? (
		<div className="gameDetails__description">
			<h3 className="gameDetails__description-title">DESCRIPTION</h3>
			<div
				className="gameDetails__description-content"
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{ __html: description }}
			/>
		</div>
	) : null;
}

GameDescription.propTypes = propTypes;
GameDescription.defaultProps = defaultProps;

export default GameDescription;
