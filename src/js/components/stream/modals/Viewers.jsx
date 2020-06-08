import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../../mock/MockObject';
import AppBar from '../../AppBar';
import StreamMeta from '../StreamMeta';
import Back from '../../appBar/Back';
import Avatar from '../../user/Avatar';
import ScrollableView from '../../ScrollableView';
import Icon from '../../icons/Icon';

class Viewers extends Component {
	static propTypes = {
		stream: PropTypes.instanceOf(MockObject).isRequired,
		onClose: PropTypes.func,
	};
	static defaultProps = {
		onClose: null,
	};

	renderKnownViewers() {
		return this.props.stream.knownViewers.map(user => (
			<div key={user.id} className="streamModal__viewer">
				<Avatar user={user} />
			</div>
		));
	}

	render() {
		return (
			<div className="streamModal">
				<div className="streamModal__header">
					<AppBar pre={<Back onClick={this.props.onClose} />} title="Viewers" />
				</div>
				<div className="streamModal__body">
					<div className="streamModal__streamInfo">
						<StreamMeta stream={this.props.stream} />
					</div>
					<div className="streamModal__data">
						<Icon icon="eye" />
						{this.props.stream.viewersTotal} Viewers
					</div>
					<ScrollableView className="streamModal__content">
						<div className="streamModal__viewers">
							<div className="streamList__title">
								<Icon icon="gamepad" />
								<h2 className="streamList__title-text">Friends</h2>
							</div>
							<div className="streamModal__viewers-grid">{this.renderKnownViewers()}</div>
						</div>
					</ScrollableView>
				</div>
			</div>
		);
	}
}

export default Viewers;
