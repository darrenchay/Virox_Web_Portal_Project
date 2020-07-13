const connection = require('./dbAuth.js');
let experimentRecord = [{
    lot_no: "66661",
    project_title: "updated experiment name",
    formulation_date: "2020-12-5",
    preparation_date: "2020-12-5",
    prepared_by: "Dave Dave",
    quantity: "400",
    notes: "Take 100g and Test stability in 54C for 2 weeks\nTake 100g and Test stability in 50C for 35 days\nProvide 100g to Sean/Cesar to conduct corrosion testing on Brass.",
    preparation_reason: "To test improved F/T performance and reduce corrosion of the RTU formula while making it fall under our newly filed patents",
    observations: "",
    total_percentage_w: "100.0",
    total_ar: "355.6",
    total_ad: "355.84",
    date_created: "2020-12-5",
    date_updated: "2020-12-5"
}]

let RMList = [{
    experiment_record_id: 1,
    raw_material_name: "chemical L63",
    percentage_w: 11.11,
    raw_material_lot: null,
    ar: 44.44,
    ad: 44.48,
    time_added: "2020-12-5",
    notes: "this is an update",
    date_created: "2020-12-5",
    date_updated: "2020-12-5"
}, {
    experiment_record_id: 1,
    raw_material_name: "test L63",
    percentage_w: 22.22,
    raw_material_lot: " ",
    ar: 44.44,
    ad: 44.48,
    time_added: "2020-12-5",
    notes: "this is an update",
    date_created: "2020-12-5",
    date_updated: "2020-12-5"
}]

let HPList = [{
    hp_type: 1,
    experiment_record_id: 1,
    experiment_name: "Trial 1",
    n: 0.1000,
    m: null,
    vol_change: null,
    h2o2: 0.1000,
    ph: 0.870,
    accepted_range: "~ 0.8%",
    date: "2020-12-5",
    initials: "D.C",
    date_created: "2020-12-5",
    date_updated: "2020-12-5"
},
{
    hp_type: 1,
    experiment_record_id: 1,
    experiment_name: "Trial 2",
    n: 0.1000,
    m: null,
    vol_change: null,
    h2o2: 0.1000,
    ph: 0.870,
    accepted_range: "~ 0.8%",
    date: "2020-12-5",
    initials: "D.C",
    date_created: "2020-12-5",
    date_updated: "2020-12-5"
}];


function queryStringBuilder(operation, tableName, parameters, identifiers) {
    let queryString = [];
    queryString.push(setCommand(operation, tableName));
    queryString.push(setValues(operation, parameters, identifiers));
    return queryString.join(' ');
}

//Builds the command section of the query string
function setCommand(operation, tableName) {
    let commandSectionString = [operation];
    if (operation == 'SELECT') {
        commandSectionString.push('* FROM ' + tableName);
        //Completes string if its getting all experiment records
        if (tableName == 'EXPERIMENT_RECORDS') {
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

function createValues(parameters) {
    //Dynamically creates the set of values for the insert statement
    let i = 1;
    let values = Array(parameters.length).fill() //For each row
        .map(v => `(${Array(Object.values(parameters[0]).length).fill() //For each column
            .map(v => `$${i++}`).join(", ")})`).join(", ");
    return values;
}

(function () {
    //DBRunner(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', experimentRecord, {}), flattenArray(experimentRecord));
    //DBRunner(queryStringBuilder('INSERT', 'RAW_MATERIALS', RMList, {}), flattenArray(RMList));
    //DBRunner(queryStringBuilder('INSERT', 'HYDROGEN_PEROXIDE_DATA', HPList, {}), flattenArray(HPList));

    RMList = [{
        raw_material_id: 1,
        experiment_record_id: 1,
        raw_material_name: "new L63",
        percentage_w: 11.11,
        raw_material_lot: "123-C",
        ar: 44.44,
        ad: 44.48,
        time_added: "2020-12-5",
        notes: "test",
        date_created: "2020-12-5",
        date_updated: "2020-12-5"
    }, {
        raw_material_id: 2,
        experiment_record_id: 1,
        raw_material_name: "test L63",
        percentage_w: 22.22,
        raw_material_lot: " ",
        ar: 44.44,
        ad: 44.48,
        time_added: "2020-12-5",
        notes: "this is an update",
        date_created: "2020-12-5",
        date_updated: "2020-12-5"
    }]

    HPList = [{
        hp_id: 1,
        hp_type: 1,
        experiment_record_id: 1,
        experiment_name: "Trial 1",
        n: 0.1000,
        m: null,
        vol_change: null,
        h2o2: 0.1000,
        ph: 0.870,
        accepted_range: "~ 0.8%",
        date: "2020-12-5",
        initials: "D.C",
        date_created: "2020-12-5",
        date_updated: "2020-12-5"
    },
    {
        hp_id: 2,
        hp_type: 1,
        experiment_record_id: 1,
        experiment_name: "Trial 2",
        n: 0.1000,
        m: null,
        vol_change: null,
        h2o2: 0.1000,
        ph: 0.870,
        accepted_range: "~ 0.8%",
        date: "2020-12-5",
        initials: "D.C",
        date_created: "2020-12-5",
        date_updated: "2020-12-5"
    }];
    experimentRecord = [{
        record_id: 1,
        lot_no: "12345",
        project_title: "updated experiment name",
        formulation_date: "2020-12-5",
        preparation_date: "2020-12-5",
        prepared_by: "Dave Dave",
        quantity: "400",
        notes: "Take 100g and Test stability in 54C for 2 weeks\nTake 100g and Test stability in 50C for 35 days\nProvide 100g to Sean/Cesar to conduct corrosion testing on Brass.",
        preparation_reason: "To test improved F/T performance and reduce corrosion of the RTU formula while making it fall under our newly filed patents",
        observations: "",
        total_percentage_w: "100.0",
        total_ar: "355.6",
        total_ad: "355.84",
        date_created: "2020-12-5",
        date_updated: "2020-12-5"
    }]

    //DBRunner(queryStringBuilder('UPDATE', 'EXPERIMENT_RECORDS', Object.keys(experimentRecord[0]), { record_id: 1 }), Object.values(experimentRecord[0]));
    //DBRunner(queryStringBuilder('UPDATE', 'RAW_MATERIALS', Object.keys(RMList[0]), { raw_material_id: 1 }), Object.values(RMList[0]));
    /* console.log(queryStringBuilder('UPDATE', 'EXPERIMENT_RECORDS', Object.keys(experimentRecord[0]), { record_id: 1 }));
    console.log();
    console.log(queryStringBuilder('UPDATE', 'RAW_MATERIALS', Object.keys(RMList[0]), { raw_material_id: 1 }));
    console.log();
    console.log(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', Object.keys(HPList[0]), { hp_id: 1 })); */
    //console.log(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], { raw_material_id: 1 }));
    /* console.log(queryStringBuilder('DELETE', 'EXPERIMENT_RECORDS', [], { record_id: 1 }));
    console.log();
    console.log(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], { raw_material_id: 1 }));
    console.log();
    console.log(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], { hp_id: 1 })); */
})();

function flattenArray(array) {
    var newArr = [];
    array.forEach(element => Object.values(element).forEach(value => {
        newArr.push(value)
    }));
    return newArr;
}

//Query runner for database
function DBRunner(queryString, params) {
    console.log(queryString);
    console.log(params);
    return new Promise((resolve, reject) => {
        connection.query(queryString, params)
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}


/* 'UPDATE fit_ratios as f set ratio_budget = c.value 
from (VALUES ' +  chunks.join(', ') + ') as c(id, value) 
WHERE c.id = f.ratio_id' */