const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.use("/", router);

//Get all the records to display on table
router.get('/getRecords', (req, res) => {
    (async function () {
        let returnData = await DBRunner(queryStringBuilder('SELECT', [], [], [], []), '', [], 'db.all', res);
        res.send({
            message: "successfully retrieved " + returnData.length + " record(s)",
            records: returnData
        });
    })();
});

//Get a single complete record data based off record id
router.get('/getRecord', (req, res) => {
    const id = req.query.id;
    let record = {
        experimentRecord: {
            date_created: getCurrDate(),
            date_updated: getCurrDate()
        },
        raw_materials_list: [],
        hydro_per_list: [],
        hydro_per_stab_list: []
    };

    (async function () {
        if(id == -1) {
            res.send({
                message: "Creating a new record on " + record.experimentRecord.date_created,
                isNew: true,
                record: record
            });
        } else {
            record.experimentRecord = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [id], ['record_id']), '', [], 'db.all', res);
            record.raw_materials_list = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), '', [], 'db.all', res);
            record.hydro_per_list = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
            record.hydro_per_stab_list = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 2], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
            res.send({
                message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
                records: record
            });
        }
    })();
});

//Add an experiment record to the database
router.post('/addExperimentRecord', (req, res) => {
    let record = req.body.record;
    record.experimentRecord.date_created = getCurrDate();
    record.experimentRecord.date_updated = getCurrDate();
    let experimentRecordValues = Object.values(record.experimentRecord);

    (async function () {
        let returnData = await DBRunner(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', record.experimentRecord, experimentRecordValues, Object.keys(record.experimentRecord)), 'EXPERIMENT_RECORDS', experimentRecordValues, 'db.run', res);
        console.log(returnData.id);
        res.send({
            message: returnData.message,
            id: returnData.id
        });
    })();
});

//Add all the raw materials to the database
router.post('/addRawMaterial', (req, res) => {
    let record = req.body.record;
    if (record.raw_materials_list.length > 0) {
        let RMKeys = Object.keys(record.raw_materials_list[0]); //Getting keys to create the query string
        RMKeys.unshift('experiment_record_id');

        //Creating the flat array for db.run execution
        let flatRMList = [];

        record.raw_materials_list.forEach((arr) => {
            var values = Object.values(arr);
            values.unshift(record.record_id);

            values.forEach((item) => {
                flatRMList.push(item);
            });
        });
        /* console.log(RMKeys);
        console.log(flatRMList); */
        (async function () {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'RAW_MATERIALS', record.raw_materials_list, [], RMKeys), 'RAW_MATERIALS', flatRMList, 'db.run', res);
            res.send({
                message: returnData.message
            });
        })();
    } else {
        res.send({
            message: 'No data to add'
        });
    };
});

//Add all the hydrogen peroxide data to the database
router.post('/addHP', (req, res) => {
    let record = req.body.record;
    if(record.hydro_per_list.length != 0 && record.hydro_per_stab_list.length != 0) {
        let HPKeys;
        if(record.hydro_per_list.length != 0 ) {
            HPKeys = Object.keys(record.hydro_per_list[0]);
        } else {
            HPKeys = Object.keys(record.hydro_per_stab_list[0]);
        };
        HPKeys.unshift('hp_type');
        HPKeys.unshift('experiment_record_id');

        let flatHPList = [];
        let fullHPList = [];
        record.hydro_per_list.forEach((arr) => {
            var values = Object.values(arr);
            values.unshift(1);
            values.unshift(record.record_id);
            fullHPList.push(values);
            values.forEach((item) => {
                flatHPList.push(item);
            });
        });
        record.hydro_per_stab_list.forEach((arr) => {
            var values = Object.values(arr);
            values.unshift(2);
            values.unshift(record.record_id);
            fullHPList.push(values);

            values.forEach((item) => {
                flatHPList.push(item);
            });
        });

        console.log(fullHPList);
        (async function () {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'HYDROGEN_PEROXIDE_DATA', fullHPList, [], HPKeys), 'HYDROGEN_PEROXIDE_DATA', flatHPList, 'db.run', res);
            res.send({
                message: returnData.message
            });
        })();

    } else {
        res.send({
            message: 'No data to add'
        });
    };
});

