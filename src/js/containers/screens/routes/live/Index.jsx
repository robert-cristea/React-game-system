import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../../../components/screens/routes/live/Index';
import liveData, { getStreamById } from '../../../../mock/live';
import UI from '../../../../app/UI';
import StreamModal from '../../../stream/StreamModal';
import FullModal from '../../../../components/modals/FullModal';

@inject('ui')
@observer
class Index extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	streamModalVisible = false;

	@observable
	displayedStream = null;

	componentWillMount() {
		this.didMount = false;
		this.updateStreamModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateStreamModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	updateStreamModal(props = this.props) {
		const streamId = props.match.params.stream;

		if (!streamId) {
			this.closeStreamModal();
			return;
		}

		const stream = getStreamById(streamId);

		if (!stream) {
			this.closeStreamModal();
			return;
		}

		this.displayedStream = stream;
		this.openStreamModal();
	}

	closeStreamModal() {
		this.streamModalVisible = false;
	}

	openStreamModal() {
		this.streamModalVisible = true;
	}

	handleStreamModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/live/index');
	};

	handleStreamClick = stream => {
		this.props.ui.router.goTo(`/dashboard/live/index/${stream.id}`);
	};

	renderStreamModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		if (!this.displayedStream) {
			return null;
		}

		return (
			<FullModal
				isOpen={this.streamModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleStreamModalClose}
			>
				<StreamModal stream={this.displayedStream} onBack={this.handleStreamModalClose} />
			</FullModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					playNetwork={liveData.playNetwork}
					interactive={liveData.interactive}
					byHost={liveData.byHost}
					onStreamClick={this.handleStreamClick}
				/>
				{this.renderStreamModal()}
			</Fragment>
		);
	}
}

// Injected props
Index.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Index;
