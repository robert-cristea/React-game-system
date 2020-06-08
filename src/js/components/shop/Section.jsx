import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import Slider from 'react-slick';
import Icon from '../icons/Icon';
import GameContainer from '../../containers/shop/Game';
import Game from '../../app/Game';

const sortingTypes = ['recent', 'rating', 'playCount'];

const sortingConfig = {
	recent: {
		id: 'recent',
		label: 'LATEST',
		compareFunction: (a, b) => {
			if (a.publishedAt && b.publishedAt) {
				return moment(a.publishedAt).isBefore(b.publishedAt) ? 1 : -1;
			}
			return 0;
		},
	},
	rating: {
		id: 'rating',
		label: 'TOP RATED',
		compareFunction: (a, b) => {
			if (a.rating && b.rating) {
				return b.rating.numerator - a.rating.numerator;
			}
			return 0;
		},
	},
	playCount: {
		id: 'playCount',
		label: 'MOST PLAYED',
		compareFunction: (a, b) => {
			if (a.playCount && b.playCount) {
				return b.playCount - a.playCount;
			}
			return 0;
		},
	},
};

const sliderConfig = {
	default: {
		slidesToShow: 7,
		slidesToScroll: 3,
		responsive: [
			{
				breakpoint: 2400,
				settings: {
					slidesToShow: 6,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 2000,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	},
	featured: {
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1800,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	},
};

@observer
class Index extends Component {
	static propTypes = {
		featured: PropTypes.bool,
		title: PropTypes.string,
		icon: PropTypes.string,
		games: PropTypes.arrayOf(PropTypes.instanceOf(Game)).isRequired,
		sorting: PropTypes.arrayOf(PropTypes.oneOf(sortingTypes)),
	};
	static defaultProps = {
		featured: false,
		title: '',
		icon: 'games',
		sorting: [],
	};

	@observable
	selectedSorting = '';

	/** @type {Game[]} */
	@observable
	sortedGames = [];

	@observable
	sliderSettings = {};

	componentWillMount() {
		this.selectedSorting = this.props.sorting.length ? this.props.sorting[0] : 'recent';

		this.sliderSettings = this.props.featured ? sliderConfig.featured : sliderConfig.default;

		this.sortGames();
	}

	sortGames() {
		if (this.props.games.length) {
			this.sortedGames = [...this.props.games].sort(sortingConfig[this.selectedSorting].compareFunction);
		}
	}

	handleSortingChange = sorting => {
		if (sorting) {
			this.selectedSorting = sorting;
			this.sortGames();
		}
	};

	renderToggle() {
		return this.props.sorting.length ? (
			<div className="shopSection__toggle-wrap">
				{this.props.sorting.map(sortingType => {
					const sorting = sortingConfig[sortingType];
					return (
						sorting && (
							<button
								key={sorting.id}
								className={`shopSection__toggle btn btn--link ${
									this.selectedSorting === sorting.id ? 'shopSection__toggle--active' : ''
								}`}
								onClick={() => this.handleSortingChange(sorting.id)}
								type="button"
							>
								{sorting.label}
							</button>
						)
					);
				})}
			</div>
		) : null;
	}

	renderHeader() {
		return (
			<div className="shopSection__header">
				<Icon icon={this.props.icon} />
				<h1 className="shopSection__title">{this.props.title}</h1>
				{!this.props.featured && this.renderToggle()}
			</div>
		);
	}

	renderGames() {
		return this.sortedGames.map(
			/** @type {Game} */ game => (<GameContainer key={game.id} game={game} featured={this.props.featured} />),
		);
	}

	render() {
		return (
			<div className="shopSection">
				{this.props.games && this.props.games.length && (
					<Fragment>
						{this.renderHeader()}
						<Slider
							infinite={false}
							draggable={false}
							className={`shopSection__games ${this.props.featured ? 'shopSection__games--featured' : ''}`}
							{...this.sliderSettings}
						>
							{this.renderGames()}
						</Slider>
					</Fragment>
				)}
			</div>
		);
	}
}

export default Index;
