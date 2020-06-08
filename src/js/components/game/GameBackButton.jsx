import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const propTypes = {
	title: PropTypes.string,
	callback: PropTypes.func,
};

const defaultProps = {
	title: '',
	callback: null,
};

function GameBackButton(props) {
	return (
		<div
			className="gameDetails__back-button"
			onClick={() => {
				if (props.callback) props.callback();
			}}
		>
			<Icon icon="arrowLeft" />
			{props.title ? `Back to ${props.title}` : 'Back'}
		</div>
	);
}

GameBackButton.propTypes = propTypes;
GameBackButton.defaultProps = defaultProps;

export default GameBackButton;
