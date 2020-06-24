const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose();
const app = express()

app.use("/", router)

//Get all the records to display on table
router.get('/getRecords', (req, res) => {
    var sql = "SELECT * FROM EXPERIMENT_RECORDS ORDER BY record_id"
    var params = []

    const db = openDB()

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).send({ "error": err.message });
            return;
        }
        res.send({
            "message": "successfully retrieved " + rows.length + " records",
            "data": rows
        })
    });

    closeDB(db)

})

//Get a single complete record data 
router.get('/getRecord', (req, res) => {
    const id = req.query.id
    console.log(id)
    
    const db = openDB()

    const sql = 'SELECT * FROM EXPERIMENT_RECORDS WHERE record_id = ?'

    db.all(sql, id, (err, row) => {
        //Process if sql statement gives an error
        if (err) {
            res.status(500).send({ "Error ": err.message })
            return
        } else if (row.length > 0){
            res.send({
                "Message": "Successfully retrieved " + row.length + " row",
                data: row
            })
        } else {
            res.send("ERROR: Record with ID " + id + " not retrieved")
        }
    })

    closeDB(db)    
})

//

router.get('/users', (req, res) => {
    const page = req.query.page
    const limit = req.query.limit
    console.log(page)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    let results = records.slice(startIndex, endIndex)
    res.json(results)
})

app.listen(3000)

function openDB() {
    // open the database
    const db = new sqlite3.Database('./ViroxDB.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Connected to the virox database.')
    })

    return db
}

function closeDB (db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.')
    })
}