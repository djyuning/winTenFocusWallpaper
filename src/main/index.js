import {app, BrowserWindow} from 'electron'

if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`;

function createWindow() {

	// 初始化窗口
	mainWindow = new BrowserWindow({
		backgroundColor: '#00FFFFFF',
		center: true,
		darkTheme: true,
		//frame: false,
		transparent: true,
		minHeight: 640,
		minWidth: 960,
		thickFrame: true,
		webPreferences: {
			webSecurity: false, // 加上这个就可以获取到了本地的图片
		}
	});

	mainWindow.loadURL(winURL);

	mainWindow.on('closed', () => {
		mainWindow = null
	});

}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
});

if (shouldQuit) {
	app.quit()
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
});
