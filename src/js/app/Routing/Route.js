import pick from 'lodash/pick';
import merge from 'lodash/merge';
import { matchPath } from 'react-router-dom';

class Route {
	/**
	 * @type {Group}
	 */
	group = null;
	/**
	 * @type {string}
	 */
	path = '';
	/**
	 * @type {boolean}
	 */
	private = false;
	/**
	 * @type {React.Component}
	 */
	component = null;

	/**
	 * @param {object} params
	 */
	constructor(params = {}) {
		merge(this, pick(params, ['path', 'component', 'private', 'exact', 'sensitive']));
	}

	/**
	 * @param {Group} group
	 */
	setGroup(group) {
		this.group = group;
	}

	/**
	 * @return {string}
	 */
	getKey() {
		return this.getFullPath();
	}

	/**
	 * Returns the full path to this route: the parent group's full path plus this route's path.
	 * @return {string}
	 */
	getFullPath() {
		return `${this.group.getFullPath()}${this.path}`;
	}

	/**
	 * Return an object of properties that can be passed as props to a react-native-router <Route>
	 * component.
	 * @return {object}
	 */
	getRouterRouteProps() {
		return {
			...pick(this, ['component', 'exact', 'sensitive']),
			path: this.getFullPath(),
		};
	}

	/**
	 * @param {string} location
	 * @return {boolean}
	 */
	matchesLocation(location) {
		const routeData = this.getRouterRouteProps();
		const match = matchPath(location.pathname, routeData);
		return match !== null;
	}
}

export default Route;
