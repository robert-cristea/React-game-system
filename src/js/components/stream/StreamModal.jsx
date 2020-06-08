import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import has from 'lodash/has';
import MockObject from '../../mock/MockObject';
import StreamVideo from '../stream/StreamVideo';
import StreamMeta from '../stream/StreamMeta';
import GameInfoOverlay from '../stream/GameInfoOverlay';
import ToolBar from '../stream/ToolBar';
import Icon from '../icons/Icon';
import AppBar from '../AppBar';
import Back from '../appBar/Back';

@observer
class StreamModal extends Component {
	static propTypes = {
		stream: PropTypes.instanceOf(MockObject).isRequired,
		toolsCallback: PropTypes.objectOf(PropTypes.func),
		onBack: PropTypes.func,
	};
	static defaultProps = {
		toolsCallback: {},
		onBack: null,
	};

	/**
	 * If true, the game overlay is visible. Set to false to hide
	 * @type {boolean}
	 */
	@observable
	gameOverlayVisible = true;

	@observable
	isFullScreen = false;

	componentWillMount() {
		this.isFullScreen = false;
	}

	/**
	 * @param {string} tool
	 * @return {function|null}
	 */
	getCallbackForTool(tool) {
		if (!has(this.props.toolsCallback, tool)) {
			return null;
		}

		return this.props.toolsCallback[tool];
	}

	handleGameOverlayClose = () => {
		this.gameOverlayVisible = false;
	};

	handleFullScreenClick = () => {
		this.isFullScreen = !this.isFullScreen;
	};

	renderGameInfoOverlay() {
		if (!this.gameOverlayVisible) {
			return null;
		}

		return <GameInfoOverlay game={this.props.stream.game} onClose={this.handleGameOverlayClose} />;
	}

	renderToolBar() {
		// const tools = [
		// 	{ id: 'fullScreen', icon: 'expand-alt', onClick: this.handleFullScreenClick },
		// 	{ id: 'showViewers', icon: 'eye', onClick: this.getCallbackForTool('showViewers') },
		// 	{ id: 'showComments', icon: 'comment-alt', onClick: this.getCallbackForTool('showComments') },
		// 	{ id: 'sendTokens', icon: 'turboplay', onClick: this.getCallbackForTool('sendTokens') },
		// ];

		const tools = [
			{ id: 'fullScreen', icon: 'expand-alt', onClick: () => {} },
			{ id: 'showViewers', icon: 'eye', onClick: () => {} },
			{ id: 'showComments', icon: 'comment-alt', onClick: () => {} },
			{ id: 'sendTokens', icon: 'turboplay', onClick: () => {} },
		];

		return <ToolBar tools={tools} />;
	}

	render() {
		return (
			<div className={`stream ${this.isFullScreen ? 'stream--fullscreen' : ''}`}>
				<div className="stream__header">
					<AppBar pre={<Back onClick={this.props.onBack} />} title={this.props.stream.title} />
				</div>
				<div className="stream__main">
					<StreamVideo src={this.props.stream.game.medias.shopMedias[0].src} />
					<div className="stream__status">
						<Icon icon="circle" />
						Live
					</div>
					{this.renderToolBar()}
					<div className="stream__gameTag">{this.renderGameInfoOverlay()}</div>
				</div>
				<StreamMeta stream={this.props.stream} className="screen__meta" />
			</div>
		);
	}
}

export default StreamModal;
