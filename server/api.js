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
            let result = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], []), []);
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
            const expRecData = await DBRunner(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], { record_id: id }), []);
            const RMData = await DBRunner(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], { experiment_record_id: id }), []);
            const HPData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], { experiment_record_id: id, hp_type: 1 }), []);
            const HPStabData = await DBRunner(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], { experiment_record_id: id, hp_type: 2 }), []);
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

/** Retrieves all data from the table using the specified identifier
 * Used for getting/searching from a table
 * @params data {table, identifier}
 */
router.get('/getData', (req, res) => {
    /* let JSONObject = {
        tableName: 'HYDROGEN_PEROXIDE_DATA',
        identifiers: {
            experiment_record_id: 1,
            hp_type: 1
        }
    }; */
    let JSONObject = JSON.parse(req.query.data);
    console.log(req.query.data);
    (async function () {
        try {
            const returnData = await DBRunner(queryStringBuilder('SELECT', JSONObject.tableName, [], JSONObject.identifiers), []);
            console.log(returnData);
            res.status(status.success).send({
                message: "Successfully retrieved " + returnData.rows.length + " record(s) from " + JSONObject.tableName,
                rows: returnData.rows
            });
        } catch (error) {
            console.log(error);
            res.status(status.error).send(error);
        }
    })();

});


//DEPRECATED FUNCTIONS (All search and getters now use getData)
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


router.post('/addData', (req, res) => {
    let JSONObject = req.body.data
    //console.log(flattenArray(JSONObject.data));
    console.log(JSONObject);
    (async function () {
        try {
            const returnData = await DBRunner(queryStringBuilder('INSERT', JSONObject.tableName, JSONObject.data, {}), flattenArray(JSONObject.data));
            console.log(returnData.rows);
            res.status(status.success).send({
                message: "Successfully inserted " + returnData.rowCount + " record(s) to " + JSONObject.tableName,
                rows: returnData.rows
            });
        } catch (error) {
            console.log(error.details);
            res.status(status.error).send(error.details);
        }
    })();
});


//TO REMOVE AFTER
//Add an experiment record to the database
router.post('/addExperimentRecord', (req, res) => {
    let record = req.body.record;
    record.experimentRecord.date_created = getCurrDate();
    record.experimentRecord.date_updated = getCurrDate();
    let experimentRecord = [];
    experimentRecord.push(record.experimentRecord);

    (async function () {
        try {
            let returnData = await DBRunner(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', experimentRecord, []), Object.values(experimentRecord[0]));
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
    console.log(HPRecord);
    HPRecord.forEach(element => {
        element.date_created = getCurrDate();
        element.date_updated = getCurrDate();
    })


        (async function () {
            try {
                let returnData = await DBRunner(queryStringBuilder('INSERT', 'HYDROGEN_PEROXIDE_DATA', HPRecord), flattenArray(HPRecord));
                res.status(status.success).send({
                    message: `Successfully added ${returnData.rowCount} row(s) to hydrogen peroxide data`
                });
            } catch (error) {
                res.status(status.error).send(error.message);
            }
        })();

});

router.post('/updateData', (req, res) => {
    let JSONObject = req.body.data;
    console.log(JSONObject);

    (async function () {
        try {
            let count = 0;
            //Updating each row 
            for (var i = 0; i < JSONObject.data.length; i++) {
                let record = JSONObject.data[i];
                record.date_updated = getCurrDate();

                //Getting identifiers
                let identifiers = {}
                let colNames = Object.keys(record);
                let colValues = Object.values(record);
                identifiers[colNames.shift()] = colValues.shift();

                //console.log(record);
                console.log(identifiers);
                console.log(colNames);
                console.log(colValues);
                const returnData = await DBRunner(queryStringBuilder('UPDATE', JSONObject.tableName, colNames, identifiers), colValues);
                count += returnData.rowCount;
                console.log(returnData);
            }
    res.status(status.success).send({
        message: "Successfully updated " + count + " record(s) from " + JSONObject.tableName,
    });
} catch (error) {
    console.log(error.details);
    res.status(status.error).send(error.details);
}
    }) ();
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
            let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], id, 'raw_material_id'), []);
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
    //var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
    var curDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    return curDate;
}

function flattenArray(array) {
    var newArr = [];
    array.forEach(element => Object.values(element).forEach(value => {
        newArr.push(value)
    }));
    return newArr;
}


//Dynamic query string builder
function queryStringBuilder(operation, tableName, parameters, identifiers) {
    let queryString = [];
    queryString.push(setCommand(operation, tableName, identifiers));
    //console.log(queryString.join(' '));
    queryString.push(setValues(operation, parameters, identifiers));
    //console.log(queryString.join(' '));
    return queryString.join(' ');
}

//Builds the command section of the query string
function setCommand(operation, tableName, identifiers) {
    let commandSectionString = [operation];
    if (operation == 'SELECT') {
        commandSectionString.push('* FROM ' + tableName);
        //Completes string if its getting all experiment records
        if (tableName == 'EXPERIMENT_RECORDS' && identifiers.length == 0) {
            commandSectionString.push('ORDER BY record_id');
        } else {
            commandSectionString.push('WHERE');
        }
    } else if (operation == 'INSERT') {
        commandSectionString.push('INTO ' + tableName);
    } else if (operation == 'UPDATE') {
        commandSectionString.push(tableName + ' SET');
    } else {
        commandSectionString.push('FROM ' + tableName + ' WHERE');
    }
    return commandSectionString.join(' ');
}

//Builds the values/identifiers section of the query string
function setValues(operation, parameters, identifiers) {
    let valueSectionString = [];
    if (operation == 'UPDATE') {
        //Creating list of columns to update
        let set = [];
        for (let index = 0; index < parameters.length; index++) {
            set.push(parameters[index].toLowerCase() + ' = ( $' + (index + 1) + ' )');
        };
        valueSectionString.push(set.join(', '));

        valueSectionString.push('WHERE');
    } else if (operation == 'INSERT') {
        //Creates the column names of the values to be inserted
        valueSectionString.push('(');
        valueSectionString.push(Object.keys(parameters[0]).join(', '));
        valueSectionString.push(') VALUES');

        //Creating chunks of paramter values
        let i = 1;
        let values = Array(parameters.length).fill() //For each row
            .map(v => `(${Array(Object.values(parameters[0]).length).fill() //For each column
                .map(v => `$${i++}`).join(", ")})`).join(", ");
        //console.log(values);
        valueSectionString.push(values);

        //Adding a returning statement to get the ID(and other data) of the inserted row
        valueSectionString.push('RETURNING *');

    }

    //Setting identifiers (e.g WHERE record_id = 1)
    let set = [];
    Object.keys(identifiers).forEach(key => {
        set.push(key + ' = ' + identifiers[key]);
    });
    valueSectionString.push(set.join(' AND '));

    return valueSectionString.join(' ');
}

//Query runner for database
function DBRunner(queryString, params) {
    console.log(queryString);
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


