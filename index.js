const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('express-log');

// config
const port = 3000;

// set up middleware
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up connection
mongoose.connect('mongodb://localhost/cms');
mongoose.set('debug', true);
let db = mongoose.connection;

// database events
db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

// public (static) route
app.use('/', express.static(path.join(__dirname, 'public')));

// API connection
const apiRouter = require('./api/api-router')();
app.use('/api', apiRouter);

// starting the app
app.listen(port, () => {
  console.log('listening on *:' + port);
});
