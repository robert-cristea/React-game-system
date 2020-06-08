import Animation from './Animation';

/**
 * Simple Animation that will always return the same animation class name.
 *
 * For example, we have a `Group` with the following (simplified) children: `['/dashboard',
 * '/login']. We set the animation of this group to `new Simple('my-anim')`.
 *
 * When going from `/dashboard` to `/login`, we will have the
 * following (simplified) structure:
 * 		<div class="screenAnimation__my-anim">
 * 			   <div class="screenAnimation-leave">[content of /dashboard]</div>
 * 			   <div class="screenAnimation-enter">[content of /login]</div>
 * 		</div>
 */
class Simple extends Animation {
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
	 * @param {string} className
	 * @param {number} duration
	 */
	constructor(className, duration) {
		super();
		this.className = className;
		this.duration = duration;
	}

	/**
	 * @return {string}
	 */
	getAnimationClassName() {
		return this.className;
	}

	/**
	 * @return {number}
	 */
	getDuration() {
		return this.duration;
	}
}

export default Simple;
