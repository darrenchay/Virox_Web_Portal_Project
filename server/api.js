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

/** Retrieves all data from the specified table using the specified identifier
 * Used for getting/searching from a table
 * @params data {table, identifier}
 */
router.get('/getData', (req, res) => {
    let JSONObject = JSON.parse(req.query.data);
    console.log(JSONObject);
    (async function () {
        try {
            const returnData = await DBRunner(queryStringBuilder('SELECT', JSONObject.tableName, [], JSONObject.identifiers), []);
            //console.log(returnData.rows);
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

/** Inserts rows to the specified table
 * @params data {tableName, data[]}
 */
router.post('/addData', (req, res) => {
    let JSONObject = req.body.data
    //console.log(flattenArray(JSONObject.data));
    console.log(JSONObject);
    (async function () {
        try {
            for (var i = 0; i < JSONObject.data.length; i++) {
                let record = JSONObject.data[i];
                record.date_created = getCurrDate();
                record.date_updated = getCurrDate();
            }
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

/** Updates rows to the specified table using the specified identifier (generally the ID)
 * @params data {tableName, data[] (with identifiers)}
 */
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

                //Extracting identifiers
                let identifiers = {}
                let colNames = Object.keys(record);
                let colValues = Object.values(record);
                identifiers[colNames.shift()] = colValues.shift();

                //console.log(record);
                /* console.log(identifiers);
                console.log(colNames);
                console.log(colValues); */
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
    })();
});
/** Deletes rows from the specified table (including tables with related foreign keys) using the specified identifier (generally the ID)
 * @params data {tableName, identifiers}
 */
router.post('/deleteData', (req, res) => {
    let JSONObject = req.body.data;
    console.log(JSONObject);
    console.log(JSONObject);


    (async function () {
        try {
            if (JSONObject.tableName == 'EXPERIMENT_RECORDS') {
                let changes = {};
                let returnData = await DBRunner(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], { experiment_record_id: JSONObject.identifiers.record_id }), []);
                //console.log(returnData);
                changes.RM = returnData.rowCount;
                returnData = await DBRunner(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], { experiment_record_id: JSONObject.identifiers.record_id }), []);
                //console.log(returnData);
                changes.HP = returnData.rowCount;
                returnData = await DBRunner(queryStringBuilder('DELETE', JSONObject.tableName, [], JSONObject.identifiers), []);
                //console.log(returnData);
                changes.ER = returnData.rowCount;
                res.status(status.success).send({
                    message: `successfully deleted ${changes.ER} record(s) from experiment_records, ${changes.RM} from raw_materials and ${changes.HP} from hydrogen_peroxide_data `,
                });
            } else {
                returnData = await DBRunner(queryStringBuilder('DELETE', JSONObject.tableName, [], JSONObject.identifiers), []);
                res.status(status.success).send({
                    message: `successfully deleted ${returnData.rowCount} record(s) from ${JSONObject.tableName}`,
                });
            }
        } catch (error) {
            res.status(status.error).send(error.message);
        }
    })();

});

//Gets current date in the appropriate format
function getCurrDate() {
    var today = new Date();
    //var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
    var curDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    return curDate;
}


//Helper function which flattens a 2D array into a 1D array
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
    queryString.push(setCommand(operation, tableName, identifiers)); //Creating command section of string
    queryString.push(setValues(operation, parameters, identifiers)); //Creating values section of string
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


