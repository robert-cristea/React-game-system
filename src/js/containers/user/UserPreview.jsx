import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Config from '../../app/Config';
import Component from '../../components/user/UserPreview';
import UI from '../../app/UI';
import User from '../../app/User';

@inject('config', 'ui')
@observer
class UserPreview extends ReactComponent {
	static propTypes = {
		user: PropTypes.instanceOf(User).isRequired,
	};

	static defaultProps = {};

	@observable
	loading = true;

	componentWillMount() {
		this.loadUser();
	}

	loadUser() {
		this.loading = true;
		/** @type {User} */
		const user = this.props.user;
		const attributes = this.props.config.get('userAttributes.userPreview');
		user.fill(attributes).then(() => {
			this.loading = false;
		});
	}

	render() {
		const props = {
			...this.props,
			loading: this.loading,
		};

		return <Component {...props} />;
	}
}

// Injected props
UserPreview.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default UserPreview;
