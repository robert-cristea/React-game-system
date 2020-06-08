import has from 'lodash/has';
import set from 'lodash/set';
import merge from 'lodash/merge';
import numeral from 'numeral';

let counter = 0;

/**
 * Returns true if the `object` has all the properties, else returns false. Each property can be a
 * path like `images.cover` in which case it will check if the object has a `images` object which
 * has a `cover` properties.
 *
 * @param {object} object
 * @param {string[]} properties
 * @return {boolean}
 */
export function hasAllProperties(object, properties) {
	for (let i = 0; i < properties.length; i += 1) {
		if (!has(object, properties[i])) {
			return false;
		}
	}

	return true;
}

/**
 * Returns a unique (for this app) reference number
 * @return {string}
 */
export function generateRef() {
	counter += 1;
	return `${new Date().getTime()}_${counter}`;
}

/**
 * Takes a BigNumber instance of Wei amount (1x10^-18 Ether) and formats it as an Ether price
 * @param {BigNumber} amount
 * @return {string}
 */
export function formatWei(amount) {
	const ether = amount.dividedBy(1e18);
	const number = numeral(ether.toString());
	return number.format('0.0[0000]');
}

/**
 * Takes a BigNumber instance of Turbo Token amount (1:1 USD) and formats it
 * @param {BigNumber} amount
 * @param {boolean} forceDecimals If true, forces display of decimals when they are 0s (ex: '123.00'). If false: ('123')
 * @return {string}
 */
export function formatToken(amount, forceDecimals = true) {
	const number = numeral(amount ? amount.toString() : '0');
	return number.format(forceDecimals ? '0.00' : '0[.]00');
}

/**
 * Takes a BigNumber instance of Turbo Token amount (1:1 USD) and formats it
 * @param {BigNumber} amount
 * @param {boolean} forceDecimals If true, forces display of decimals when they are 0s (ex: '123.00'). If false: ('123')
 * @return {string}
 */
export function formatCurrency(amount, forceDecimals = true) {
	const number = numeral(amount ? amount.toString() : '0');
	return `$${number.format(forceDecimals ? '0.00' : '0[.]00')} USD`;
}

/**
 * Takes a GraphQL like structure and transforms it in an array of attributes.
 * Example, from:
 * `"
 *   id,
 *   name,
 *   user {
 *     name,
 *     friends {
 *       name
 *     }
 *   }
 * "`
 * returns `['id', 'name', 'user.name', 'user.friends.name']`
 * @param {string} structure
 */
