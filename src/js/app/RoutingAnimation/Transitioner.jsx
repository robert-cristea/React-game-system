import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Animation from './Animations/Animation';

/**
 * Returns the transition duration of a node. If it has multiple duration (ex: `transition: opacity
 * 1s, left 3s`), the greater one is returned. If the node has no transition, 0 is returned.
 *
 * @param {Node} node
 * @return {number}
 */
/*
function getTransitionDuration(node) {
	const style = getComputedStyle(node);
	const durations = style.transitionDuration;

	if (!durations) {
		return 0;
	}

	// We may have multiple durations like in the following
	// transition: opacity 1s, left 3s;
	return durations.split(',').reduce((prevDuration, duration) => {
		const absoluteDuration = parseFloat(duration);
		return Number.isNaN(absoluteDuration) ? prevDuration : Math.max(absoluteDuration, prevDuration);
	}, 0);
}
*/

/**
 * Returns true if the node has a transition and that it is not 0 in duration.
 *
 * @param {Node} node
 * @return {boolean}
 */
/*
function hasTransitionDuration(node) {
	return getTransitionDuration(node) !== 0;
}
*/

/**
 * Component responsible to animate transition between two routes. Uses an `Animation` instance to
 * determine the animation and styles. Note that the `Animation`'s `setup()` method must have been
 * called before rendering this component.The `childKey` is used as the id of the route to show.
 * When it changes, the component knows it must run the transition. Based on
 * https://github.com/nyura123/react-router-native-transitions-example
 */
class Transitioner extends Component {
	static propTypes = {
		childKey: PropTypes.string.isRequired,
		children: PropTypes.element.isRequired, // require a single child
		animation: PropTypes.instanceOf(Animation),
	};

	static defaultProps = {
		animation: null,
	};

	componentWillReceiveProps(nextProps) {
		/**
		 * When new props are received, we check if the childKey changed, if so, we reset
		 * transitionsStillGoing
		 */
		if (this.props.childKey && this.props.childKey !== nextProps.childKey) {
			this.transitionsStillGoing = 2;
		}
	}

	/**
	 * Called when a node (the entering or leaving) is done transitionning. If it was the last one,
	 * we call the `done()` callback.
	 *
	 * @param {function} done
	 */
	/*
	transitionEnded(done) {
		this.transitionsStillGoing -= 1;

		if (this.transitionsStillGoing === 0) {
			done();
		}
	}
	*/

	/**
	 * You can add this function to <CSSTransition>'s `addEndListener` attribute. It will listen to
	 * the 'transitionend' event to both leaving and entering nodes. When they are both done, it
	 * will trigger the `done` callback.
	 *
	 * NOTE: this function is NOT USED for now, because of a strange bug where the leaving node
	 * would not always be removed (because of React Router ?). This function is left here for when
	 * we find a solution.
	 *
	 * @param {Node} node
	 * @param {function} done
	 */
	/*
	handleTransitionEnd = (node, done) => {
		if (!hasTransitionDuration(node)) {
			this.transitionEnded(done);
		} else {
			node.addEventListener('transitionend', () => {
				this.transitionEnded(done);
			}, false);
		}
	};
	*/

	/**
	 * This method is a workaround. Some animations use the z-index to show one screen over the
	 * other. The z-index value will be different if the screen is entering or leaving, so it is set
	 * in screenAnimation-enter or screenAnimation-leave. The problem is that when the animation is
	 * finished and it is time to remove the node of the screen form the DOM, `TransitionGroup`
	 * first removes the `screenAnimation-X` class name, and then removes the element from the DOM.
	 * So we might have a 'flash' when the class defining the z-index was removed and when the
	 * element was removed.
	 *
	 * This method is called when the screen is animating (leaving or entering). It gets the z-index
	 * and sets it as a style prop, so when the class name is removed, the z-index is still applied.
	 *
	 * @param {Element} element
	 */
	keepZIndex = element => {
		element.style.zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
	};

	render() {
		const { animation, children, childKey } = this.props;
		const child = React.Children.only(children);
		const baseClassName = animation ? animation.getAnimationClassName() : null;

		// If no animation, simply output the elements
		if (baseClassName === null) {
			return (
				<div className="screens__transitionGroup">
					<div className="screens__screen">{child}</div>
				</div>
			);
		}

		const className = `screenAnimation__${baseClassName}`;

		return (
			<TransitionGroup className={`screens__transitionGroup ${className}`}>
				<CSSTransition
					key={childKey}
					classNames="screenAnimation"
					timeout={animation.getDuration()}
					onEntering={this.keepZIndex}
					onExiting={this.keepZIndex}
				>
					<div className="screens__screen">{child}</div>
				</CSSTransition>
			</TransitionGroup>
		);
	}
}

export default Transitioner;
