import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/icons/Icon';

class TagsInput extends ReactComponent {
	static propTypes = {
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				label: PropTypes.string,
				data: PropTypes.any,
			}),
		),
		searchValue: PropTypes.string,
		onRemoveTag: PropTypes.func,
		onSearchChange: PropTypes.func,
	};

	static defaultProps = {
		tags: [],
		searchValue: '',
		onRemoveTag: null,
		onSearchChange: null,
	};

	containerRef = null;
	inputRef = null;

	handleClick = event => {
		// When we click the background (not any tag), we focus the input
		if (event.target === this.containerRef) {
			this.inputRef.focus();
		}
	};

	handleTagRemove = tag => () => {
		if (this.props.onRemoveTag) {
			this.props.onRemoveTag(tag);
		}
	};

	handleClear = () => {
		if (this.props.onSearchChange) {
			this.props.onSearchChange('');
		}
	};

	handleChange = event => {
		if (this.props.onSearchChange) {
			this.props.onSearchChange(event.target.value);
		}
	};

	render() {
		const tags = this.props.tags.map(tag => (
			<div className="tagsInput__tag" key={tag.id}>
				<span className="tagsInput__tagLabel">{tag.label}</span>
				<span className="tagsInput__tagRemove" onClick={this.handleTagRemove(tag)}>
					<Icon icon="cancel" />
				</span>
			</div>
		));

		const hasSearch = this.props.searchValue.trim() !== '';

		return (
			<div
				ref={ref => {
					this.containerRef = ref;
				}}
				className={`tagsInput ${this.props.tags.length === 0 ? 'tagsInput--empty' : ''}`}
				onClick={this.handleClick}
			>
				{tags}
				<div className="tagsInput__inputContainer">
					<input
						className="tagsInput__search"
						ref={ref => {
							this.inputRef = ref;
						}}
						type="search"
						value={this.props.searchValue}
						placeholder="Search contacts..."
						onChange={this.handleChange}
					/>
					<div className="tagsInput__clear" style={{ display: hasSearch ? 'block' : 'none' }}>
						<Icon icon="remove" onClick={this.handleClear} />
					</div>
				</div>
			</div>
		);
	}
}

export default TagsInput;
