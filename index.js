const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	// Quits the entire app if main window is closed
	// - prevents the 'add todo' window doesn't stay open on main app close
	mainWindow.on('closed', () => app.quit());
	// Create the menu from the template below
	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add New Todo'
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
}
// Create menu template
const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];
// Checking to see if it's a mac OS we're on, to add the menu option filler object
if(process.platform === 'darwin'){
	menuTemplate.unshift({});
}

// check to see if we're in production or development, to enable console

if(process.env.NODE_ENV !== 'production'){
	menuTemplate.push({
		label: 'Developer',
		submenu: [
			{
				label: 'Toggle Developer Tools',
				accelerator: 'Command+Shift+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
