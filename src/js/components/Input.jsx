import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed } from 'mobx';

@observer
class Input extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
		name: PropTypes.string.isRequired,
		value: PropTypes.any,
		required: PropTypes.bool,
		formErrors: PropTypes.oneOfType([PropTypes.instanceOf(Map), MobxPropTypes.observableMap]),
		validCondition: PropTypes.func,
		error: PropTypes.string,
		emptyError: PropTypes.string,
	};
	static defaultProps = {
		value: null,
		required: false,
		formErrors: new Map(),
		validCondition: null,
		error: 'Wrong input value',
		emptyError: 'Can not be empty',
	};

	@computed
	get error() {
		return this.props.formErrors.get(this.props.name);
	}

	isValid() {
		const { value, validCondition, required, error, emptyError } = this.props;

		if (required && !value) {
			this.setValidity(emptyError);
			return false;
		}

		if (validCondition && !validCondition()) {
			this.setValidity(error);
			return false;
		}

		this.setValidity();
		return true;
	}

	setValidity(error) {
		const { name, formErrors } = this.props;

		if (formErrors) {
			if (error) {
				formErrors.set(name, error);
			} else {
				formErrors.delete(name);
			}
		}
	}

	render() {
		return (
			<div className={`input ${this.error ? 'input--error' : ''}`}>
				{this.props.children}
				{this.error && <p className="form__error">{this.error}</p>}
			</div>
		);
	}
}

export default Input;
