import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Select from 'react-select';
import Icon from '../icons/Icon';

const PAGE_SIZE_OPTIONS = [{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '50', value: 50 }];

@observer
class OrderPagination extends Component {
	static propTypes = {
		pagination: PropTypes.object,
		onUpdatePagination: PropTypes.func,
	};

	static defaultProps = {
		pagination: {},
		onUpdatePagination: null,
	};

	@observable
	selectedPageSize = null;

	componentDidMount() {
		this.selectedPageSize = PAGE_SIZE_OPTIONS.find(option => option.value === 10);
	}

	loadNextPage = () => {
		const { onUpdatePagination, pagination } = this.props;
		const { hasNext, page } = pagination;

		if (onUpdatePagination && hasNext) {
			onUpdatePagination(page + 1);
		}
	};

	loadPreviousPage = () => {
		const { onUpdatePagination, pagination } = this.props;
		const { page } = pagination;

		if (onUpdatePagination && page > 1) {
			onUpdatePagination(page - 1);
		}
	};

	handlePageSizeChange = option => {
		const { onUpdatePagination, pagination } = this.props;
		const { page } = pagination;

		this.selectedPageSize = option;

		if (onUpdatePagination) {
			onUpdatePagination(page, option.value);
		}
	};

	render() {
		return (
			<div className="orders__pagination">
				<p className="orders__pagination-text">Show</p>

				<div className="orders__pagination-select">
					<Select
						value={this.selectedPageSize}
						options={PAGE_SIZE_OPTIONS}
						isSearchable={false}
						name="pageSize"
						placeholder=""
						onChange={this.handlePageSizeChange}
						className="select-react__container"
						classNamePrefix="select-react"
					/>
				</div>

				<p className="orders__pagination-text">per page</p>

				<button
					className={`orders__pagination-button ${
						this.props.pagination.page > 1 ? '' : 'orders__pagination-button--disabled'
					}`}
					onClick={this.loadPreviousPage}
				>
					<Icon icon="arrowLeft" />
				</button>

				<button
					className={`orders__pagination-button ${
						this.props.pagination.hasNext ? '' : 'orders__pagination-button--disabled'
					}`}
					onClick={this.loadNextPage}
				>
					<Icon icon="arrowRight" />
				</button>
			</div>
		);
	}
}

export default OrderPagination;
