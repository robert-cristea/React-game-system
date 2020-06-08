import { matchPath } from 'react-router-dom';
import Route from './Route';

class Group {
	/**
	 * List of children of this group. Can be Route or Group elements.
	 * @var {Array.<Route|Group>}
	 */
	children = [];
	/**
	 * The base path of this Group. Should end with a /
	 * @type {string}
	 */
	base = '';
	/**
	 * Controls group visibility
	 * @type {boolean}
	 */
	private = false;
	/**
	 * Animation used to transition between direct routes of this group
	 * @type {Animation|null}
	 */
	animation = null;
	/**
	 * Parent Group. Can be null if no parent.
	 * @type {Group}
	 */
	group = null;
	/**
	 * Component used to display this group. If set, the component will be included and receive as
	 * the children property the route active route to display. If null, the route will be included
	 * directly.
	 * @type {React.Component}
	 */
	component = null;

	/**
	 * @param {Group} group
	 * @return {Group}
	 */
	setGroup(group) {
		this.group = group;
		return this;
	}

	/**
	 * Allow group access only for logged in users
	 */
	makePrivate() {
		this.private = true;
		return this;
	}

	/**
	 * @param {Array.<Route|Group>} children
	 * @return {Group}
	 */
	setChildren(children) {
		children.forEach(r => {
			r.setGroup(this);
		});
		this.children = children;
		return this;
	}

	/**
	 * @param {React.Component} component
	 * @return {Group}
	 */
	setComponent(component) {
		this.component = component;
		return this;
	}

	/**
	 * @return {React.Component}
	 */
	getComponent() {
		return this.component;
	}

	/**
	 * @return {string}
	 */
	getBase() {
		return this.base;
	}

	/**
	 * @return {string}
	 */
	getKey() {
		return this.getFullPath();
	}

	/**
	 * @return {Array.<Route|Group>}
	 */
	getChildren() {
		return this.children;
	}

	/**
	 * @param {string} base
	 * @return {Group}
	 */
	setBase(base) {
		this.base = base;
		return this;
	}

	/**
	 * @return {Animation|null}
	 */
	getAnimation() {
		return this.animation;
	}

	/**
	 * @param {Animation|null} animation
	 * @return {Group}
	 */
	setAnimation(animation) {
		this.animation = animation;
		return this;
	}

	/**
	 * Returns the parent's full path to which we add this base path
	 * @return {string}
	 */
	getFullPath() {
		if (this.group === null) {
			return this.base;
		}

		return `${this.group.getFullPath()}${this.base}`;
	}

	/**
	 * Returns the matching children from a location object. Returns undefined if not found.
	 * @param {object} location
	 * @return {Route|Group}
	 */
	findMatchingChildren(location) {
		return this.children.find(child => child.matchesLocation(location));
	}

	/**
	 * Returns only the Route in the children
	 * @return {Route[]}
	 */
	getRoutes() {
		return this.children.filter(c => c instanceof Route);
	}

	/**
	 * Returns the index of the child from a location object. Returns -1 if the child is not part of
	 * the group.
	 * @param {Route|Group} child
	 * @return {number}
	 */
	indexOf(child) {
		return this.children.findIndex(c => c === child);
	}

	/**
	 * @param {string} location
	 * @return {boolean}
	 */
	matchesLocation(location) {
		const routeData = { path: this.getFullPath() };
		const match = matchPath(location.pathname, routeData);
		return match !== null;
	}
}

export default Group;
