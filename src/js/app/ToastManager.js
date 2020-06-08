const defaultProps = {
	pauseOnHover: true,
};

class ToastManager {
	static INFO = 'info';
	static WARNING = 'warning';
	static ERROR = 'error';

	// Dismiss speeds
	static NO = -1;
	static FAST = 2000;
	static MEDIUM = 4000;
	static SLOW = 8000;

	/**
	 * External library actually doing the toast magic
	 * @type {object}
	 */
	externalManager = null;

	/**
	 * Shows a "info" type toast
	 * @param {*} content Any content that can be rendered by react
	 * @param {int} autoDismissSpeed Milliseconds before auto dismiss. If -1, doesn't auto-dismiss
	 */
	info(content, autoDismissSpeed = ToastManager.MEDIUM) {
		const properties = {
			appearance: ToastManager.INFO,
			autoDismiss: autoDismissSpeed > -1,
			autoDismissTimeout: autoDismissSpeed,
		};
		this.show(content, properties);
	}

	/**
	 * Shows a "warning" type toast
	 * @param {*} content Any content that can be rendered by react
	 * @param {int} autoDismissSpeed Milliseconds before auto dismiss. If -1, doesn't auto-dismiss
	 */
	warning(content, autoDismissSpeed = ToastManager.MEDIUM) {
		const properties = {
			appearance: ToastManager.WARNING,
			autoDismiss: autoDismissSpeed > -1,
			autoDismissTimeout: autoDismissSpeed,
		};
		this.show(content, properties);
	}

	/**
	 * Shows a "error" type toast
	 * @param {*} content Any content that can be rendered by react
	 * @param {int} autoDismissSpeed Milliseconds before auto dismiss. If -1, doesn't auto-dismiss
	 */
	error(content, autoDismissSpeed = ToastManager.MEDIUM) {
		const properties = {
			appearance: ToastManager.ERROR,
			autoDismiss: autoDismissSpeed > -1,
			autoDismissTimeout: autoDismissSpeed,
		};
		this.show(content, properties);
	}

	/**
	 * Shows a toast of the specified type
	 * @param {*} content
	 * @param {object} properties See https://github.com/jossmac/react-toast-notifications#toast-props
	 */
	show(content, properties) {
		const props = {
			...defaultProps,
			...properties,
		};
		this.externalManager.add(content, props);
	}

	setExternalManager(externalManager) {
		if (externalManager !== this.externalManager) {
			this.externalManager = externalManager;
		}
	}
}

export default ToastManager;
