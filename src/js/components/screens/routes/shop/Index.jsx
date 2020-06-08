import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import Select from 'react-select';
import Section from '../../../shop/Section';
import Loading from '../../../Loading';
import Card from '../../../card/Card';
import Search from '../../../Search';
import GameContainer from '../../../../containers/shop/Game';
import Category from '../../../../app/EStore/Category';
import GameSearchResult from '../../../../app/GameSearchResult';

@observer
class Index extends Component {
	static propTypes = {
		category: PropTypes.instanceOf(Category),
		searchResult: PropTypes.instanceOf(GameSearchResult),
		loading: PropTypes.bool,
		onSearch: PropTypes.func,
	};

	static defaultProps = {
		category: null,
		searchResult: null,
		loading: false,
		onSearch: null,
	};

	@observable
	selectedCategory = '';

	searchRef = null;

	@computed get categories() {
		const buffer = [];

		buffer.push({
			label: 'All',
			value: '',
		});

		if (this.props.category && this.props.category.sections) {
			this.props.category.sections.forEach(section =>
				buffer.push({
					label: section.name,
					value: section.id,
				}),
			);
		}

		return buffer;
	}

	handleCategoryChange = option => {
		this.selectedCategory = option;

		if (this.searchRef) {
			this.searchRef.handleClear();
		}
	};

	handleSearch = searchTerm => {
		if (searchTerm && this.selectedCategory) {
			this.selectedCategory = null;
		}

		if (this.props.onSearch) {
			this.props.onSearch(searchTerm);
		}
	};

	parseSorting(section) {
		const sorting = [];

		if (section.sortLatest) sorting.push('recent');
		if (section.sortTopRated) sorting.push('rating');
		if (section.sortMostPlayed) sorting.push('playCount');

		return sorting;
	}

	renderHeader() {
		return (
			<div className="shop__header">
				<div className="shop__category">
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

	renderFeatured(category) {
		return <Section featured title="FEATURED" icon="starEmpty" games={category.featuredGames} />;
	}

	renderSections(category) {
		let sections = null;

		if (this.selectedCategory && this.selectedCategory.value) {
			sections = category.sections.filter(section => section.id === this.selectedCategory.value);
		} else {
			sections = category.sections;
		}

		return sections.map(
			/** @type {CategorySection} */ section => ((
				<Section key={section.id} title={section.name} games={section.games} sorting={this.parseSorting(section)} />
			)),
		);
	}

	renderGames() {
		/** @type {Game} */
		const games = this.props.searchResult.games;

		return (
			games && (
				<div className="grid">
					<div className="row">
						{games.map(
							/** @type {Game} */ game => ((
								<div className="col-xs-3" key={game.id}>
									<GameContainer game={game} />
								</div>
							)),
						)}
					</div>
				</div>
			)
		);
	}

	renderCategory() {
		/** @type {Category} */
		const category = this.props.category;

		return (
			<Fragment>
				{category.featuredGames.length && !this.selectedCategory && this.renderFeatured(category)}
				{this.renderSections(category)}
			</Fragment>
		);
	}

	renderContent() {
		return this.props.category ? (
			this.renderCategory()
		) : (
			<Card title="Welcome!" text="This category does not have any games yet." />
		);
	}

	renderSearchResults() {
		return this.props.searchResult.games.length ? (
			this.renderGames()
		) : (
			<Card title="No Search Results!" text="There are no games that match you request." />
		);
	}

	render() {
		return (
			<div className="shop">
				{this.renderHeader()}
				{this.props.loading ? (
					<div className="shop__loading">
						<Loading />
					</div>
				) : (
					<Fragment>{this.props.searchResult ? this.renderSearchResults() : this.renderContent()}</Fragment>
				)}
			</div>
		);
	}
}

export default Index;
