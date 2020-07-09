const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { query } = require('express');
const connection = require('./dbAuth.js');
const router = express.Router();
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const status = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    created: 201,
    bad: 400,
    nocontent: 204,
}

/* router.get('/test', (req, res) => {
    const page = parseInt(req.query.page);
    res.send({
        message: "testing",
        page: page
    })
}) */

//Get all the records to display on table
router.get('/getRecords', (req, res) => {
    const page = parseInt(req.query.page);
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let previous, next;
    if (startIndex > 0) {
        previous = page - 1;
    };
    (async function () {
        try {
            let result = await DBRunner(queryStringBuilder('SELECT', [], [], [], []), []);
            let rows = result.rows;
            if (endIndex < rows.length) {
                next = page + 1;
            }
            res.status(status.success).send({
                message: "successfully retrieved " + rows.length + " record(s)",
                records: rows.slice(startIndex, endIndex),
                pageCount: Math.ceil(rows.length / limit),
                next: next,
                previous: previous
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

    })();
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

    (async function () {
        try {
            const expRecData = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [id], ['record_id']), []);
            const RMData = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), []);
            const HPData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), []);
            const HPStabData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 2], ['experiment_record_id', 'hp_type']), []);
            record.experimentRecord = expRecData.rows[0];
            console.log(record.experimentRecord.record_id);
            record.RMList = RMData.rows;
            record.HPList = HPData.rows;
            record.HPStabilityList = HPStabData.rows;
            res.status(status.success).send({
                message: `Successfully retrieved record ${record.experimentRecord.record_id} from EXPERIMENT_RECORDS. Retrieved ${record.RMList.length} Raw Materials, ${record.HPList.length} Hydrogren Peroxide Data and ${record.HPStabilityList.length} Hydrogen Peroxide Stability Data`,
                records: record
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

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
        try {
            const returnData = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], [searchData.value], [searchData.name]), []);
            console.log(returnData);
            record.experimentRecord = returnData.rows;
            console.log(record);
            res.status(status.success).send({
                message: "Successfully retrieved " + record.experimentRecord.length + " record(s)",
                records: record
            });
        } catch (error) {
            console.log(error);
            res.status(status.error).send(error.message);
        }
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
        try {
            const returnData = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [id], ['experiment_record_id']), []);
            record.RMList = returnData.rows;
            console.log(record.RMList);
            res.status(status.success).send({
                message: 'Successfully retrieved ' + record.RMList.length + ' raw materials',
                RMList: record.RMList
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

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
        try {
            let returnData = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], [searchData.value], [searchData.name]), []);
            record.RMList = returnData.rows;
            console.log(record.RMList);
            res.send({
                message: "Successfully retrieved " + record.RMList.length + " record(s)",
                records: record
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

    })();

});

//Gets Hydro perox data for a specific record
router.get('/getHP', (req, res) => {
    const id = req.query.id;

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 1], ['experiment_record_id', 'hp_type']), []);
            res.send({
                message: 'Successfully retrieved ' + returnData.rows.length + ' hydrogen peroxide records',
                HPList: returnData.rows
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

    })();
});

//Searches HYDROGEN_PEROXIDE_DATA for a specific record using a specific search term
router.get('/searchHP', (req, res) => {
    let searchData = JSON.parse(req.query.search);

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [searchData.value, 1], [searchData.name, 'hp_type']), []);
            res.send({
                message: 'Successfully retrieved ' + returnData.rows.length + ' hydrogen peroxide records',
                records: returnData.rows
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
    })();
});

//Gets Hydro Perox stabilityh data for a specific record
router.get('/getHPStab', (req, res) => {
    const id = req.query.id;

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [id, 2], ['experiment_record_id', 'hp_type']), '', [], 'db.all', res);
            res.send({
                message: 'Successfully retrieved ' + returnData.rows.length + ' hydrogen peroxide stability records',
                HPStabilityList: returnData.rows
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
    })();
});

