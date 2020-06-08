import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Avatar from '../user/Avatar';

const propTypes = {
	stream: PropTypes.instanceOf(MockObject).isRequired,
	className: PropTypes.string,
};

const defaultProps = {
	className: null,
};

function StreamMeta(props) {
	return (
		<div className={`stream__meta ${props.className}`}>
			<Avatar user={props.stream.user} />
			<div className="stream__meta-details">
				<div className="stream__meta-title">{props.stream.title}</div>
				<div className="stream__meta-username">{props.stream.user.username}</div>
			</div>
		</div>
	);
}

StreamMeta.propTypes = propTypes;
StreamMeta.defaultProps = defaultProps;

export default StreamMeta;
