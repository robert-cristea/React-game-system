import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, Provider } from 'mobx-react';
import { Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import UIModel from '../app/UI';
import UIContainer from './UI';
import AppLoading from '../components/screens/AppLoading';
import ToastContainer from '../components/toast/ToastContainer';
import Toast from '../components/toast/Toast';
import ConfirmDialog from '../components/modals/ConfirmDialog';

@observer
class App extends Component {
	static propTypes = {
		ui: PropTypes.instanceOf(UIModel).isRequired,
	};

	static defaultProps = {};

	getToastProviderProperties() {
		return {
			components: {
				ToastContainer,
				Toast,
			},
			placement: 'bottom-center',
			transitionDuration: 200,
		};
	}

	render() {
		/** @type {UI} */
		const ui = this.props.ui;

		// While the app is loading
		if (ui.state === UIModel.STATE_LOADING) {
			return <AppLoading />;
		}

		// When the app is in a 'ready' state
		if (ui.state === UIModel.STATE_READY) {
			return (
				<Provider {...ui.getStores()}>
					<ToastProvider {...this.getToastProviderProperties()}>
						<Router history={ui.router.getHistory()}>
							<UIContainer />
						</Router>
						<ConfirmDialog />
					</ToastProvider>
				</Provider>
			);
		}

		// In other types of states, we return nothing
		return null;
	}
}

export default App;