//Searches HYDROGEN_PEROXIDE_DATA for a specific record using a specific search term
router.get('/searchHPStab', (req, res) => {
    let searchData = JSON.parse(req.query.search);

    (async function () {
        try {
            let HP = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], [searchData.value, 2], [searchData.name, 'hp_type']), '', [], 'db.all', res);
            res.send({
                message: 'Successfully retrieved ' + HP.length + ' hydrogen peroxide records',
                records: HP
            });
        } catch (error) {
            res.status(status.error).send(error.message);
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
        try {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', record.experimentRecord, experimentRecordValues, Object.keys(record.experimentRecord)), experimentRecordValues);
            console.log(returnData);
            res.status(status.success).send({
                message: `Successfully inserted ${returnData.rowCount} rows into experiment_records`,
                id: returnData.rows[0].record_id
            })
        } catch (error) {
            res.status(status.error).send(error.message);
        }

    })();
});

//TO REFACTOR
//Add a raw materials to the database
router.post('/addRawMaterial', (req, res) => {
    let record = req.body.record;
    if (record.RMList.length > 0) {
        record.RMList[0].date_created = getCurrDate();
        record.RMList[0].date_updated = getCurrDate();
        let RMKeys = Object.keys(record.RMList[0]); //Getting keys to create the query string
        RMKeys.unshift('experiment_record_id');

        //Creating the flat array for query execution
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
            try {
                let returnData = await DBRunner(queryStringBuilder('INSERT', 'RAW_MATERIALS', record.RMList, [], RMKeys), flatRMList);
                console.log(returnData);
                res.status(status.success).send({
                    message: `Successfully added ${returnData.rowCount} rows to Raw Materials`
                });
            } catch (error) {
                res.status(status.error).send(error.message);
            }

        })();
    } else {
        res.send({
            message: 'No data to add'
        });
    };
});

//Adds a hydrogen peroxide data record to the database
router.post('/addHP', (req, res) => {
    let HPRecord = req.body.HPRecord;
    HPRecord.date_created = getCurrDate();
    HPRecord.date_updated = getCurrDate();
    let HPvalues = Object.values(HPRecord);
    let HPKeys = Object.keys(HPRecord);

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'HYDROGEN_PEROXIDE_DATA', HPvalues, [], HPKeys), HPvalues);
            res.status(status.success).send({
                message: `Successfully added ${returnData.rowCount} row(s) to hydrogen peroxide data`
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
    })();

});

//Update an experiment record
router.post('/updateExperimentRecord', (req, res) => {
    let id = req.body.record.experimentRecord.record_id;
    let record = req.body.record;
    record.experimentRecord.date_updated = getCurrDate(); //Update the date updated of the record

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('UPDATE', 'EXPERIMENT_RECORDS', id, Object.values(record.experimentRecord), Object.keys(record.experimentRecord)), Object.values(record.experimentRecord));
            //console.log(returnData);
            res.status(status.success).send({
                message: `Successfully updated record ${returnData.rowCount} from experiment_records`
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
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
            try {
                let count = 0;
                //Updating each record in raw materials list
                for (var i = 0; i < record.RMList.length; i++) {
                    record.RMList[i].date_updated = getCurrDate();

                    var values = Object.values(record.RMList[i]);
                    values.shift(); //removing rm_id
                    //console.log(values);

                    let returnData = await DBRunner(queryStringBuilder('UPDATE', 'RAW_MATERIALS', record.RMList[i].raw_material_id, [], RMKeys), values);
                    count += returnData.rowCount;
                }
                res.status(status.success).send({
                    message: `Successfully updated ${count} rows from raw_materials table`
                });
            } catch (error) {
                res.status(status.error).send(error.message);
            }
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
            try {
                let count = 0;
                for (var i = 0; i < record.HPList.length; i++) {
                    record.HPList[i].date_updated = getCurrDate();
                    var values = Object.values(record.HPList[i]);
                    values.shift(); //removing hp_id

                    let returnData = await DBRunner(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', record.HPList[i].hp_id, [], HPKeys), values);
                    count += returnData.rowCount;
                };
                for (var i = 0; i < record.HPStabilityList.length; i++) {
                    record.HPStabilityList[i].date_updated = getCurrDate();
                    var values = Object.values(record.HPStabilityList[i]);
                    values.shift(); //removing hp_id

                    let returnData = await DBRunner(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', record.HPStabilityList[i].hp_id, [], HPKeys), values);
                    count += returnData.rowCount;
                };
                res.status(status.success).send({
                    message: `Successfully updated ${count} rows from hydrogen_peroxide_data table`
                });
            } catch (error) {
                res.status(status.error).send(error.message);
            }

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
        try {
            let changes = {};
            let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], id, 'experiment_record_id'), []);
            //console.log(returnData);
            changes.RM = returnData.rowCount;
            returnData = await DBRunner(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], id, 'experiment_record_id'), []);
            //console.log(returnData);
            changes.HP = returnData.rowCount;
            returnData = await DBRunner(queryStringBuilder('DELETE', 'EXPERIMENT_RECORDS', [], id, 'record_id'), []);
            //console.log(returnData);
            changes.ER = returnData.rowCount;
            res.status(status.success).send({
                message: `successfully deleted ${changes.ER} record(s) from experiment_records, ${changes.RM} from raw_materials and ${changes.HP} from hydrogen_peroxide_data `,
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }

    })();
});

