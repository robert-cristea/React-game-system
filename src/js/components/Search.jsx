import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Icon from './icons/Icon';

@observer
class Search extends Component {
	static propTypes = {
		placeholder: PropTypes.string,
		// Called when the user presses the <Enter> key or when the search value is cleared
		onSearch: PropTypes.func,
		// Called everytime the search value changes
		onChange: PropTypes.func,
	};

	static defaultProps = {
		placeholder: '',
		onSearch: null,
		onChange: null,
	};

	@observable
	searchTerm = '';

	hasSearch() {
		return this.searchTerm.trim().length > 0;
	}

	handleSearchChange = event => {
		this.searchTerm = event.target.value;

		if (this.searchTerm === '' && this.props.onSearch) {
			this.props.onSearch('');
		}

		if (this.props.onChange) {
			this.props.onChange(this.searchTerm);
		}
	};

	handleSearch = event => {
		event.preventDefault();

		if (this.props.onSearch) {
			this.props.onSearch(this.searchTerm);
		}
	};

	handleClear = () => {
		this.searchTerm = '';

		if (this.props.onSearch) {
			this.props.onSearch('');
		}

		if (this.props.onChange) {
			this.props.onChange('');
		}
	};

	render() {
		return (
			<form className="search" onSubmit={this.handleSearch}>
				{this.hasSearch() ? (
					<button className="search-button btn btn--transparent" onClick={this.handleClear} type="button">
						<Icon icon="remove" />
					</button>
				) : (
					<button className="search-button btn btn--transparent" onClick={this.handleSearch} type="button">
						<Icon icon="search" />
					</button>
				)}
				<input value={this.searchTerm} placeholder={this.props.placeholder} onChange={this.handleSearchChange} />
			</form>
		);
	}
}

export default Search;
