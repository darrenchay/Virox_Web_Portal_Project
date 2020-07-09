require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./api.js');
const app = express();
const cors = require('cors');

app.use(morgan('short'));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});
