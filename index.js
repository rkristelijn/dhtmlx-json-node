const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const port = 3000;

mongoose.connect('mongodb://localhost/cms');
mongoose.set('debug', true);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

app.use('/', express.static(path.join(__dirname, 'public')));

const apiRouter = require('./api/api-router')();
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log('listening on *:' + port);
});
