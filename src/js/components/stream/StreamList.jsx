import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import MockObject from '../../mock/MockObject';
import StreamPreview from './StreamPreview';
import Icon from '../icons/Icon';

const propTypes = {
	streams: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	onStreamClick: PropTypes.func,
	icon: PropTypes.string,
	title: PropTypes.string,
};

const defaultProps = {
	streams: [],
	onStreamClick: null,
	icon: null,
	title: null,
};

function StreamList(props) {
	const handleClick = stream => () => {
		if (props.onStreamClick) {
			props.onStreamClick(stream);
		}
	};

	const streams = props.streams
		// .filter(stream => stream.game.name !== 'Resident Evil 6')
		.map(stream => (
			<div key={stream.id} onClick={handleClick(stream)}>
				<StreamPreview stream={stream} />
			</div>
		));
	return (
		<div className="streamList">
			{props.title &&
				(props.icon && (
					<div className="activity__header">
						<Icon icon={props.icon} />
						<h1 className="activity__title">{props.title}</h1>
					</div>
				))}
			<Slider infinite={false} draggable={false} slidesToShow={2} slidesToScroll={1} className="streamList__row">
				{streams}
			</Slider>
		</div>
	);
}

StreamList.propTypes = propTypes;
StreamList.defaultProps = defaultProps;

export default StreamList;
