import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { observable, computed } from 'mobx';
import { get } from 'lodash';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import UserGameComponent from '../../../game/UserGame';
import UserGame from '../../../../app/UserGame';
import Icon from '../../../icons/Icon';
import Loading from '../../../Loading';
import Card from '../../../card/Card';
import Search from '../../../Search';

@observer
class Index extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		userGames: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(UserGame)),
		onOpenStore: PropTypes.func,
		onGameClick: PropTypes.func,
		onPlayGame: PropTypes.func,
		onDownloadComplete: PropTypes.func,
		onPauseClick: PropTypes.func,
		onResumeClick: PropTypes.func,
		onCancelClick: PropTypes.func,
		onUpdateClick: PropTypes.func,
		onUninstallClick: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		userGames: [],
		onOpenStore: null,
		onGameClick: null,
		onPlayGame: null,
		onDownloadComplete: null,
		onPauseClick: null,
		onResumeClick: null,
		onCancelClick: null,
		onUpdateClick: null,
		onUninstallClick: null,
	};

	/**
	 * Current display format
	 * @type {'grid'|'list'}
	 */
	@observable
	displayFormat = 'grid';

	@observable
	filteredGames = [];

	@observable
	selectedCategory = null;

	@observable
	searchTerm = '';

	searchRef = null;

	componentWillMount() {
		this.filterGames();
	}

	@computed get categories() {
		const uniqueCategories = new Map();
		const buffer = [];

		this.props.userGames.map(userGame => {
			const categories = get(userGame, 'game.shopDetails.gameCategories', []);

			if (categories.length) {
				categories.map(category => uniqueCategories.set(String(category.id), category.title));
			}

			return null;
		});

		buffer.push({
			label: 'All',
			value: '',
		});

		uniqueCategories.forEach((label, value) => buffer.push({ label, value }));

		return buffer;
	}

	filterGames(/* type, value */) {
		const games = this.props.userGames;
		const searchValue = this.searchTerm.toLowerCase();
		const categoryValue = get(this.selectedCategory, 'value', '');
		let result = games;

		if (categoryValue) {
			result = result.filter(userGame =>
				get(userGame, 'game.shopDetails.gameCategories', []).reduce(
					(acc, category) => acc || category.id === categoryValue,
					false,
				),
			);
		}

		if (searchValue) {
			result = result.filter(userGame => {
				const name = String(get(userGame, 'game.name', '')).toLowerCase();
				return name.includes(searchValue);
			});
		}

		this.filteredGames = result;
	}

	handleOpenStore = () => {
		if (this.props.onOpenStore) {
			this.props.onOpenStore();
		}
	};

	handleCategoryChange = option => {
		this.selectedCategory = option;

		this.filterGames('category', option.value);
	};

	handleSearch = searchTerm => {
		this.searchTerm = searchTerm;

		this.filterGames('search', searchTerm);
	};

	handleToggleFormat = format => {
		if (format) this.displayFormat = format;
	};

	renderHeader(games) {
		return (
			<div className="userGames__header">
				<Icon icon="games" />
				<h1 className="userGames__title">MY GAMES</h1>

				{games.length ? (
					<div className="userGames__toggle-wrap">
						<button
							className={`userGames__toggle btn btn--transparent ${
								this.displayFormat === 'grid' ? 'userGames__toggle--active' : ''
							}`}
							onClick={() => this.handleToggleFormat('grid')}
							type="button"
						>
							<Icon icon="grid" />
						</button>
						<button
							className={`userGames__toggle btn btn--transparent ${
								this.displayFormat === 'list' ? 'userGames__toggle--active' : ''
							}`}
							onClick={() => this.handleToggleFormat('list')}
							type="button"
						>
							<Icon icon="list" />
						</button>
					</div>
				) : null}
			</div>
		);
	}

	renderFilters() {
		return (
			<div className="userGames__filters">
				<div className="userGames__category">
					<Select
						value={this.selectedCategory}
						options={this.categories}
						name="category"
						isSearchable
						placeholder="Categories"
						onChange={this.handleCategoryChange}
						className="select-react__container"
						classNamePrefix="select-react"
					/>
				</div>
				<Search
					ref={ref => {
						this.searchRef = ref;
					}}
					onSearch={this.handleSearch}
					placeholder="Search"
				/>
			</div>
		);
	}

	renderEmpty() {
		return this.searchTerm ? (
			<Card title="No Search Results!" text="There are no games that match you request." />
		) : (
			<Card
				title="Welcome!"
				text="You haven't purchased any games yet."
				buttonTitle="VISIT STORE"
				onButtonClick={this.handleOpenStore}
			/>
		);
	}

	renderGames(games) {
		return (
			<div className="grid">
				<div className="row">
					{games.map(
						/** @type {UserGame} */ userGame => ((
							<div
								key={userGame.game.id}
								className={
									this.displayFormat === 'grid' ? 'col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2' : 'col-xs-12'
								}
							>
								<UserGameComponent
									key={userGame.game.id}
									userGame={userGame}
									displayFormat={this.displayFormat}
									onGameClick={this.props.onGameClick}
									onPlayGame={this.props.onPlayGame}
									onDownloadComplete={this.props.onDownloadComplete}
									onPauseClick={this.props.onPauseClick}
									onResumeClick={this.props.onResumeClick}
									onCancelClick={this.props.onCancelClick}
									onUpdateClick={this.props.onUpdateClick}
									onUninstallClick={this.props.onUninstallClick}
								/>
							</div>
						)),
					)}

					<ReactTooltip id="tooltip-user-game-action" className="tooltip" place="bottom" effect="solid" />
				</div>
			</div>
		);
	}

	render() {
		const games = this.filteredGames;

		return (
			<div className="userGames">
				{this.renderHeader(games)}
				{this.renderFilters()}
				{this.props.loading ? (
					<div className="userGames__loading">
						<Loading />
					</div>
				) : (
					<Fragment>{games.length ? this.renderGames(games) : this.renderEmpty()}</Fragment>
				)}
			</div>
		);
	}
}

export default Index;
