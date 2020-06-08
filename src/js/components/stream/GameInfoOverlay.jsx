import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Icon from '../icons/Icon';

const propTypes = {
	game: PropTypes.instanceOf(MockObject).isRequired,
	onClose: PropTypes.func,
};

const defaultProps = {
	onClose: null,
};

function GameInfoOverlay({ onClose, game }) {
	return (
		<div className="stream__gameTag-overlay">
			<img className="stream__gameTag-thumbnail" src={game.medias.cover} alt={game.name} />
			<div className="stream__gameTag-text">
				<div>{game.name}</div>
				<div className="stream__gameTag-publisher">{game.publisher}</div>
			</div>
			<div onClick={onClose} className="stream__gameTag-close">
				<Icon icon="times-circle" />
			</div>
		</div>
	);
}

GameInfoOverlay.propTypes = propTypes;
GameInfoOverlay.defaultProps = defaultProps;

export default GameInfoOverlay;
