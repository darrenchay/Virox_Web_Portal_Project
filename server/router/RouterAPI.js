const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { query } = require('express');
const pool = require('./dbAuth.js');
//const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

//app.use("/API", router);

//Get all the records to display on table
router.get('/getRecords', (req, res) => {
    const page = parseInt(req.query.page);
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let previous, next;
    if (startIndex > 0) {
        previous = page - 1;
    }
    pool.query(queryStringBuilder('SELECT', [], [], [], []), [], (error, results) => {
        if (error) {
            res.send(error);
            throw error;
        } else {
            //res.status(200).send(results.rows);
            console.log(results);
            if (endIndex < results.rows.length) {
                next = page + 1;
            }
            res.send({
                message: "successfully retrieved " + results.rows.length + " record(s)",
                records: results.rows.slice(startIndex, endIndex),
                pageCount: Math.ceil(results.rows.length / limit),
                next: next,
                previous: previous
            });
        }
    });
    /* (async function () {
        let returnData = DBRunner(queryStringBuilder('SELECT', [], [], [], []), '', [], 'db.all', res);
        console.log(returnData);
        if (endIndex < returnData.length) {
            next = page + 1;
        }
        res.send({
            message: "successfully retrieved " + returnData.length + " record(s)",
            records: returnData.slice(startIndex, endIndex),
            pageCount: Math.ceil(returnData.length / limit),
            next: next,
            previous: previous
        });
    })(); */
});


//Get a single complete record data based off record id
router.get('/getRecord', (req, res) => {
    const id = req.query.id;
    let record = {
        experimentRecord: {},
        RMList: [],
        HPList: [],
        HPStabilityList: []
    };

    pool.query(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [id], ['record_id']), [], (error, results) => {
        if (error) {
            res.send(error);
            throw error;
        } else {
            //res.status(200).send(results.rows);
            console.log(results.rows);
            record.experimentRecord = result.rows;
        }
    }).then(
        pool.query(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), [], (err, results) => {
            if (error) {
                res.send(error);
                throw error;
            } else {
                //res.status(200).send(results.rows);
                console.log(results.rows);
                record.RMList = result.rows;
                res.send({
                    message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
                    records: record
                });
            }
        }).then(
            pool.query(queryStringBuilder(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), [], (err, results) => {
                if (error) {
                    res.send(error);
                    throw error;
                } else {
                    //res.status(200).send(results.rows);
                    console.log(results.rows);
                    record.RMList = result.rows;
                    res.send({
                        message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
                        records: record
                    });
                }
            })
        ))
    )

        (async function () {
            record.experimentRecord = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [id], ['record_id']), '', [], 'db.all', res);
            record.RMList = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), '', [], 'db.all', res);
            record.HPList = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
            record.HPStabilityList = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 2], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
            res.send({
                message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
                records: record
            });
        })();
});

//Searches EXPERIMENT_RECORDS using a specific search item
router.get('/searchRecords', (req, res) => {
    let searchData = JSON.parse(req.query.search);
    console.log(searchData);

    let record = {
        experimentRecord: {},
    };

    (async function () {
        record.experimentRecord = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [searchData.value], [searchData.name]), '', [], 'db.all', res);
        console.log(record);
        res.send({
            message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
            records: record
        });
    })();

});

//Gets the raw materials for a specific record
router.get('/getRawMaterial', (req, res) => {
    const id = req.query.id;
    let record = {
        RMList: [],
    };

    console.log(id);

    (async function () {
        console.log("running")
        record.RMList = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), '', [], 'db.all', res);
        console.log("done ");
        res.send({
            message: 'Successfully retrieved ' + record.RMList.length + ' raw materials',
            RMList: record.RMList
        });
    })();
});

//Searches RAW_MATERIALS using a specific search item
router.get('/searchRawMaterials', (req, res) => {
    let searchData = JSON.parse(req.query.search);
    console.log(searchData);

    let record = {
        RMList: [],
    };

    (async function () {
        record.RMList = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [searchData.value], [searchData.name]), '', [], 'db.all', res);
        console.log(record);
        res.send({
            message: "Successfully retrieved " + record.RMList.length + " record(s)",
            records: record
        });
    })();

});

