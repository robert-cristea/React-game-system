import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { get } from 'lodash';
import Icon from '../../icons/Icon';
import Game from '../../../app/Game';
import Loading from '../../Loading';

import GameFlags from '../../game/GameFlags';
import GameCover from '../../game/GameCover';
import GamePlatforms from '../../game/GamePlatforms';
import GameAttributes from '../../game/GameAttributes';
import GamePrice from '../../game/GamePrice';
import GameRating from '../../game/GameRating';
import GameDescription from '../../game/GameDescription';
import GameMedias from '../../game/GameMedias';

const buttonConfig = {
	login: {
		title: 'SIGN IN',
		action: 'handleLogin',
	},
	play: {
		title: 'PLAY GAME',
		action: 'handlePlayGame',
	},
	download: {
		title: 'DOWNLOAD',
		action: 'handleDownloadGame',
	},
	buy: {
		title: 'ADD TO CART',
		icon: 'cart',
		action: 'handleAddToCart',
	},
	comingSoon: {
		title: 'COMING SOON',
		class: 'btn--secondary',
	},
};

@observer
class GameDetailsComponent extends Component {
	static propTypes = {
		game: PropTypes.instanceOf(Game),
		loggedIn: PropTypes.bool,
		loading: PropTypes.bool,
		onAddToCart: PropTypes.func,
		onLogin: PropTypes.func,
		onPlayGame: PropTypes.func,
		onDownloadGame: PropTypes.func,
	};
	static defaultProps = {
		game: null,
		loggedIn: false,
		loading: false,
		onAddToCart: null,
		onLogin: null,
		onPlayGame: null,
		onDownloadGame: null,
	};

	@observable
	like = false;

	handleAddToCart = () => {
		if (this.props.onAddToCart) {
			this.props.onAddToCart(this.props.game);
		}
	};

	handlePlayGame = () => {
		if (this.props.onPlayGame) {
			this.props.onPlayGame(this.props.game.id);
		}
	};

	handleDownloadGame = () => {
		if (this.props.onDownloadGame) {
			this.props.onDownloadGame(this.props.game.id);
		}
	};

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	cta(type) {
		const config = buttonConfig[type];

		if (config) {
			const action = config.action ? { onClick: this[config.action] } : null;

			return (
				config && (
					<button
						className={`btn btn--wide gameDetails__button ${config.class ? config.class : 'btn--main'}`}
						{...action}
						type="button"
					>
						{config.icon && <Icon icon={config.icon} />}
						<span>{config.title}</span>
					</button>
				)
			);
		}
		return null;
	}

	renderLikes() {
		return (
			<Fragment>
				<Icon
					icon={this.like ? 'heartFull' : 'heartEmpty'}
					onClick={() => {
						this.like = !this.like;
					}}
					className="gameDetails__info-interactable"
				/>
				<p className="gameDetails__info-descriptor">
					{/* TODO: Add real data */}
					{825 + (this.like ? 1 : 0)} Likes
				</p>
			</Fragment>
		);
	}

	renderAttributes(game) {
		return (
			<Fragment>
				<div className="gameDetails__info-section">{this.renderLikes()}</div>

				<GameAttributes game={game} />

				<div className="gameDetails__info-section">
					<GameFlags game={game} />
					<GamePlatforms game={game} />
				</div>
			</Fragment>
		);
	}

	renderCta(game) {
		/* eslint-disable no-nested-ternary,indent */
		const type = !this.props.loggedIn
			? 'login'
			: game.userPurchased
			? game.userDownloaded
				? 'play'
				: 'download'
			: game.published
			? 'buy'
			: 'comingSoon';
		/* eslint-enable */

		return (
			<div className="gameDetails__cta">
				<GamePrice game={game} />
				{this.cta(type)}
			</div>
		);
	}

	renderCategories(game) {
		const categories = get(game, 'shopDetails.gameCategories', []);

		return categories.length ? (
			<p className="gameDetails__genres">
				{categories.map(category => (
					<span key={category.title} className="gameDetails__genre">
						{category.title}
					</span>
				))}
			</p>
		) : null;
	}

	renderInfo(game) {
		return (
			<div className="gameDetails__info">
				<div className="grid">
					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<h1 className="gameDetails__info-title">{game.name}</h1>
							{this.renderCategories(game)}
							{this.renderAttributes(game)}
						</div>
						<div className="col-xs-12 col-sm-6">
							{this.renderCta(game)}
							{this.props.loggedIn && <GameRating game={game} />}
							<div className="gameDetails__separator" />
							<GameDescription game={game} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		const { game } = this.props;

		return (
			<Fragment>
				{this.props.loading || !game ? (
					<div className="gameDetails__loading">
						<Loading />
					</div>
				) : (
					<Fragment>
						<GameCover game={game} />
						{this.renderInfo(game)}
						<GameMedias game={game} />
					</Fragment>
				)}
			</Fragment>
		);
	}
}

export default GameDetailsComponent;
