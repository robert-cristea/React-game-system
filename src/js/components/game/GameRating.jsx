import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Icon from '../icons/Icon';
import Game from '../../app/Game';

@observer
class GameRating extends Component {
	static propTypes = {
		game: PropTypes.instanceOf(Game),
	};
	static defaultProps = {
		game: null,
	};

	@observable
	rating = 1;

	/**
	 * @param {Game.rating} rating
	 */
	renderStars(rating) {
		const stars = [];
		const factor = 5 / rating.denominator;
		// const nb = Math.ceil(rating.numerator * factor);
		const nb = Math.ceil(this.rating * factor);

		for (let i = 0; i < nb; i += 1) {
			stars.push(
				<Icon
					icon="starFull"
					key={`full_${i}`}
					onClick={() => {
						this.rating = i + 1;
					}}
				/>,
			);
		}

		for (let i = nb; i < 5; i += 1) {
			stars.push(
				<Icon
					icon="starEmpty"
					key={`empty_${i}`}
					onClick={() => {
						this.rating = i + 1;
					}}
				/>,
			);
		}

		return stars;
	}

	render() {
		const { game } = this.props;

		return game.rating ? (
			<div className="gameDetails__myRating">
				{/* TODO: Add ability to rate games */}
				<div className="gameDetails__myRating-text">Rate this game</div>
				<div className="gameDetails__myRating-stars">{this.renderStars(game.rating)}</div>
			</div>
		) : null;
	}
}

export default GameRating;