//Gets Hydro perox data for a specific record
router.get('/getHP', (req, res) => {
    const id = req.query.id;

    (async function () {
        let HP = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
        res.send({
            message: 'Successfully retrieved ' + HP.length + ' hydrogen peroxide records',
            HPList: HP
        });
    })();
});

//Searches HYDROGEN_PEROXIDE_DATA for a specific record using a specific search term
router.get('/searchHP', (req, res) => {
    let searchData = JSON.parse(req.query.search);

    (async function () {
        let HP = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [searchData.value, 1], [searchData.name, 'hp_type']), '', [], 'db.all', res);
        res.send({
            message: 'Successfully retrieved ' + HP.length + ' hydrogen peroxide records',
            records: HP
        });
    })();
});

//Gets Hydro Perox stabilityh data for a specific record
router.get('/getHPStab', (req, res) => {
    const id = req.query.id;

    (async function () {
        let HP = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 2], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
        res.send({
            message: 'Successfully retrieved ' + HP.length + ' hydrogen peroxide stability records',
            HPStabilityList: HP
        });
    })();
});

//Searches HYDROGEN_PEROXIDE_DATA for a specific record using a specific search term
router.get('/searchHPStab', (req, res) => {
    let searchData = JSON.parse(req.query.search);

    (async function () {
        let HP = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [searchData.value, 2], [searchData.name, 'hp_type']), '', [], 'db.all', res);
        res.send({
            message: 'Successfully retrieved ' + HP.length + ' hydrogen peroxide records',
            records: HP
        });
    })();
});

