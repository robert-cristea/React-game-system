import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
};

const defaultProps = {
	children: null,
	className: null,
	style: null,
};

/**
 * A component that allows scrolling div even when using flex sizing. You can also pass className
 * and a style object.
 *
 * Example:
 * <div style="display: flex; flex-direction: column">
 *     <!-- Here, the height is determined by flex: 1 -->
 *     <ScrollableView style={{flex: 1}} className="my-class">
 *         <div>[...Really long div...]</div>
 *     </ScrollableView>
 * </div>
 */
function ScrollableView({ children, className, style }) {
	let finalClassName = 'scrollableView';

	if (className) {
		finalClassName = `${finalClassName} ${className}`;
	}

	return (
		<div className={finalClassName} style={/* do not remove */ style}>
			<div className="scrollableView__content">{children}</div>
		</div>
	);
}

ScrollableView.propTypes = propTypes;
ScrollableView.defaultProps = defaultProps;

export default ScrollableView;
