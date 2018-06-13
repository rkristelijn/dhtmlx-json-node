const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cms');
mongoose.set('debug', true);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

db.dropDatabase();

require('./api/contacts/contacts-seed.js');
require('./api/projects/projects-seed.js');
require('./api/events/events-seed.js');

console.log(`press CTRL+C to exit`);
