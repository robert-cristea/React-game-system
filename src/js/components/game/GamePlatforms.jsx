import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Icon from '../icons/Icon';
import Game from '../../app/Game';

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GamePlatforms(props) {
	const { game } = props;

	// eslint-disable-next-line no-unused-vars
	const platforms = get(game, 'shopDetails.platforms', []);

	// TODO: Start using real data
	const mockPlatforms = [{ name: 'Windows' }];

	return mockPlatforms.length ? (
		<div className="gameDetails__platforms">
			{mockPlatforms.map(platform => (
				<div key={platform.name} className="gameDetails__platform">
					<Icon icon={String(platform.name).toLowerCase()} />
					<p className="gameDetails__platform-text">{platform.name}</p>
				</div>
			))}
		</div>
	) : null;
}

GamePlatforms.propTypes = propTypes;
GamePlatforms.defaultProps = defaultProps;

export default GamePlatforms;
