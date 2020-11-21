//npm init -y === package.json
//npm install electron
// script: start = electron .
 

const electron = require("electron");
const ejse = require('ejs-electron');

const { app, BrowserWindow } = electron;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true  //desktop apps m node ke features enable krna
    }
  })

  win.loadFile('index.ejs').then(function(){
    win.maximize();
    win.webContents.openDevTools();
  });

}

app.whenReady().then(createWindow)






//os specific func
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})