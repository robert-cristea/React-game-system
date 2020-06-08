import Animation from './Animation';

/**
 * This class receives a class name that will be set on the entering and leaving screen (route), but
 * will also add '--entering' when it is the "higher" screen that is entering, and "--leaving" when
 * it is the "lower" screen that is entering (so the "higher" is leaving).
 *
 * A screen (or route) is considered "higher" than another one when it is defined after the other in
 * the `children` array of a route Group.
 *
 * This Animation object is used when we want a different animation when going to or when coming
 * from a "higher" screen.
 *
 * For example, we have a `Group` with the following (simplified) children: `['/dashboard',
 * '/login']. Here, `/login` is "higher" since it is defined after. We set the animation of this
 * group to `new OrderBased('my-anim')`.
 *
 * When going from `/dashboard` to `/login`, the higher screen is _entering_. We will then have the
 * following (simplified) structure:
 * 		<div class="screenAnimation__my-anim--entering">
 * 			   <div class="screenAnimation-leave">[content of /dashboard]</div>
 * 			   <div class="screenAnimation-enter">[content of /login]</div>
 * 		</div>
 * That way, we know that the `screenAnimation-leave` element is the "lower" since the parent class
 * ends with `--entering`. Here, "--entering" or "--leaving" always represent the point of view of
 * the "higher" screen. If we were going from `/dashboard` to `/login`, the outer element's class
 * would be `screenAnimation__my-anim--leaving`
 */
class OrderBasedClassName extends Animation {
	/**
	 * Name of the animation class.
	 * @type {string}
	 */
	className = '';
	/**
	 * Duration in milliseconds of the animation
	 * @type {number}
	 */
	duration = 0;
	/**
	 * Set by `setup()`. It is a negative number, 0, or a positive number depending if the entering
	 * route is "lower", the same or "higher" (respectively) than the leaving route.
	 */
	routeComparison = 0;
	/**
	 * Set by `setup()`. Will be true if the entering and leaving routes are in the same group. For
	 * example, it can be false when this animation is called in the context of a sub group, but we
	 * are going to another part of the app in another group.
	 * @type {boolean}
	 */
	sameGroup = false;
	/**
	 * Last class name calculated in setup()
	 * @type {string}
	 */
	calculatedClassName = '';

	/**
	 * @param {string} className
	 * @param {number} duration
	 */
	constructor(className, duration) {
		super();
		this.className = className;
		this.duration = duration;
	}

	/**
	 * If we are entering a sibling of the leaving route, we update the animation class and duration based on whether it is a higher or lower route that is entering.
	 *
	 * Note that we are guaranteed that the entering and leaving route are not the same and that they are part of the same group. Also note that leaving might be null.
	 *
	 * @param {{entering: Route|Group, leaving: Route|null, group: Group}} config
	 */
	setup(config) {
		const { entering, leaving, group } = config;

		// First time showing the component
		if (leaving === null) {
			this.routeComparison = 1;
		} else {
			const enteringIndex = group.indexOf(entering);
			const leavingIndex = group.indexOf(leaving);
			this.routeComparison = enteringIndex - leavingIndex;
		}

		this.updateClass();
	}

	updateClass() {
		this.calculatedClassName = `${this.className}--${this.routeComparison > 0 ? 'entering' : 'leaving'}`;
	}

	/**
	 * @return {string}
	 */
	getAnimationClassName() {
		return this.calculatedClassName;
	}

	/**
	 * @return {number}
	 */
	getDuration() {
		return this.duration;
	}
}

export default OrderBasedClassName;
