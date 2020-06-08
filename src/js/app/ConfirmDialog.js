class ConfirmDialog {
	/**
	 * React component of the dialog.
	 *
	 * @type {React.Component}
	 */
	component = null;

	defaultOptions = {
		closeOnEsc: true,
		closeOnClickOutside: true,
		showClose: true,
	};

	registerComponent(component) {
		this.component = component;
	}

	/**
	 * Shows the confirm component with the specified title, message and buttons
	 * @param {string} title
	 * @param {string} message
	 * @param {Array<{
	 *     label: {string}  Label of the button,
	 *     isMain: {boolean}  If true set the "main" look on this button,
	 *     autoClose: {boolean}  If true the confirm is closed when clicking, after running onClick,
	 *     isCancel: {boolean}  If true clicking this button closes the confirm, no need to specify onClick,
	 *     onClick: {function}  Called when clicking the button,
	 * }>} buttons
	 * @param {{
	 *     closeOnEsc: {boolean} If true closes the confirm when pressing the keyboard escape key,
	 *     closeOnClickOutside: {boolean} If true closes the confirm when clicking outside the confirm,
	 *     showClose: {boolean} If true shows a close button,
	 * }} options
	 */
	show(title = null, message = null, buttons = [], options = {}) {
		if (!this.component) {
			return;
		}

		const mergedOptions = {
			...this.defaultOptions,
			...options,
		};

		this.component.update(title, message, buttons, mergedOptions);
		this.component.show();
	}

	/**
	 * Closes the confirm dialog component
	 */
	hide() {
		if (!this.component) {
			return;
		}

		this.component.hide();
	}
}

export default ConfirmDialog;
