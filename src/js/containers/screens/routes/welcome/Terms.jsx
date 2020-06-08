import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Screen from '../../../../components/screens/routes/welcome/Terms';
import UI from '../../../../app/UI';
import Authentication from '../../../../app/Authentication';

@inject('ui', 'auth')
@observer
class Terms extends Component {
	static propTypes = {};
	static defaultProps = {};

	handleAccept = () => {
		this.props.auth.setNewUser({ eulaAccepted: true });
		this.props.ui.router.goTo('/welcome/register');
	};

	handleDismiss = () => {
		this.props.ui.router.goTo('/welcome/register');
	};

	render() {
		return (
			<div className="screenGroupWelcome__wrap">
				<div className="screenGroupWelcome__content welcome__wrap--fullscreen welcome__wrap--wide">
					<Screen newUser={this.newUser} onAccept={this.handleAccept} onDismiss={this.handleDismiss} />
				</div>
			</div>
		);
	}
}

// Injected props
Terms.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default Terms;
