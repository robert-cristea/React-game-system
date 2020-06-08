import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import Component from '../../../components/stream/modals/Comments';
import MockObject from '../../../mock/MockObject';
import currentUser from '../../../mock/currentUser';

class Comments extends ReactComponent {
	static propTypes = {
		stream: PropTypes.instanceOf(MockObject).isRequired,
		onClose: PropTypes.func,
	};
	static defaultProps = {
		onClose: null,
	};

	getConversation() {
		return this.props.stream.conversation;
	}

	// eslint-disable-next-line no-unused-vars
	handleOnCurrentUserMessage = content => {
		// TODO
	};

	render() {
		return (
			<Component
				stream={this.props.stream}
				onClose={this.props.onClose}
				currentUser={currentUser}
				onMessage={this.handleOnCurrentUserMessage}
			/>
		);
	}
}

export default Comments;
