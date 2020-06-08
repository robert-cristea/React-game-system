import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Icon from '../icons/Icon';

const propTypes = {
	stream: PropTypes.instanceOf(MockObject).isRequired,
};

const defaultProps = {};

function StreamPreview({ stream }) {
	return (
		<div className="streamPreview">
			<div className="streamPreview__poster">
				<img className="streamPreview__image" src={stream.game.medias.store} alt={stream.game.name} />
				<Icon icon={stream.host.icon} />
			</div>
			<div className="streamPreview__details">
				<div className="streamPreview__name">{stream.game.name}</div>
				<div className="streamPreview__publisher">{stream.game.publisher}</div>
			</div>
		</div>
	);
}

StreamPreview.propTypes = propTypes;
StreamPreview.defaultProps = defaultProps;

export default StreamPreview;
