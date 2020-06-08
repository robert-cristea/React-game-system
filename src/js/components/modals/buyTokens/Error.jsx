import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../icons/Icon';

const propTypes = {
	message: PropTypes.string,
	onGoBack: PropTypes.func,
};

const defaultProps = {
	message: null,
	onGoBack: null,
};

function Error(props) {
	const message = props.message || 'An error occured. Please try again later.';

	return (
		<div className="infoModal__contentWrapper">
			<div className="infoModal__header">
				<div className="infoModal__headerIcon infoModal__headerIcon--circle infoModal__headerIcon--error">
					<Icon icon="times-circle" />
				</div>
				<div className="infoModal__title">An error occured</div>
			</div>
			<div className="infoModal__main">
				<p>{message}</p>
			</div>
			<div className="infoModal__actions infoModal__actions--medium">
				<button className="infoModal__action btn btn--main btn--low" onClick={props.onGoBack}>
					Go back
				</button>
			</div>
		</div>
	);
}

Error.propTypes = propTypes;
Error.defaultProps = defaultProps;

export default Error;
