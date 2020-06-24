const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();


app.get('/getRecords', (req, res) => {
    var sql = "SELECT * FROM EXPERIMENT_RECORDS ORDER BY record_id"
    var params = []

    // open the database
    const db = new sqlite3.Database('./ViroxDB.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the virox database.');
    });

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });


})

app.get('/users', (req, res) => {
    const page = req.query.page
    const limit = req.query.limit

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    let results = records.slice(startIndex, endIndex)
    res.json(results)
})

app.listen(8080)