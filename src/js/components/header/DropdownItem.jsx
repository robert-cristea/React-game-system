import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import UI from '../../app/UI';

@inject('ui')
@observer
class DropdownItem extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		url: PropTypes.string,
		className: PropTypes.string,
		onClick: PropTypes.func,
		onClose: PropTypes.func,
	};
	static defaultProps = {
		url: null,
		onClick: null,
		onClose: null,
		className: '',
	};

	handleClick = () => {
		if (this.props.url) {
			this.props.ui.router.goTo(this.props.url);
		} else if (this.props.onClick) {
			this.props.onClick();
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	};

	render() {
		return (
			<button className={`${this.props.className}__dropdown-item`} onClick={this.handleClick}>
				{this.props.title}
			</button>
		);
	}
}

// Injected props
DropdownItem.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default DropdownItem;
