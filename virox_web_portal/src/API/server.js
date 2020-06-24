const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sqlite3 = require('sqlite3').verbose();
const router = express.Router()
const app = express()

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

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

//Get a single complete record data based off record id
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
                if (err) {
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
                if (err) {
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
                if (err) {
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
                if (err) {
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

    (async function () {
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

//Insert a complete record in the respective tables
router.post('/addRecord', (req, res) => {
    let expRecord = {
        //record_id: req.body.record.record_id,
        LOT_NO: req.body.record.LOT_NO,
        project_title: req.body.record.project_title,
        formulation_date: req.body.record.formulation_date,
        preparation_date: req.body.record.preparation_date,
        prepared_by: req.body.record.prepared_by,
        quantity: req.body.record.quantity,
        notes: req.body.record.notes,
        preparation_reason: req.body.record.preparation_reason,
        observations: req.body.record.observations,
        date_created: req.body.record.date_created,
        total_percentage_w: req.body.record.total_percentage_w,
        total_AR: req.body.record.total_AR,
        total_AD: req.body.record.total_AD,
    }

    //let expRecord = req.body.record
    let rawMaterialsList = req.body.record.raw_materials_list
    let HPList = req.body.record.HPList
    let HPStabList = req.body.record.HPStabList
    //console.log(req.body.record)
    let db = openDB()

    //Query string for inserting to experiment records
    let insertRecordString = 'INSERT INTO EXPERIMENT_RECORDS\
                            ( LOT_NO, project_title, formulation_date, preparation_date, \
                                prepared_by, quantity, notes, preparation_reason, observations, \
                                date_created, total_percentage_w, total_AR, total_AD) \
                                VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

    let data = [expRecord.LOT_NO, expRecord.project_title, expRecord.formulation_date, expRecord.preparation_date, expRecord.prepared_by, expRecord.quantity, expRecord.notes, expRecord.preparation_reason, expRecord.observations, expRecord.date_created, expRecord.total_percentage_w, expRecord.total_AR, expRecord.total_AD]

    //Query string for inserting into RM table
    let RMplaceholders

    let insertRMString = 'INSERT INTO RAW_MATERIALS ( experiment_record_id, raw_material_name, percentage_w, raw_material_lot, AR, AD, time_added, notes) VALUES '

    let flatRMList = []
    let temp = []

    //Executing db calls
    let currRecID
    db.serialize(() => {
        db.run(insertRecordString, data, function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Could not add record in Experiment records table")
            } else {
                console.log(`Added record successfully in experiment records at ID: ${this.lastID}. ${this.changes} rows affected`)
                currRecID = this.lastID
                //console.log("CURRENT ID IS:" + currRecID)
            }
            db.serialize(() => {
                //Creating values array to be inserted into raw materials table
                rawMaterialsList.forEach((arr) => {
                    //console.log(arr)
                    var values = Object.values(arr)
                    values.unshift(currRecID)
                    temp.push(values)

                    values.forEach((item) => {
                        flatRMList.push(item)
                    })
                })

                //console.log("temp: ")
                //console.log(temp)
                //console.log("flat")
                console.log(flatRMList)

                RMplaceholders = temp.map(() => '( ?, ?, ?, ?, ?, ?, ?, ? )').join(',');

                insertRMString += RMplaceholders
                console.log(insertRMString)
                console.log("Finished adding to record at: " + currRecID)

                //console.log(insertRMString)
                db.run(insertRMString, flatRMList, function (err) {
                    if (err) {
                        //console.log(err.message);
                        res.status(500).send("Could not add record in RM table")
                    } else {
                        console.log(`Added record successfully in RM table at ID: ${this.lastID}. ${this.changes} rows affected`)
                        res.send(`Added record in RM successfully at ID: ${this.lastID}. ${this.changes} rows affected`)
                        //currRecID = this.lastID
                        //console.log("CURRENT ID IS:" + currRecID)
                        closeDB(db)
                    }
                })
            })
            //console.log(insertRMString)

        })
    })

    //res.send('Added record successfully at ID: ' + currRecID + ' rows affected.')

    // close the database connection
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

function closeDB(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.')
    })
}