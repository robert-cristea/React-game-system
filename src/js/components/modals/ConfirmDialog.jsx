import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import ConfirmDialogModel from '../../app/ConfirmDialog';
import Icon from '../icons/Icon';

let incrementor = 1;

function generateKey() {
	incrementor += 1;
	return incrementor;
}

@inject('confirm')
@observer
class ConfirmDialog extends ReactComponent {
	static propTypes = {};

	static defaultProps = {};

	/**
	 * @type {'hidden'|'visible'}
	 */
	@observable
	visibleState = 'hidden';

	/**
	 * @type {string}
	 */
	@observable
	message = '';

	/**
	 * @type {string}
	 */
	@observable
	title = '';

	/**
	 * @type {{
	 *     closeOnEsc: boolean,
	 *     closeOnClickOutside: boolean,
	 *     showClose: boolean,
	 * }}
	 */
	options = {};

	/**
	 * @type {Array<{
	 *     label: string,
	 *     isMain: boolean,
	 *     autoClose: boolean,
	 *     isCancel: boolean,
	 *     onClick: function,
	 * }>}
	 */
	@observable
	buttons = [];

	componentWillMount() {
		this.visibleState = 'hidden';
		this.props.confirm.registerComponent(this);
	}

	componentDidMount() {
		this.registerListeners();
	}

	componentWillUnmount() {
		this.unregisterListeners();
	}

	registerListeners() {
		window.document.addEventListener('keyup', this.keyListener);
	}

	unregisterListeners() {
		window.document.removeEventListener('keyup', this.keyListener);
	}

	keyListener = event => {
		if (event.key === 'Escape') {
			this.handleEscapePressed();
		}
	};

	handleEscapePressed = () => {
		if (this.options.closeOnEsc) {
			this.close();
		}
	};

	/**
	 * @param {MouseEvent} event
	 */
	handleOutsideMouseClick = event => {
		if (!this.options.closeOnClickOutside) {
			return;
		}

		const trap = event.currentTarget;
		const destination = event.target;

		if (trap === destination) {
			this.close();
		}
	};

	update(title = null, message = null, buttons = [], options = {}) {
		this.title = title;
		this.message = message;
		this.buttons.replace(buttons);
		this.options = options;
	}

	show = () => {
		this.visibleState = 'visible';
	};

	close = () => {
		this.visibleState = 'hidden';
	};

	renderButtons() {
		return this.buttons.map(button => {
			let callback = this.close;

			if (button.onClick) {
				if (button.autoClose === false) {
					callback = button.onClick;
				} else {
					callback = () => {
						button.onClick();
						this.close();
					};
				}
			}

			return (
				<button
					key={generateKey(button)}
					className={`confirmDialog__action btn btn--${button.isMain ? 'main' : 'border'}`}
					onClick={callback}
				>
					{button.label}
				</button>
			);
		});
	}

	render() {
		let title = null;
		let message = null;
		let close = null;

		if (this.title) {
			title = <div className="confirmDialog__title">{this.title}</div>;
		}

		if (this.message) {
			message = (
				<div className="confirmDialog__message">
					<p>{this.message}</p>
				</div>
			);
		}

		if (this.options.showClose) {
			close = (
				<button className="confirmDialog__close btn btn--transparent" onClick={this.close} type="button">
					<Icon icon="cancel" />
				</button>
			);
		}

		return (
			<div className={`confirmDialog confirmDialog--${this.visibleState}`} onClick={this.handleOutsideMouseClick}>
				<div className="confirmDialog__dialog">
					{close}
					{title}
					{message}
					<div className="confirmDialog__actions">{this.renderButtons()}</div>
				</div>
			</div>
		);
	}
}

// Injected props
ConfirmDialog.wrappedComponent.propTypes = {
	confirm: PropTypes.instanceOf(ConfirmDialogModel).isRequired,
};

export default ConfirmDialog;
