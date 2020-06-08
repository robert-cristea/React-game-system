import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/shop/Index';
import GameRepository from '../../../../app/Repositories/GameRepository';
import UI from '../../../../app/UI';
import Config from '../../../../app/Config';
import Store from '../../../../app/EStore/Store';

@inject('gameRepository', 'ui', 'eStore', 'config')
@observer
class Index extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * @type {Category|null}
	 */
	@observable
	currentCategory = null;

	@observable
	loading = false;

	/**
	 * @type {GameSearchResult|null}
	 */
	@observable
	searchResult = null;

	componentWillMount() {
		this.loadGames();
	}

	loadGames() {
		this.loading = true;
		const loggedIn = this.props.ui.loggedIn;
		const attributes = this.props.config.get('gameAttributes.store')(loggedIn);

		this.props.eStore.loadFrontPage(attributes, true, loggedIn).then(category => {
			// TODO: For the demo we hide the 'Because you played...' section for non logged in users.
			if (!loggedIn) {
				category.sections = category.sections.filter(section => {
					if (section.name.startsWith('Because you Played')) return false;
					if (section.name === 'Continue Playing') return false;
					return true;
				});
			}

			this.currentCategory = category;
			this.loading = false;
		});
	}

	handleSearch = query => {
		if (!query) {
			this.searchResult = null;
			return;
		}

		/** @type {GameRepository} */
		const repo = this.props.gameRepository;
		const loggedIn = this.props.ui.loggedIn;
		const attributes = this.props.config.get('gameAttributes.search')(loggedIn);

		this.loading = true;
		repo.search(query, attributes, loggedIn).then(result => {
			this.searchResult = result;
			this.loading = false;
		});
	};

	render() {
		return (
			<Component
				loading={this.loading}
				category={this.currentCategory}
				searchResult={this.searchResult}
				onSearch={this.handleSearch}
			/>
		);
	}
}

// Injected props
Index.wrappedComponent.propTypes = {
	gameRepository: PropTypes.instanceOf(GameRepository).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
	eStore: PropTypes.instanceOf(Store).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Index;
