const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./router/RouterAPI.js');
const app = express();
const cors = require('cors');

app.use(morgan('short'));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});
