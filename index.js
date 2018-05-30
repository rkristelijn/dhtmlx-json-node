const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

const apiRouter = require('./api/api-router')();
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log('listening on *:' + port);
});
