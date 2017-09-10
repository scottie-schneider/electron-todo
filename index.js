const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	// Create the menu from the template below
	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const menuTemplate = [
	{
		label: 'File', 
		submenu: [
			{
				label: 'New Todo'
			},
			{
				label: 'Quit',
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