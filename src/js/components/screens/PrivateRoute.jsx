import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '../card/Card';

class PrivateRoute extends Component {
	static propTypes = {
		onLogin: PropTypes.func,
	};
	static defaultProps = {
		onLogin: null,
	};

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	render() {
		return (
			<div className="privateRoute">
				<Card
					title="Account Required"
					text="Please sign in or create an account to access this page."
					buttonTitle="SIGN IN"
					onButtonClick={this.handleLogin}
				/>
			</div>
		);
	}
}
export default PrivateRoute;
