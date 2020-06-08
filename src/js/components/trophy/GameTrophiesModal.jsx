import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import MockObject from '../../mock/MockObject';
import ScrollableView from '../ScrollableView';
import Icon from '../icons/Icon';

const propTypes = {
	game: PropTypes.instanceOf(MockObject).isRequired,
	onBack: PropTypes.func,
};

const defaultProps = {
	onBack: null,
};

/**
 * @param {string} name
 * @param {string} description
 * @param {boolean} locked
 * @param {number} difficulty Out of 3
 * @param {number} frequency Between 0 and 1
 */
function renderTrophy(name, description, locked, difficulty, frequency, thumbsrc) {
	const frequencyLabel = frequency < 0.5 ? 'rare' : 'common';
	const difficultyIndicators = [];

	for (let i = 0; i < 3; i += 1) {
		if (i < difficulty) {
			difficultyIndicators.push(<span className="trophiesModal__marker trophiesModal__marker--achieved" key={i} />);
		} else {
			difficultyIndicators.push(<span className="trophiesModal__marker trophiesModal__marker" key={i} />);
		}
	}

	return (
		<div key={name} className={`activities__card card__small ${locked ? 'trophiesModal__locked' : ''}`}>
			<div className="activities__meta">
				{locked ? (
					<div className="stream__gameTag-thumbnail">
						<Icon icon="lock" />
					</div>
				) : (
					<img className="stream__gameTag-thumbnail" src={thumbsrc} alt={name} />
				)}
				<div className="activities__text">
					<div>{name}</div>
					<div className="trophiesModal__description">{description}</div>
					<div className="trophiesModal__progress">
						<Icon icon="trophy" />
						<div className="trophiesModal__markers-container">{difficultyIndicators}</div>
						<div className="trophiesModal__difficulty">
							{frequencyLabel}
							<b> {numeral(frequency).format('0.0%')}</b>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function GameTrophiesModal({ game, ...props }) {
	return (
		<div className="flex-container">
			<AppBar pre={<Back onClick={props.onBack} />} title={game.name} />
			<ScrollableView>
				<div className="communityModal__hero" style={{ backgroundImage: `url(${game.medias.activity})` }}>
					<div className="communityModal__wrapper">
						<img className="communityModal__thumb" src={game.medias.cover} alt={game.name} />
						<div className="communityModal__name">{game.name}</div>
					</div>
				</div>
				<div className="activites__list">
					<div className="trophiesModal__achievements">
						{renderTrophy(
							'Marksmanship',
							'Be awarded with 5 kills in 5 minutes.',
							false,
							2,
							0.985,
							'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/achievements/marksman.png',
						)}
						{renderTrophy(
							'Rogue Leader',
							'Lead the team in points for 3 rounds',
							false,
							1,
							0.055,
							'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/achievements/leader.png',
						)}
						{renderTrophy(
							'Freerunner',
							'Lead the team in points for 3 rounds',
							true,
							1,
							0.985,
							'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/achievements/marksman.png',
						)}
						{renderTrophy(
							'Ultramarathon',
							'Play for 24 hours straight.',
							false,
							1,
							0.055,
							'https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/achievements/ultramarathon.png',
						)}
					</div>
				</div>
			</ScrollableView>
		</div>
	);
}

GameTrophiesModal.propTypes = propTypes;
GameTrophiesModal.defaultProps = defaultProps;

export default GameTrophiesModal;
