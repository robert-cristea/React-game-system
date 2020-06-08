/**
 * A class implementing this "interface" represents an animation between two routes (screens) of the
 * same route group. The Transitioner React component will be setup based on the values returned by
 * this class. When we change location, the `setup()` method is called with a config object
 * representing the location change. The other methods will then be called to retrieve the necessary
 * data for the Transitioner.
 *
 * The default implementation does nothing, so you will need to extend this class.
 */
class Animation {
	/**
	 * Called when the location changed with an object containing information about the change. The
	 * object will have the following properties:
	 * {
	 *    entering {Route} The route object entering
	 *    leaving {Route} The route object leaving. It can be null if the route Group just got
	 *        mounted
	 *    group {Group} the group in which the entering and leaving routes are
	 * }
	 * @param {{entering: Route|Group, leaving: Route|null, group: Group}} config
	 */
	// eslint-disable-next-line no-unused-vars
	setup(config) {}

	/**
	 * Name of this animation to create the correct class name on .Screens__transitionGroup.
	 * @return {string}
	 */
	getAnimationClassName() {
		return '';
	}

	/**
	 * Normally, we would use the 'transitionend' event, but, for a strange reason, it doesn't work
	 * well (the leaving node would not always be removed after the transition). So, for now, we
	 * provide a specific timeout value, which doesn't create the problem.
	 * @return {number}
	 */
	getDuration() {
		return 0;
	}
}

export default Animation;
