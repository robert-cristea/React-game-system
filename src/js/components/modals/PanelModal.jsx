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

function PanelModal(props) {
	const modalProps = {
		...omit(props, ['children']),
		ariaHideApp: false,
		portalClassName: 'modal panelModal',
		overlayClassName: 'modal__overlay panelModal__overlay',
		className: 'modal__content panelModal__content',
		closeTimeoutMS: 300,
	};

	return <ReactModal {...modalProps}>{props.children}</ReactModal>;
}

PanelModal.propTypes = propTypes;
PanelModal.defaultProps = defaultProps;

export default PanelModal;
