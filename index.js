const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

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
	addWindow.on('closed', () => addWindow = null);
}

// Listen for the todo add event coming in from the electron window
ipcMain.on('todo:add', (event, todo) => {
	mainWindow.webContents.send('todo:add', todo);
	addWindow.close();
	// garbage collection
	// after we close a browser window, we will always take the variable
	// referencing that browser window and point it to null.
	// We are now no longer maintaining a reference to the browser window
	// and allows JS to clear up memory.
	// See the 'addWindow.on('closed') event handler under function createAddWindow
});

function clearTodos() {
	mainWindow.webContents.send('todo:clear');
}

// Create menu template
const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Todos',
				click() {
					clearTodos();
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
			// adding in the reload again, using the standard electron option
			{ role: 'reload' },
			{
				label: 'Toggle Developer Tools',
				accelerator: 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
