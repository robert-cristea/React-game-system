import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import User from '../../app/User';
import ProfilePreviewComponent from '../../components/user/ProfilePreview';
import Config from '../../app/Config';

@inject('config')
@observer
class ProfilePreview extends Component {
	static propTypes = {
		user: PropTypes.instanceOf(User).isRequired,
		external: PropTypes.bool,
	};

	static defaultProps = {
		external: false,
	};

	@observable
	loading = false;

	componentWillMount() {
		this.fillUser();
	}

	componentWillReceiveProps(props) {
		if (this.props.user !== props.user) {
			this.fillUser(props.user);
		}
	}

	/**
	 * Fill the user with the required attributes
	 * @param {User} user
	 */
	fillUser(user = this.props.user) {
		const configKey = `userAttributes.profilePreview.${this.props.external ? 'otherUser' : 'currentUser'}`;
		const attributes = this.props.config.get(configKey);

		this.loading = true;
		user.fill(attributes).then(() => {
			this.loading = false;
		});
	}

	render() {
		const props = {
			...this.props,
			loading: this.loading,
		};
		return <ProfilePreviewComponent {...props} />;
	}
}

// Injected props
ProfilePreview.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default ProfilePreview;
