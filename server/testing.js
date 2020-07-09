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
    raw_material_lot: " ",
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
        commandSectionString.push(tableName + 'AS original SET');
    } else {
        commandSectionString.push('FROM ' + tableName + ' WHERE');
    }
    return commandSectionString.join(' ');
}

//Builds the values/identifiers section of the query string
function setValues(operation, parameters, identifiers) {
    let valueSectionString = [];
    //Builds select and delete identifiers, joined with the AND clause
    if (operation == 'INSERT') {
        //Creates the column names of the values to be inserted
        valueSectionString.push('(');
        let keys = Object.keys(parameters[0]);
        valueSectionString.push(keys.join(', '));
        valueSectionString.push(') VALUES');

        //Dynamically creates the set of values for the insert statement
        let i = 1;
        let values = Array(parameters.length).fill() //For each row
            .map(v => `(${Array(Object.values(parameters[0]).length).fill() //For each column
                .map(v => `$${i++}`).join(", ")})`).join(", ");
        //console.log(values);
        valueSectionString.push(values);
        
        //Adding a returning statement to get the ID(and other data) of the inserted row
        valueSectionString.push('RETURNING *');
    } else if (operation == 'UPDATE') {
        let set = [];
        for (let index = 0; index < Object.keys(parameters[0]).length; index++) {
            set.push(Object.keys(parameters[0])[index].toLowerCase() + ' = ( $' + (index + 1) + ' )');
        };
        queryString += set.join(', ');
        valueSectionString.push('WHERE');
    }

    let set = [];
    Object.keys(identifiers).forEach(key => {
        set.push(key + ' = ' + identifiers[key]);
    });
    valueSectionString.push(set.join(' AND '));
    return valueSectionString.join(' ');
}

(function () {
    /* console.log(queryStringBuilder('SELECT', 'EXPERIMENT_RECORDS', [], {}));
    console.log(queryStringBuilder('SELECT', 'RAW_MATERIALS', [], { experiment_record_id: 1 }));
    console.log(queryStringBuilder('SELECT', 'HYDROGEN_PEROXIDE_DATA', [], { experiment_record_id: 1, hp_id: 1 }));
 */
    console.log(queryStringBuilder('INSERT', 'EXPERIMENT_RECORDS', experimentRecord, {}));
    console.log();
    console.log(queryStringBuilder('INSERT', 'RAW_MATERIALS', RMList, {}));
    console.log();
    console.log(queryStringBuilder('INSERT', 'HYDROGEN_PEROXIDE_DATA', HPList, {}));

    /* console.log(queryStringBuilder('UPDATE', 'EXPERIMENT_RECORDS', experimentRecord, { record_id: 1 }));
    console.log(queryStringBuilder('UPDATE', 'RAW_MATERIALS', RMList, { raw_material_id: 1 }));
    console.log(queryStringBuilder('UPDATE', 'HYDROGEN_PEROXIDE_DATA', HPList, { hp_id: 1 }));

    console.log(queryStringBuilder('DELETE', 'EXPERIMENT_RECORDS', [], { record_id: 1 }));
    console.log(queryStringBuilder('DELETE', 'RAW_MATERIALS', [], { raw_material_id: 1 }));
    console.log(queryStringBuilder('DELETE', 'HYDROGEN_PEROXIDE_DATA', [], { hp_id: 1 })); */
})();

//Dynamic query string builder
/* function queryStringBuilder(operation, tableName, data, parameters, parameterNames) {
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
} */