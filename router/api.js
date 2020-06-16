const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const listAPI = require('../data/listAPI');
const app = express();


app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router = express.Router();

//Send the API to the root of page
router.get('/',(req,res)=>
{
    res.send(listAPI);
}
)

//Gets all records from experiment records table
router.get('/getRecords', (req, res) => {
    let db = new sqlite3.Database('./ViroxDB.db');
    
        let queryString = 'SELECT * FROM EXPERIMENT_RECORDS';
        let records;
        db.all(queryString, [], (err, rows) => {
            if (err) {
                console.log(err.message);
                throw err;
            } else {
                records = rows;
                res.send(records);
            }
            
        });
        // close the database connection
        db.close();
});


module.exports = router;