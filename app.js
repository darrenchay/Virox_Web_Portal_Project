//Electron
const { BrowserWindow } = require('electron');
const { app } = require('electron');
const Window = require('./Window');

const sqlite3 = require('sqlite3').verbose();



function main() {
  let mainWindow = new Window({
    file: 'public/index.html'
  });
}

app.on('ready', main());

app.on('window-all-closed', function () {
  app.quit();
});



/************************* POST/GET REQUESTS *************************/
/* app.get('/getData', function(req, res) {

  

  res.send({
    row: rows
  });
  

});
 */

/* let db = new sqlite3.Database('ViroxDB.db', sqlite3.OPEN_READWRITE, (err) => {
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
}); */

