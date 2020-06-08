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

function GameCover(props) {
	const { game } = props;
	const cover = get(game, 'shopDetails.medias', []).filter(media => media.type.name.toLowerCase() === 'banner')[0];

	return cover ? (
		<div className="gameDetails__cover">
			<img src={cover.thumb} alt={cover.title} />
		</div>
	) : null;
}

GameCover.propTypes = propTypes;
GameCover.defaultProps = defaultProps;

export default GameCover;
