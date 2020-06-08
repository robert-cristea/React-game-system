import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import omit from 'lodash/omit';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

function FullModal(props) {
	const modalProps = {
		...omit(props, ['children']),
		ariaHideApp: false,
		portalClassName: 'modal fullModal',
		overlayClassName: 'modal__overlay fullModal__overlay',
		className: 'modal__content fullModal__content',
		closeTimeoutMS: 300,
	};

	return <ReactModal {...modalProps}>{props.children}</ReactModal>;
}

FullModal.propTypes = propTypes;
FullModal.defaultProps = defaultProps;

export default FullModal;