export function fromStructureToArray(structure) {
	const normalizedStructure = structure.replace(/\s+/g, '');
	const firstLevels = [];
	let buffer = '';
	let level = 0;
	const array = [];

	// Parser that will create the following string:
	// 'a,b{c,d},e'
	// The following array (`firstLevels`)
	// ['a', 'b{c,d}', 'e']
	// (in other words, splits the string in first level elements)
	for (let l = 0; l < normalizedStructure.length; l += 1) {
		const letter = normalizedStructure[l];

		if (letter === ',' && level === 0) {
			firstLevels.push(buffer);
			buffer = '';
		} else {
			if (letter === '{') {
				level += 1;
			}

			if (letter === '}') {
				level -= 1;
			}

			buffer += letter;
		}
	}

	if (buffer) {
		firstLevels.push(buffer);
	}

	// For each first level elements...
	firstLevels.forEach(element => {
		if (!element.length) {
			return;
		}

		// If it doesn't have a sub structure, we add it to the final array
		if (element.indexOf('{') === -1) {
			array.push(element);
			return;
		}

		// If it has a sub structure, we recursively call the current function to get
		// the sub structure as an array. Then, we prepend the current element to all the children
		// and add the result to the final array
		const parts = element.match(/^([^{]+){(.+)}$/);
		const subStructure = parts[2];
		const elementName = parts[1];
		fromStructureToArray(subStructure).forEach(subElement => {
			array.push(`${elementName}.${subElement}`);
		});
	});

	return array;
}

/**
 * Transforms an object "equivalent" to a GraphQL structure to a string structure.
 * For example:
 * `{a: true, b: { c: true, d: { e: true, f: true } } }`
 * will be transformed to
 * `"a, b { c, d { e, f } }"`
 *
 * Note that outer curly brackets are not included
 *
 * @param {object} object
 * @return {string}
 */
function treeToGraphQL(object) {
	const structure = [];

	Object.entries(object).forEach(([key, value]) => {
		if (value === true) {
			structure.push(key);
		} else {
			const substructure = treeToGraphQL(value);
			structure.push(`${key} { ${substructure} }`);
		}
	});

	return structure.join(', ');
}

/**
 * Transforms an array of attribute names to a GraphQL structure (string). Support levels when
 * ['a', 'b.c', 'b.d.e', 'b.d.f'] will be transformed to { a, b { c, d { e, f } } }
 *
 * @param {Array<string>} attributes
 * @param {bool} withOuterBrackets If set to true, outer curly brackets will be included
 * @return {string}
 */
export function attributesArrayToGraphQL(attributes, withOuterBrackets = false) {
	const objectStructure = {};

	attributes.forEach(attribute => {
		set(objectStructure, attribute, true);
	});

	const result = treeToGraphQL(objectStructure);

	return withOuterBrackets ? `{ ${result} }` : result;
}

/**
 * Takes file size in bytes and converts it to human readable file size.
 * @param {number} sizeInBytes
 * @return {string}
 */
export function formatFileSize(sizeInBytes) {
	if (sizeInBytes === null) return '';

	const sizeUnitIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
	return `${(sizeInBytes / 1024 ** sizeUnitIndex).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][sizeUnitIndex]}`;
}

/**
 * Takes download speed in bytes and converts it to human readable download speed.
 * @param {number} sizeInBytes
 * @return {string}
 */
export function formatDownloadSpeed(sizeInBytes) {
	if (sizeInBytes === null || sizeInBytes === 0) return '';

	const sizeUnitIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
	return `${(sizeInBytes / 1024 ** sizeUnitIndex).toFixed(2) * 1} ${['B/s', 'KB/s', 'MB/s', 'GB/s'][sizeUnitIndex]}`;
}

export function normalizeString(string) {
	return string.trim().toLocaleLowerCase();
}

/**
 * Custom version of lodash's `pick` method that works with deep objects and arrays.
 *
 * For example, with this object:
 * const data = {
 *     id: 'id-1',
 *     name: 'My name',
 *     games: [
 *         {
 *         	 id: 'game-1',
 *         	 name: 'Game 1',
 *         	 medias: [
 *         	     { url: 'media-1-1.jpg', type: 'cover' },
 *         	     { url: 'media-1-2.jpg', type: 'cover' },
 *         	 ]
 *         },
 *         {
 *         	 id: 'game-2',
 *         	 name: 'Game 2',
 *         	 medias: [
 *         	     { url: 'media-2-1.jpg', type: 'cover' },
 *         	     { url: 'media-2-2.jpg', type: 'cover' },
 *         	 ]
 *         },
 *     ]
 * }
 *
 * lodash's regular `pick` with the following call:
 * `pick(data, ['id', 'name', 'games.name', 'games.medias.url'])`
 * would return:
 * {
 *     id: 'id-1',
 *     name: 'My name',
 * }
 *
 * While `deepPick`, with the same params, would return:
 * {
 * 	id: "id-1",
 * 	name: "My name",
 * 	games: [
 * 		{
 * 			name: "Game 1",
 * 			medias: [
 * 				{ url: "media-1-1.jpg" },
 * 				{ url: "media-1-2.jpg" }
 * 			]
 * 		},
 * 		{
 * 			name: "Game 2",
 * 			medias: [
 * 				{ url: "media-2-1.jpg" },
 * 				{ url: "media-2-2.jpg" }
 * 			]
 * 		}
 * 	]
 * }
 *
 * @param {object} object
 * @param {Array<string>|string} paths
 */
export function deepPick(object, paths) {
	if (!Array.isArray(paths)) {
		return deepPick(object, [paths]);
	}

	if (Array.isArray(object)) {
		return object.map(subObject => deepPick(subObject, paths));
	}

	const result = {};

	paths.forEach(path => {
		const firstDot = path.indexOf('.');

		if (firstDot === -1) {
			if (has(object, path)) {
				result[path] = object[path];
			}
			return;
		}

		const attr = path.substr(0, firstDot);
		const subPath = path.substr(firstDot + 1);

		if (has(object, attr)) {
			if (has(result, attr)) {
				result[attr] = merge(result[attr], deepPick(object[attr], subPath));
			} else {
				result[attr] = deepPick(object[attr], subPath);
			}
		}
	});

	return result;
}
