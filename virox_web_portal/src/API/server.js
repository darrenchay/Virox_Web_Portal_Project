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

    let sql = 'SELECT * FROM EXPERIMENT_RECORDS WHERE record_id = ?'
    let data = []
    let record = {
        experimentRecord: {},
        rawMaterials: [],
        HPRecords: [],
        HPStabRecords: []
    }

    //Get the data from the experiments table
    function getExprimentTableRecord() {
        //promise to return the data after the async call
        return new Promise((resolve, reject) => {
            db.all(sql, id, (err, rows) => {
                if(err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = rows
                }

                resolve(data)
            })
        })
    }

    function getRawMaterials() {
        sql = 'SELECT * FROM RAW_MATERIALS where experiment_record_id = ?'
        //promise to return the data after the async call
        return new Promise((resolve, reject) => {
            db.all(sql, id, (err, rows) => {
                if(err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = []
                    data = rows
                    //console.log("Rows:")
                    //console.log(rows)
                }

                resolve(data)
            })
        })
    }

    function getHPList() {
        sql = 'SELECT * FROM HYDROGEN_PEROXIDE_DATA where experiment_record_id = ? AND hp_type = 1'
        //promise to return the data after the async call
        return new Promise((resolve, reject) => {
            db.all(sql, id, (err, rows) => {
                if(err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = []
                    data = rows
                    //console.log("Rows:")
                    //console.log(rows)
                }

                resolve(data)
            })
        })
    }

    function getHPStabList() {
        sql = 'SELECT * FROM HYDROGEN_PEROXIDE_DATA where experiment_record_id = ? AND hp_type = 2'
        //promise to return the data after the async call
        return new Promise((resolve, reject) => {
            db.all(sql, id, (err, rows) => {
                if(err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = []
                    data = rows
                    //console.log("Rows:")
                    //console.log(rows)
                }

                resolve(data)
            })
        })
    }

    (async function() {
        record.experimentRecord = await getExprimentTableRecord()
        record.rawMaterials = await getRawMaterials()
        record.HPRecords = await getHPList()
        record.HPStabRecords = await getHPStabList()
        res.send({
            "Message": "Successfully retrieved " + record.experimentRecord.length + " row",
            data: record
        })
        //console.log(record)
    })()

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