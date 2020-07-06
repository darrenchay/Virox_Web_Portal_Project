const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./API/api.js');
const app = express();

app.use(morgan('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api', router);

const port = process.env.PORT || 3000
app.listen(port)
console.log(`app is listening on port: ${port}`)
