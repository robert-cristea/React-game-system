// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');
const process = require('process');
// eslint-disable-next-line import/no-unresolved
const open = require('open');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// remove the default electron menu bar.
	win.removeMenu();

	const startURL =
		process.env.ELECTRON_START_URL ||
		url.format({
			pathname: path.join(__dirname, 'index.electron.html'),
			protocol: 'file:',
			slashes: true,
			icon: path.join(__dirname, 'assets/images/TurboPlay.ico'),
		});

	// Uncomment to show Dev Tools on launch.
	// win.openDevTools();

	// and load the index.electron.html of the app.
	win.loadURL(startURL);

	win.webContents.on('new-window', (event, targetUrl) => {
		event.preventDefault();
		open(targetUrl);
	});

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});
