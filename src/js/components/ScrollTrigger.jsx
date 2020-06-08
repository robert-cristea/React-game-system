import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { Waypoint } from 'react-waypoint';

/**
 * Component that triggers `props.onTrigger` when it's scrolled pass `props.threshold` from the top
 * or bottom (props.from). Note that this component only renders a div and you can pass any other
 * attributes will be passed to the div (className, style, ...)
 *
 * If `props.enabled` is false, listeners are removed
 *
 * Right now, the way it works is by putting an invisible div element at the bottom (or top) and
 * `props.onTrigger` is called when this div element is in sight (adjusted with threshold)
 */
class ScrollTrigger extends ReactComponent {
	static propTypes = {
		from: PropTypes.oneOf(['top', 'bottom']),
		enabled: PropTypes.bool,
		threshold: PropTypes.number,
		onTrigger: PropTypes.func,
		children: PropTypes.node,
	};

	static defaultProps = {
		from: 'bottom',
		enabled: true,
		threshold: 0,
		onTrigger: null,
		children: null,
	};

	waypointKey = 1;

	componentDidMount() {
		this.waypointKey = 1;
	}

	renderWaypoint() {
		if (this.props.enabled) {
			// We have to regenerate the Waypoint at each render so it triggers `onTrigger()` if
			// it keeps being visible (ex: we have infinite scroll, but new content did not push the
			// waypoint outside of sight, so we must retrigger `onTrigger()` it again until the
			// Waypoint gets out of sight. Which is why we regenerate a new key each time.
			this.waypointKey += 1;
			return (
				<Waypoint
					key={`waypoint_${this.waypointKey}`}
					onEnter={this.props.onTrigger}
					topOffset={this.props.from === 'top' ? -this.props.threshold : 0}
					bottomOffset={this.props.from === 'bottom' ? -this.props.threshold : 0}
				/>
			);
		}

		return null;
	}

	render() {
		const propNames = Object.keys(ScrollTrigger.propTypes);
		const divProps = omit(this.props, propNames);
		// Only one of the following 2 will have a Waypoint, the other will be null
		const preWaypoint = this.props.from === 'top' ? this.renderWaypoint() : null;
		const postWaypoint = this.props.from === 'bottom' ? this.renderWaypoint() : null;

		return (
			<div {...divProps}>
				{preWaypoint}
				{this.props.children}
				{postWaypoint}
			</div>
		);
	}
}

export default ScrollTrigger;