//Update a record 
router.post('/updateExperimentRecord', (req, res) => {
    let id = req.body.record.experimentRecord.record_id
    let expRecord = req.body.record.experimentRecord

    /* let expRecord = {
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
    } */

    //Query string for inserting to experiment records
    //let updateRecordString = `UPDATE EXPERIMENT_RECORDS SET LOT_NO = ?, project_title = ?, formulation_date = ?, preparation_date = ?, prepared_by = ?, quantity = ?, notes = ?, preparation_reason = ?, observations = ?, date_created = ?, total_percentage_w = ?, total_AR = ?, total_AD = ? WHERE record_id = ${id};`
    let updateRecordString = `UPDATE EXPERIMENT_RECORDS SET `
    var keys = Object.keys(expRecord)
    keys.forEach((key) => {
        if (key != 'record_id') {
            if (key == 'total_AD') {
                updateRecordString += key + " = ? "
            } else {
                updateRecordString += key + " = ?, "
            }
        }
    })
    updateRecordString += ` WHERE record_id = ${id};`
    console.log(updateRecordString)
    let record_values = Object.values(expRecord)
    //console.log(record_values)

    //Executing db call
    let db = openDB()
    db.run(updateRecordString, record_values, function (err) {
        if (err) {
            console.log(err.message);
            res.status(500).send("Could not update record in Experiment records table")
        } else {
            console.log(`Updated ${this.changes} record(s) successfully in experiment records`)
            res.send(`Updated ${this.changes} record(s) successfully in experiment records`)
        }
    })
    closeDB(db)
})

//Update Raw Material Table
router.post('/updateRawMaterial', (req, res) => {
    let id = req.body.record.experimentRecord.record_id
    console.log(id)
    if (req.body.record.raw_materials_list.length == 0) {
        return
    }
    let rawMaterialsList = req.body.record.raw_materials_list

    //Creating query string for inserting into RM table
    let updateRMString = 'UPDATE RAW_MATERIALS SET '
    var keys = Object.keys(rawMaterialsList[0])
    keys.forEach((key) => {
        if (key != 'rm_id') {
            if (key != 'raw_material_name') {
                updateRMString += key + " = ?, "
            } else {
                updateRMString += key + " = ? "
            }
        }
    })

    updateRMString += `WHERE experiment_record_id = ${id} AND raw_material_id = ?`
    console.log(updateRMString)

    //Creating parameter list for updating raw materials
    let RM_values = []
    rawMaterialsList.forEach((arr) => {
        //Convert each raw material into a list of object values only
        var values = Object.values(arr)
        values.push(values.shift())
        RM_values.push(values)
    })
    //console.log(RM_values)

    //Executing db call
    let message = []
    let db = openDB()
    RM_values.forEach((row) => {
        db.run(updateRMString, row, function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Could not update record in Raw Materials table")
            } else {
                console.log(`Successfully updated ${this.changes} record(s) from Raw Materials Table`)
                //console.log(this)
                message.push(`\nSuccessfully updated ${this.changes} record(s) from Raw Materials Table`)
            }
        })
    })
    res.send({
        returnMessage: "Finished updating records" + message
    })


    closeDB(db)

})

