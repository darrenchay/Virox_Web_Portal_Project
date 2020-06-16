const { app, BrowserWindow } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const fs = require('fs');
const path    = require("path");
const express = require('./express'); 


/****************** SQL SECTION ******************/

/************************* POST/GET REQUESTS *************************/
app.get('/getData', function(req, res) {

  let db = new sqlite3.Database('ViroxDB.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the database");
  });
  
  let sql = 'SELECT * FROM `EXPERIMENT_RECORDS`;'
  
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }

  rows.forEach((row) => {
    console.log(row.project_title);
  });
  });
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });

  res.send({
    row: rows
  });
  

});


/************************* ELECTRON STARTUP *************************/
function createWindow () {
  express();
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