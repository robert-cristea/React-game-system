import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Icon from '../icons/Icon';
import Game from '../../app/Game';
import { formatToken } from '../../app/utils';

class Index extends Component {
	static propTypes = {
		game: PropTypes.instanceOf(Game).isRequired,
		featured: PropTypes.bool,
		loggedIn: PropTypes.bool,
		onGameClick: PropTypes.func,
		onAddToCart: PropTypes.func,
		onLogin: PropTypes.func,
		onPlayGame: PropTypes.func,
		onDownloadGame: PropTypes.func,
	};
	static defaultProps = {
		featured: false,
		loggedIn: false,
		onGameClick: null,
		onAddToCart: null,
		onLogin: null,
		onPlayGame: null,
		onDownloadGame: null,
	};

	handleGameClick = () => {
		if (this.props.onGameClick) {
			this.props.onGameClick(this.props.game.id);
		}
	};

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

	renderCover(game) {
		const coverType = this.props.featured ? 'banner' : 'cover';
		const cover = get(game, 'shopDetails.medias', []).filter(media => media.type.name.toLowerCase() === coverType)[0];

		return cover && <img src={cover.thumbSmall} alt={cover.title} />;
	}

	renderCategories(game) {
		const categories = get(game, 'shopDetails.gameCategories', []);
		return categories.length ? (
			<div className="shopGame__genres">
				{categories.map(category => (
					<span key={category.title} className="shopGame__genre">
						{category.title}
					</span>
				))}
			</div>
		) : null;
	}

	renderRating(game) {
		const rating = get(game, 'rating');

		return (
			rating && (
				<div className="shopGame__rating-wrap">
					<Icon icon="starEmpty" />
					<div className="shopGame__rating">
						{rating.numerator} / {rating.denominator}
					</div>
				</div>
			)
		);
	}

	renderPrice(game) {
		const { onSale, price, salePrice } = game;

		return onSale ? (
			<Fragment>
				<span>{formatToken(salePrice)}</span>
				<span className="shopGame__button--sale">{formatToken(price)}</span>
			</Fragment>
		) : (
			<span>{formatToken(price)}</span>
		);
	}

	renderPriceButton(game) {
		return game.published ? (
			<button className="btn btn--secondary btn--small shopGame__button" onClick={this.handleAddToCart} type="button">
				<Icon icon="logo" />
				{this.renderPrice(game)}
			</button>
		) : (
			<button className="btn btn--secondary btn--small shopGame__button" onClick={this.handleGameClick} type="button">
				<span>COMING SOON</span>
			</button>
		);
	}

	renderPurchasedButton(game) {
		return game.userDownloaded ? (
			<button className="btn btn--main btn--small shopGame__button" onClick={this.handlePlayGame} type="button">
				<span>PLAY GAME</span>
			</button>
		) : (
			<button className="btn btn--main btn--small shopGame__button" onClick={this.handleDownloadGame} type="button">
				<span>DOWNLOAD</span>
			</button>
		);
	}

	renderOverlayButton() {
		return this.props.loggedIn ? (
			<button
				className="btn btn--main btn--small shopGame__button shopGame__button--overlay"
				onClick={this.handleAddToCart}
				type="button"
			>
				<Icon icon="cart" />
			</button>
		) : (
			<button
				className="btn btn--main btn--small shopGame__button shopGame__button--overlay"
				onClick={this.handleLogin}
				type="button"
			>
				<span>SIGN IN</span>
			</button>
		);
	}

	renderCta(game) {
		return (
			<div className="shopGame__cta shopGame__cta--overlay">
				{game.userPurchased ? (
					this.renderPurchasedButton(game)
				) : (
					<Fragment>
						{this.renderPriceButton(game)}
						{game.published && this.renderOverlayButton(game)}
					</Fragment>
				)}
			</div>
		);
	}

	render() {
		const game = this.props.game;

		const hasContent = Boolean(game && game.shopDetails);

		return hasContent ? (
			<div className={`shopGame ${this.props.featured ? 'shopGame--featured' : ''}`}>
				<button className="shopGame__image" onClick={this.handleGameClick} type="button">
					{this.renderCover(game)}
				</button>
				<div className="shopGame__wrap">
					<div className="shopGame__content">
						<button className="shopGame__title" onClick={this.handleGameClick}>
							{game.name}
						</button>
						<div className="shopGame__text">
							{this.renderCategories(game)}
							{this.renderRating(game)}
						</div>
					</div>
					{this.renderCta(game)}
				</div>
			</div>
		) : null;
	}
}

export default Index;
