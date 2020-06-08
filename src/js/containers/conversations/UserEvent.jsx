import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import UserEventModel from '../../app/ConversationEvent/UserEvent';
import UserEventComponent from '../../components/conversations/UserEvent';
import UserRepository from '../../app/Repositories/UserRepository';
import User from '../../app/User';
import Config from '../../app/Config';

@inject('userRepository', 'config')
@observer
class UserEvent extends Component {
	static propTypes = {
		event: PropTypes.instanceOf(UserEventModel).isRequired,
	};
	static defaultProps = {};

	@observable
	loadingUser = false;

	componentWillMount() {
		this.loadUser();
	}

	componentWillReceiveProps(newProps) {
		if (this.props.event !== newProps.event) {
			this.loadUser(newProps.event);
		}
	}

	/**
	 * @param {UserEvent} event
	 */
	loadUser(event = this.props.event) {
		if (!(event.user instanceof User)) {
			/** @type {UserRepository} */
			const repo = this.props.userRepository;
			const attributes = this.props.config.get('userAttributes.conversations.userEvent');
			this.loadingUser = true;
			repo.load(event.user.id, attributes).then(user => {
				event.user = user;
				this.loadingUser = false;
			});
		} else {
			this.loadingUser = false;
		}
	}

	render() {
		return <UserEventComponent loadingUser={this.loadingUser} event={this.props.event} />;
	}
}

// Injected props
UserEvent.wrappedComponent.propTypes = {
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default UserEvent;
