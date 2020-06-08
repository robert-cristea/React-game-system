/* eslint-disable func-names */
/**
 * Code from node-ini.
 * https://github.com/PastorBones/node-ini
 */
import { readFile, readFileSync } from 'fs';

const INI = function() {
	const self = this;

	const regex = {
		section: {
			key: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
			arr: /^\s*\[\s*([^\]]*)\s*\]\[\]\s*$/,
			obj: /^\s*\[\s*([^\]]*)\s*\]\[(\w+)\]\s*$/,
		},
		param: {
			key: /^\s*([\w.\-_]+)\s*=\s*(.*?)\s*$/,
			arr: /^\s*([\w.\-_]+)\[\]\s*=\s*(.*?)\s*$/,
			obj: /^\s*([\w.\-_]+)\[(\w+)\]\s*=\s*(.*?)\s*$/,
		},
		comment: [/^\s*;.*$/, /^\s*#.*$/, /^\s*\/\/.*$/],
	};

	self.encoding = 'utf-8';

	const addParam = (pType, cfg, match) => {
		// eslint-disable-next-line default-case
		switch (self.curSection.type) {
			case 'key':
				if (pType === 'key') cfg[self.curSection.name][match[1]] = match[2];
				else if (pType === 'arr') {
					if (typeof cfg[self.curSection.name][match[1]] === 'undefined') {
						cfg[self.curSection.name][match[1]] = [];
						self.curSection.pIndex = 0;
					}
					cfg[self.curSection.name][match[1]][self.curSection.pIndex] = match[2];
					self.curSection.pIndex++;
				} else if (pType === 'obj') {
					if (typeof cfg[self.curSection.name][match[1]] === 'undefined') {
						cfg[self.curSection.name][match[1]] = {};
					}
					cfg[self.curSection.name][match[1]][match[2]] = match[3];
				}
				break;
			case 'arr':
				if (pType === 'key') {
					if (typeof cfg[self.curSection.name][self.curSection.index] === 'undefined') {
						cfg[self.curSection.name][self.curSection.index] = {};
					}
					cfg[self.curSection.name][self.curSection.index][match[1]] = match[2];
				} else if (pType === 'arr') {
					if (typeof cfg[self.curSection.name][self.curSection.index][match[1]] === 'undefined') {
						cfg[self.curSection.name][self.curSection.index][match[1]] = [];
						self.curSection.pIndex = 0;
					}
					cfg[self.curSection.name][self.curSection.index][match[1]][self.curSection.pIndex] = match[2];
					self.curSection.pIndex++;
				} else if (pType === 'obj') {
					if (typeof cfg[self.curSection.name][self.curSection.index][match[1]] === 'undefined') {
						cfg[self.curSection.name][self.curSection.index][match[1]] = {};
					}
					cfg[self.curSection.name][self.curSection.index][match[1]][match[2]] = match[3];
				}
				break;
			case 'obj':
				if (pType === 'key') {
					if (typeof cfg[self.curSection.name][self.curSection.key] === 'undefined') {
						cfg[self.curSection.name][self.curSection.key] = {};
					}
					cfg[self.curSection.name][self.curSection.key][match[1]] = match[2];
				} else if (pType === 'arr') {
					if (typeof cfg[self.curSection.name][self.curSection.key][match[1]] === 'undefined') {
						cfg[self.curSection.name][self.curSection.key][match[1]] = [];
						self.curSection.pIndex = 0;
					}
					cfg[self.curSection.name][self.curSection.key][match[1]][self.curSection.pIndex] = match[2];
					self.curSection.pIndex++;
				} else if (pType === 'obj') {
					if (typeof cfg[self.curSection.name][self.curSection.key][match[1]] === 'undefined') {
						cfg[self.curSection.name][self.curSection.key][match[1]] = {};
					}
					cfg[self.curSection.name][self.curSection.key][match[1]][match[2]] = match[3];
				}
				break;
		}
	};

	const parse = data => {
		const lines = data.split(/\r\n|\r|\n/);
		const cfg = {};
		self.curSection = {};

		lines.forEach(line => {
			// Check for comments
			regex.comment.forEach(patt => {
				if (patt.test(line)) {
					// Do nothing
				}
			});

			// Check for a section
			Object.keys(regex.section).forEach(type => {
				if (regex.section[type].test(line)) {
					const match = line.match(regex.section[type]);
					self.curSection.type = type;
					self.curSection.name = match[1];
					// eslint-disable-next-line default-case
					switch (type) {
						case 'key':
							if (typeof cfg[self.curSection.name] === 'undefined') {
								cfg[self.curSection.name] = {};
							}
							break;
						case 'arr':
							if (typeof cfg[self.curSection.name] === 'undefined') {
								cfg[self.curSection.name] = [];
								self.curSection.index = 0;
								cfg[self.curSection.name][0] = {};
							} else {
								self.curSection.index++;
							}
							break;
						case 'obj':
							if (typeof cfg[self.curSection.name] === 'undefined') {
								cfg[self.curSection.name] = {};
								cfg[self.curSection.name][match[2]] = {};
							}
							self.curSection.key = match[2];
							break;
					}
				}
			});

			// Check for param
			Object.keys(regex.param).forEach(type => {
				if (regex.param[type].test(line)) {
					const match = line.match(regex.param[type]);
					switch (type) {
						case 'key':
							if (typeof self.curSection.name === 'undefined') {
								cfg[match[1]] = match[2];
							} else {
								addParam(type, cfg, match);
							}
							break;
						default:
							addParam(type, cfg, match);
							break;
					}
				}
			});
		});
		return cfg;
	};

	// eslint-disable-next-line consistent-return
	self.parse = function(file, fn) {
		if (!fn) {
			return self.parseSync(file);
		}
		readFile(file, self.encoding, (err, data) => {
			if (err) fn(err);
			else fn(null, parse(data));
		});
	};

	self.parseSync = function(file) {
		return parse(readFileSync(file, self.encoding));
	};
};

export default (function() {
	return new INI();
})();