//Delete a raw material record
router.post('/deleteRawMaterial', (req, res) => {
    let id = req.body.record;
    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], id, 'raw_material_id'),[]);
            res.status(status.success).send({
                message: "successfully deleted " + returnData.rowCount + " record(s) from raw_materials",
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
    })();
});

//Delete an HP record
router.post('/deleteHP', (req, res) => {
    let id = req.body.record;
    //console.log(req.body)
    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], id, 'hp_id'), '', [], 'db.run', res);
            res.status(status.success).send({
                message: "successfully deleted " + returnData.rowCount + " record(s) from hydrogen_peroxide_data",
            });
        } catch (error) {
            res.status(status.error).send(error.message);
        }
        
    })();
});

function getCurrDate() {
    var today = new Date();
    var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
    return curDate;
}

//Dynamic query string builder
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
            //queryString += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        } else if (tableName == 'RAW_MATERIALS') {
            queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )').join(',');
            //queryString += data.map(() => '( ?, ?, ?, ?, ?, ?, ?, ? )').join(',');
        } else {
            //queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )').join(',');
            queryString += '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 )';
        }

        queryString += ' RETURNING *'
    } else if (operation == 'UPDATE') {
        queryString = 'UPDATE ' + tableName + ' SET ';
        //Creating list of columns to update
        let set = [];
        for (let index = 0; index < parameterNames.length; index++) {
            set.push(parameterNames[index].toLowerCase() + ' = ( $' + (index + 1) + ' )');
        };
        queryString += set.join(', ');

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

function setCommand(operation, tableName) {
    if (operation == 'SELECT') {
        queryString = 'SELECT * FROM ' + tableName;

        if (parameters.length == 0) { //Create querySrting for getRecords
            queryString += 'EXPERIMENT_RECORDS ORDER BY record_id';
        } else if (parameters.length == 1) {//Create queryString for getting an experiment record or raw materials
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0];
        } else if (parameters.length == 2) {//Create queryString for getting the HP records
            queryString += tableName + ' WHERE ' + parameterNames[0] + ' = ' + parameters[0] + ' AND ' + parameterNames[1] + ' = ' + parameters[1];
        };
    }else if (operation == 'INSERT') {

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
            //queryString += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        } else if (tableName == 'RAW_MATERIALS') {
            queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )').join(',');
            //queryString += data.map(() => '( ?, ?, ?, ?, ?, ?, ?, ? )').join(',');
        } else {
            //queryString += data.map(() => '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )').join(',');
            queryString += '( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 )';
        }

        queryString += ' RETURNING *'
    } else if (operation == 'UPDATE') {
        queryString = 'UPDATE ' + tableName + ' SET ';
        //Creating list of columns to update
        let set = [];
        for (let index = 0; index < parameterNames.length; index++) {
            set.push(parameterNames[index].toLowerCase() + ' = ( $' + (index + 1) + ' )');
        };
        queryString += set.join(', ');

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
}

//Query runner for database
function DBRunner(queryString, params) {
    return new Promise((resolve, reject) => {
        connection.query(queryString, params)
            .then((result) => {
                //console.log(result);
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}
module.exports = router;


