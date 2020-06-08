/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
import find from 'find-process';
import Log from './log';

function isRunningAsar() {
	return process.mainModule.filename.indexOf('app.asar') !== -1;
}

export function launchProc(exePath, params) {
	const { execFile } = require('child_process');
	let executablePath = ``;

	const path = require('path');
	executablePath = path.join(__dirname, exePath);
	// if(isRunningAsar()) {
	//     const path = require('path');
	//     executablePath = path.join(__dirname, exePath);
	// }
	// else {
	//     executablePath = `${process.resourcesPath}/app/${exePath}`;
	// }

	Log.info(`executablePath : ${executablePath}`);

	execFile(executablePath, params, (err, data) => {
		// Log.info(err);
		// Log.info(data);
	});
}

export function launchProcAsync(exePath, params) {
	const util = require('util');
	const execFile = util.promisify(require('child_process').execFile);
	let executablePath = ``;

	const path = require('path');
	executablePath = path.join(__dirname, exePath);

	Log.info(`executablePath : ${executablePath}`);

	if (params.length === 0) {
		return execFile(executablePath);
	}

	return execFile(executablePath, params);
}

export function launchDirectAsync(exePath, executable, params) {
	const util = require('util');
	const execFile = util.promisify(require('child_process').execFile);
	Log.info(`executablePath : ${exePath}${executable}`);
	return execFile(`${exePath}${executable}`, params, { cwd: exePath });
}

export function isPidRunning(pid) {
	try {
		return process.kill(pid, 0);
	} catch (e) {
		return e.code === 'EPERM';
	}
}
export function waitForAppExit(exeName, exitCallback) {
	find('name', exeName, true).then(list => {
		if (list.length > 0) {
			const interval = setInterval(() => {
				if (!isPidRunning(list[0].pid)) {
					clearInterval(interval);
					exitCallback();
				}
			}, 150);
		} else {
			exitCallback();
		}
	});
}