//Add an experiment record to the database
router.post('/addExperimentRecord', (req, res) => {
    let record = req.body.record;
    record.experimentRecord.date_created = getCurrDate();
    record.experimentRecord.date_updated = getCurrDate();
    let experimentRecordValues = Object.values(record.experimentRecord);

    /* pool.query(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', record.experimentRecord, experimentRecordValues, Object.keys(record.experimentRecord)), experimentRecordValues, (error, results) => {
        if (error) {
            res.send(error);
            throw error;
        } else {
            //res.status(200).send(results.rows);
            console.log(results.rows);
            res.send({
                message: 'Added/Updated record successfully in ' +  + ` table, ${results.rowCount} row(s) affected`,
            });
        }
    }); */

    (async function () {
        let returnData = await DBRunner(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', record.experimentRecord, experimentRecordValues, Object.keys(record.experimentRecord)), 'EXPERIMENT_RECORDS', experimentRecordValues, 'db.run', res);
        console.log(returnData);
    })();
});

//Add all the raw materials to the database
router.post('/addRawMaterial', (req, res) => {
    let record = req.body.record;
    if (record.RMList.length > 0) {
        let RMKeys = Object.keys(record.RMList[0]); //Getting keys to create the query string
        RMKeys.unshift('experiment_record_id');

        //Creating the flat array for db.run execution
        let flatRMList = [];
        record.RMList.forEach((arr) => {
            var values = Object.values(arr);
            values.unshift(record.experimentRecord.record_id);

            values.forEach((item) => {
                flatRMList.push(item);
            });
        });
        /* console.log(RMKeys);
        console.log(flatRMList); */
        (async function () {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'RAW_MATERIALS', record.RMList, [], RMKeys), 'RAW_MATERIALS', flatRMList, 'db.run', res);
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
    console.log(record);
    //Check if there are records to add
    if (record.HPList.length != 0 || record.HPStabilityList.length != 0) {
        //Creating list of keys
        let HPKeys;
        if (record.HPList.length != 0) {
            HPKeys = Object.keys(record.HPList[0]);
        } else {
            HPKeys = Object.keys(record.HPStabilityList[0]);
        };
        HPKeys.unshift('hp_type');
        HPKeys.unshift('experiment_record_id');

        //Creating list of values and paramters
        let flatHPList = [];
        let fullHPList = [];
        if (record.HPList.length != 0) {
            record.HPList.forEach((arr) => {
                var values = Object.values(arr);
                values.unshift(1); //Set hp_type to 1 for HP record
                values.unshift(record.experimentRecord.record_id);
                fullHPList.push(values);
                values.forEach((item) => {
                    flatHPList.push(item);
                });
            });
        };

        if (record.HPStabilityList.length != 0) {
            record.HPStabilityList.forEach((arr) => {
                var values = Object.values(arr);
                values.unshift(2); //Set hp_type to 2 for HP stability record 
                values.unshift(record.experimentRecord.record_id);
                fullHPList.push(values);

                values.forEach((item) => {
                    flatHPList.push(item);
                });
            });
        };

        //console.log(fullHPList);
        //console.log(flatHPList);
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

//Update an experiment record
router.post('/updateExperimentRecord', (req, res) => {
    let id = req.body.record.experimentRecord.record_id;
    let record = req.body.record;
    record.experimentRecord.date_updated = getCurrDate(); //Update the updated date of the record

    (async function () {
        let returnData = await DBRunner(queryStringBuilder('UPDATE', 'EXPERIMENT_RECORDS', id, [], Object.keys(record.experimentRecord)), 'EXPERIMENT_RECORDS', Object.values(record.experimentRecord), 'db.run', res);
        res.send({
            message: returnData.message
        });
    })();
});

//Update raw materials 
router.post('/updateRawMaterial', (req, res) => {
    let record = req.body.record;

    if (record.RMList.length > 0) {
        let RMKeys = Object.keys(record.RMList[0]); //Getting keys to create the query string
        RMKeys.shift();

        //Updating record for each raw material
        (async function () {
            let message = '';
            //Updating each record in raw materials list
            for (var i = 0; i < record.RMList.length; i++) {
                var values = Object.values(record.RMList[i]);
                values.shift(); //removing rm_id

                let returnData = await DBRunner(queryStringBuilder('UPDATE', 'RAW_MATERIALS', record.RMList[i].raw_material_id, [], RMKeys), 'RAW_MATERIALS', values, 'db.run', res);
                message += returnData.message + '\n';
            }
            res.send({
                message: message
            });
        })();
    } else {
        res.send({
            message: "Nothing to update"
        });
    };
});

//Update Hydro Perox Table 
router.post('/updateHP', (req, res) => {
    let record = req.body.record;

    if (record.HPList.length != 0 || record.HPStabilityList != 0) {
        let HPKeys;
        if (record.HPList.length != 0) {
            HPKeys = Object.keys(record.HPList[0]); //Getting keys to create the query string
        } else {
            HPKeys = Object.keys(record.HPStabilityList[0]); //Getting keys to create the query string
        };
        HPKeys.shift();

        //Updating record for each HP
        (async function () {
            let message = '';
            for (var i = 0; i < record.HPList.length; i++) {
                var values = Object.values(record.HPList[i]);
                values.shift(); //removing hp_id

                let returnData = await DBRunner(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', record.HPList[i].hp_id, [], HPKeys), 'HYDROGEN_PEROXIDE_DATA', values, 'db.run', res);
                message += returnData.message + '\n';
            };
            for (var i = 0; i < record.HPStabilityList.length; i++) {
                var values = Object.values(record.HPStabilityList[i]);
                values.shift(); //removing hp_id

                let returnData = await DBRunner(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', record.HPStabilityList[i].hp_id, [], HPKeys), 'HYDROGEN_PEROXIDE_DATA', values, 'db.run', res);
                message += returnData.message + '\n';
            };
            res.send({
                message: message
            });
        })();
    } else {
        res.send({
            message: "Nothing to update"
        });
    };

});

//Delete a full record from all tables
router.get('/deleteRecord', (req, res) => {
    let id = req.query.id;
    (async function () {
        let changes;
        let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], id, 'experiment_record_id'), '', [], 'db.run', res);
        changes += returnData.changes;
        returnData = await DBRunner(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], id, 'experiment_record_id'), '', [], 'db.run', res);
        changes += returnData.changes;
        returnData = await DBRunner(queryStringBuilder('DELETE', 'EXPERIMENT_RECORDS', [], id, 'record_id'), '', [], 'db.run', res);
        changes += returnData.changes;
        res.send({
            message: "successfully deleted " + changes + " record(s)",
        });
    })();
});

//Delete a raw material record
router.post('/deleteRawMaterial', (req, res) => {
    let id = req.body.record;
    (async function () {
        let changes;
        let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], id, 'raw_material_id'), '', [], 'db.run', res);
        changes += returnData.changes;
        res.send({
            message: "successfully deleted " + changes + " record(s)",
        });
    })();
});