//Update Hydro Perox Table 
router.post('/updateHP', (req, res) => {
    let id = req.body.record.experimentRecord.record_id
    let HPList = req.body.record.hydro_per_list
    let HPStabList = req.body.record.hydro_per_stab_list

    if (req.body.record.hydro_per_list.length == 0 && req.body.record.hydro_per_stab_list.length == 0) {
        return
    }

    //Creating query String for updating HP table
    let updateHPString = 'UPDATE HYDROGEN_PEROXIDE_DATA SET '
    keys = Object.keys(HPList[0])
    updateHPString += "hp_type = ?"
    keys.forEach((key) => {
        if (key != 'hp_id') {
            updateHPString += ", " + key + " = ?"
        }
    })

    updateHPString += ` WHERE experiment_record_id = ${id} AND hp_id = ?`
    //console.log(updateHPString)

    //Creating parameter list for update of HP table
    let HP_values = []
    HPList.forEach((arr) => {
        var values = Object.values(arr) //Convert array into object values only
        let hp_id = values.shift() //Remove the id from values list
        values.unshift(1) //Add the type as the first element of the values
        values.push(hp_id) //Re insert id as the last element of the array
        HP_values.push(values)
    })

    HPStabList.forEach((arr) => {
        var values = Object.values(arr) //Convert array into object values only
        let hp_id = values.shift() //Remove the id from values list
        values.unshift(2) //Add the type as the first element of the values
        values.push(hp_id) //Re insert id as the last element of the array
        HP_values.push(values)
    })

    let message = []
    let db = openDB()
    HP_values.forEach((row) => {
        db.run(updateHPString, row, function (err) {
            if (err) {
                console.log(err.message)
                res.status(500).send("Could not update record in HYdrogen Peroxide table")
            } else {
                console.log(`Successfully updated ${this.changes} record(s) from HP Table`)
                message += `\nSuccessfully updated ${this.changes} record(s) from HP Table`
            }
        })
    })

    res.send({
        returnMessage: "Finished updating records " + message
    })
    closeDB(db)
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
        console.log('Closed the database connection.')
    })
}

function getCurrDate() {
    var today = new Date();
    var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return curDate;
}

//Dynamic sqlite query string builder
function queryStringBuilder(operation, tableName, data, parameters, parameterNames) {
    let queryString = ""
    if (operation == 'SELECT') {
        queryString = 'SELECT * FROM '
        if (parameters.length == 0) { //Create querySrting for getRecords
            queryString += 'EXPERIMENT_RECORDS ORDER BY record_id'
        } else if (parameters.length == 1) {//Create queryString for getting an experiment record or raw materials
            //console.log(tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0])
            console.log('HERE')
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0]
        } else if (parameters.length == 2) {//Create queryString for getting the HP records
            console.log('HERE2')
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0] + ' AND ' + parameterNames[1] + ' = ' + parameters[1]
        }
    }
    if (operation == 'INSERT') {
        queryString = 'INSERT INTO ' + tableName + ' ('
        for (let index = 0; index < parameterNames.length; index++) {
            if (index == 0) {
                queryString += parameterNames[index]
            } else {
                queryString += ', ' + parameterNames[index]
            }
        }
        queryString += ') VALUES '
        if (tableName == 'EXPERIMENT_RECORDS') {
            queryString += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        } else if (tableName == 'RAW_MATERIALS') {
            queryString += data.map(() => '( ?, ?, ?, ?, ?, ?, ?, ? )').join(',')
        } else {
            queryString += data.map(() => '( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )').join(',')
        }
    }
    console.log(queryString)
    return queryString
}

//Dynamic DB runner which handles all db calls
async function DBRunner(queryString, tableName, parameters, sqliteMethod, res) {
    return new Promise((resolve, reject) => {
        let db = openDB()
        if (sqliteMethod == 'db.all') {
            db.all(queryString, parameters, (err, rows) => {
                if (err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = rows
                    console.log("Rows:")
                    console.log(data)
                }
                resolve(data)
            })
        } else if (sqliteMethod == 'db.run') {
            db.run(queryString, parameters, function (err) {
                if (err) {
                    res.status(500).send({ "Error ": err.message })
                    return
                } else {
                    data = {
                        message: 'Added record successfully in ' + tableName + ` table at ID: ${this.lastID}\n ${this.changes} row(s) affected`,
                        id: this.lastID
                    }
                    console.log(data)
                }
                resolve(data)
            })
        }
        closeDB(db)
    })

}

