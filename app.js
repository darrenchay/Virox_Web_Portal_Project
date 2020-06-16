const { app, BrowserWindow } = require('electron');
//SQLite App
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('virox.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the database");
});

let sql = 'CREATE TABLE'

db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
});


function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('public/index.html');

  // Open the DevTools.
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow);