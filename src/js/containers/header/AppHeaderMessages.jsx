import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import UI from '../../app/UI';
import Component from '../../components/header/AppHeaderMessages';

@inject('ui')
class AppHeaderMessages extends React.Component {
	static propTypes = {};
	static defaultProps = {};

	handleClick = () => {
		this.props.ui.router.goTo('/dashboard/messages/index');
	};

	render() {
		return <Component count={0} onClick={this.handleClick} />;
	}
}

// Injected props
AppHeaderMessages.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppHeaderMessages;
