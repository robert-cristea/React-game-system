import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../components/stream/StreamModal';
import UI from '../../app/UI';
import PanelModal from '../../components/modals/PanelModal';
import ViewersModal from '../../components/stream/modals/Viewers';
import CommentsModal from '../../containers/stream/modals/Comments';
import MockObject from '../../mock/MockObject';

@inject('ui')
@observer
class StreamModal extends ReactComponent {
	static propTypes = {
		stream: PropTypes.instanceOf(MockObject).isRequired,
		onBack: PropTypes.func,
	};
	static defaultProps = {
		onBack: null,
	};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	modalVisible = false;

	@observable
	modalContent = null;

	componentWillMount() {
		this.didMount = false;
	}

	componentDidMount() {
		this.didMount = true;
	}

	handleOnShowViewersClick = () => {
		this.modalVisible = true;
		this.modalContent = <ViewersModal stream={this.props.stream} onClose={this.handleCloseModal} />;
	};

	handleOnShowCommentsClick = () => {
		this.modalVisible = true;
		this.modalContent = <CommentsModal stream={this.props.stream} onClose={this.handleCloseModal} />;
	};

	handleOnSendTokensClick = () => {
		this.props.ui.showSendTokensModal(this.props.stream.user);
	};

	handleParentModalSelector = () => this.props.ui.getModalLocation('dashboard-1');

	handleCloseModal = () => {
		this.modalVisible = false;
	};

	toolsCallback = {
		showViewers: this.handleOnShowViewersClick,
		showComments: this.handleOnShowCommentsClick,
		sendTokens: this.handleOnSendTokensClick,
	};

	renderModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-1');

		if (!modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.modalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleCloseModal}
			>
				{this.modalContent}
			</PanelModal>
		);
	}

	render() {
		return (
			<React.Fragment>
				<Component stream={this.props.stream} toolsCallback={this.toolsCallback} onBack={this.props.onBack} />
				{this.renderModal()}
			</React.Fragment>
		);
	}
}

// Injected props
StreamModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default StreamModal;