//Delete an HP record
router.post('/deleteHP', (req, res) => {
    let id = req.body.record;
    //console.log(req.body)
    (async function () {
        let changes;
        let returnData = await DBRunner(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], id, 'hp_id'), '', [], 'db.run', res);
        changes += returnData.changes;
        res.send({
            message: "successfully deleted " + changes + " record(s)",
        });
    })();
});

function getCurrDate() {
    var today = new Date();
    var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
    return curDate;
}

//Dynamic sqlite query string builder
function queryStringBuilder(operation, tableName, data, parameters, parameterNames) {
    let queryString = "";
    if (operation == 'SELECT') {
        queryString = 'SELECT * FROM ';

        if (parameters.length == 0) { //Create querySrting for getRecords
            queryString += 'EXPERIMENT_RECORDS ORDER BY record_id';
        } else if (parameters.length == 1) {//Create queryString for getting an experiment record or raw materials
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0];
        } else if (parameters.length == 2) {//Create queryString for getting the HP records
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0] + ' AND ' + parameterNames[1] + ' = ' + parameters[1];
        };
    } else if (operation == 'INSERT') {

        queryString = 'INSERT INTO ' + tableName + ' (';
        for (let index = 0; index < parameterNames.length; index++) { //Creating list of column names to insert into
            if (index == 0) {
                queryString += parameterNames[index];
            } else {
                queryString += ', ' + parameterNames[index];
            };
        };

        queryString += ') VALUES ';

        if (tableName == 'EXPERIMENT_RECORDS') { //Mapping values portion to query string
            queryString += '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
        } else if (tableName == 'RAW_MATERIALS') {
            queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8 )').join(',');
        } else {
            queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )').join(',');
        }
    } else if (operation == 'UPDATE') {
        queryString = 'UPDATE ' + tableName + ' SET ';
        //Creating list of columns to update
        for (let index = 0; index < parameterNames.length; index++) {
            if (index == 0) {
                queryString += parameterNames[index] + ' = $1';
            } else {
                queryString += ', ' + parameterNames[index] + ' = $1';
            };
        };

        //Adding identifier to know which row to update
        if (tableName == 'EXPERIMENT_RECORDS') {
            queryString += ' WHERE record_id = ' + data;
        } else if (tableName == 'RAW_MATERIALS') {
            queryString += ' WHERE raw_material_id = ' + data;
        } else {
            queryString += ' WHERE hp_id = ' + data;
        };
    } else {
        queryString = 'DELETE FROM ' + tableName + ' WHERE ' + parameterNames + ' = ' + parameters;
    }

    console.log(queryString);
    return queryString;
}

async function DBRunner(queryString, tableName, parameters, sqliteMethod, res) {
    return new Promise((resolve, reject) => {
        pool.query(queryString, parameters, (error, results) => {
            if (error) {
                res.send(error);
                throw error;
            } else {
                //res.status(200).send(results.rows);
                console.log(results.rows);
                res.send({
                    message: "Successfully performed operation, " + results.rowCount + " rows affected"
                });
                resolve(results.rows);
            }
        });
    });

}


//Dynamic DB runner which handles all db calls
/* async function DBRunner(queryString, tableName, parameters, sqliteMethod, res) {
    return new Promise((resolve, reject) => {
        //Open DB
        const db = new sqlite3.Database('./router/ViroxDB.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the virox database.');
        });
        //Run DB call 
        if (sqliteMethod == 'db.all') {
            db.all(queryString, parameters, (err, rows) => {
                if (err) {
                    res.status(500).send({ "Error ": err.message });
                    return;
                } else {
                    data = rows;
                    //console.log("Rows:");
                    //console.log(data);
                }
                resolve(data);
            })
        } else if (sqliteMethod == 'db.run') {
            db.run(queryString, parameters, function (err) {
                if (err) {
                    res.status(500).send({ "Error ": err.message });
                    console.log(err.message);
                    return;
                } else {
                    data = {
                        message: 'Added/Updated record successfully in ' + tableName + ` table, ${this.changes} row(s) affected`,
                        id: this.lastID,
                        changes: this.changes
                    }
                }
                resolve(data);
            })
        }
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        })
    })

}
 */
module.exports = router;