/* router.post('/addRecord', (req, res) => {
    let expRecord = {
        //record_id: req.body.record.record_id,
        LOT_NO: req.body.record.experimentRecord.LOT_NO,
        project_title: req.body.record.experimentRecord.project_title,
        formulation_date: req.body.record.experimentRecord.formulation_date,
        preparation_date: req.body.record.experimentRecord.preparation_date,
        prepared_by: req.body.record.experimentRecord.prepared_by,
        quantity: req.body.record.experimentRecord.quantity,
        notes: req.body.record.experimentRecord.notes,
        preparation_reason: req.body.record.experimentRecord.preparation_reason,
        observations: req.body.record.experimentRecord.observations,
        date_created: req.body.record.experimentRecord.date_created,
        total_percentage_w: req.body.record.experimentRecord.total_percentage_w,
        total_AR: req.body.record.experimentRecord.total_AR,
        total_AD: req.body.record.experimentRecord.total_AD,
    }

    let rawMaterialsList = req.body.record.raw_materials_list
    let HPList = req.body.record.hydro_per_list
    let HPStabList = req.body.record.hydro_per_stab_list
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
    //let insertRMString = 'INSERT INTO RAW_MATERIALS ( experiment_record_id, raw_material_name, percentage_w, raw_material_lot, AR, AD, time_added, notes) VALUES '
    let insertRMString = 'INSERT INTO RAW_MATERIALS ( experiment_record_id'
    var keys = Object.keys(rawMaterialsList[0])
    keys.forEach((key) => {
        insertRMString += ", " + key
    })
    insertRMString += ") VALUES "
    console.log(insertRMString)
    let flatRMList = []
    let temp = []

    //Query String for inserting into HP table
    //let insertHPString = 'INSERT INTO HYDROGEN_PEROXIDE_DATA ( experiment_record_id, hp_type, experiment_name, N, M, vol_change, H2O2, PH, accepted_range, date, initials) VALUES '
    let insertHPString = 'INSERT INTO HYDROGEN_PEROXIDE_DATA ( experiment_record_id, hp_type'
    keys = Object.keys(HPList[0])
    keys.forEach((key) => {
        insertHPString += ", " + key
    })
    insertHPString += ") VALUES "
    console.log(insertHPString)

    //Executing db calls
    let currRecID
    let message
    db.serialize(() => {
        db.run(insertRecordString, data, function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Could not add record in Experiment records table")
            } else {
                console.log(`Added record successfully in experiment records at ID: ${this.lastID}. ${this.changes} rows affected`)
                message = `Added record successfully in experiment records at ID: ${this.lastID}. ${this.changes} rows affected`
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
                        message += '\n' + `Added record successfully in RM table with last ID: ${this.lastID}. ${this.changes} rows affected`
                        //res.send(`Added record in RM successfully at ID: ${this.lastID}. ${this.changes} rows affected`)
                        //currRecID = this.lastID
                        //console.log("CURRENT ID IS:" + currRecID)
                    }
                    db.serialize(() => {
                        //Creating values array to be inserted into raw materials table
                        let tempHPList = []
                        let flatHPList = []
                        HPList.forEach((arr) => {
                            //console.log(arr)
                            var values = Object.values(arr)
                            values.unshift(1)
                            values.unshift(currRecID)
                            tempHPList.push(values)

                            values.forEach((item) => {
                                flatHPList.push(item)
                            })
                        })
                        console.log("After adding HP list temp: ")
                        console.log(tempHPList)
                        console.log("flat HP List")
                        console.log(flatHPList)

                        HPStabList.forEach((arr) => {
                            //console.log(arr)
                            var values = Object.values(arr)
                            values.unshift(2)
                            values.unshift(currRecID)
                            tempHPList.push(values)

                            values.forEach((item) => {
                                flatHPList.push(item)
                            })
                        })

                        console.log("After adding stability HP list temp: ")
                        console.log(tempHPList)
                        console.log("flat HP List")
                        console.log(flatHPList)

                        let HPplaceholders = tempHPList.map(() => '( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )').join(',');

                        insertHPString += HPplaceholders
                        console.log(insertHPString)
                        db.run(insertHPString, flatHPList, function (err) {
                            if (err) {
                                //console.log(err.message);
                                res.status(500).send("Could not add record in HP table")
                            } else {
                                console.log(`Added record successfully in HP table at ID: ${this.lastID}. ${this.changes} rows affected`)
                                res.send(message + '\n' + `Added record in HP table successfully with last ID: ${this.lastID}. ${this.changes} rows affected`)
                            }
                            closeDB(db)
                        })
                    })
                })
            })
        })
    })
}) */