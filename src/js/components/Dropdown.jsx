import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import UI from '../app/UI';

@inject('ui')
@observer
class Dropdown extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
		button: PropTypes.func.isRequired,
		position: PropTypes.string,
		theme: PropTypes.string,
		handlers: PropTypes.object,
		onRef: PropTypes.func,
	};
	static defaultProps = {
		position: 'right',
		theme: 'default',
		handlers: {
			show: null,
			hide: null,
		},
		onRef: null,
	};

	@observable
	dropdownActive = false;

	buttonRef = null;
	dropdownRef = null;

	componentWillMount() {
		const handlers = this.props.handlers;

		if (handlers.show) {
			this.props.ui.registerHandler(handlers.show, this.handleOpen.bind(this));
		}

		if (handlers.hide) {
			this.props.ui.registerHandler(handlers.hide, this.handleHide.bind(this));
		}
	}

	componentDidMount() {
		if (this.props.onRef) {
			this.props.onRef(this);
		}
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		if (this.props.onRef) {
			this.props.onRef(undefined);
		}
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	renderButton() {
		if (this.props.button) {
			return this.props.button;
		}
		return null;
	}

	handleHide = () => {
		this.dropdownActive = false;
	};

	handleOpen = () => {
		this.dropdownActive = true;
	};

	handleClick = () => {
		if (this.dropdownActive) {
			this.handleHide();
		} else {
			this.handleOpen();
		}
	};

	handleClickOutside = event => {
		if (
			this.dropdownActive &&
			this.dropdownRef &&
			this.buttonRef &&
			!this.buttonRef.contains(event.target) &&
			!this.dropdownRef.contains(event.target)
		) {
			this.handleHide();
		}
	};

	render() {
		return (
			<Fragment>
				<button
					ref={node => {
						this.buttonRef = node;
					}}
					onClick={this.handleClick}
					className="dropdown__button"
				>
					{this.renderButton()}
				</button>
				{this.dropdownActive && (
					<div
						ref={node => {
							this.dropdownRef = node;
						}}
						className={`dropdown dropdown--${this.props.position} dropdown--${this.props.theme}`}
					>
						{this.props.children}
					</div>
				)}
			</Fragment>
		);
	}
}

// Injected props
Dropdown.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Dropdown;
