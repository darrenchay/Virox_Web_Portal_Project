const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const authDetails= require('./data/authDetails')
const apiRouter = require('./routes/api')
const listAPI = require('./data/listAPI')

const app = express()
app.use(function(req, res, next) {
    res.header("Allow-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "authorization,content-type");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
   next();
});
app.use(morgan('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api', apiRouter)
const port = 3000

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`)
)