import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Icon from '../icons/Icon';
import Game from '../../app/Game';

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GameAttributes(props) {
	const { game } = props;
	const { rating } = game;

	return (
		<Fragment>
			<div className="gameDetails__info-section">
				<Icon icon="community" />
				<p className="gameDetails__info-descriptor">{/* TODO: Add real data */}8 Friends, 2.6k Communities</p>
			</div>

			<div className="gameDetails__info-section">
				<Icon icon="headset" />
				<p className="gameDetails__info-descriptor">
					{/* TODO: Add real data */}
					123 Streaming, 5k Video, 228 Captures
				</p>
			</div>

			{rating && (
				<div className="gameDetails__info-section">
					<Icon icon="starEmpty" />
					<p className="gameDetails__info-descriptor">
						{`Rated ${rating.numerator} / ${rating.denominator} by ${numeral(rating.populationSize).format(
							'0.0a',
						)} players.`}
					</p>
				</div>
			)}
		</Fragment>
	);
}

GameAttributes.propTypes = propTypes;
GameAttributes.defaultProps = defaultProps;

export default GameAttributes;
