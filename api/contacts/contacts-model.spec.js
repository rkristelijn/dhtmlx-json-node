const mongoose = require('mongoose');
const Contact = require('./contacts-model');
// const fs = require('fs');

mongoose.connect('mongodb://localhost/cms');
mongoose.set('debug', true);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

// fs.readFile('./contacts.json', (err, data) => {
//   if(err) console.log('error', err);
//   obj = JSON.parse(data);
//   for (contact of obj.rows) {
//     console.log(contact.data[1]);
//   }
// });

contact = new Contact({
  photo: "<img src=\"imgs/contacts/small/margaret-black.jpg\" border=\"0\" class=\"contact_photo\">",
  name: "Margaret Black",
  dob: "9/1/1985",
  pos: "CEO",
  email: "mblack_ceo@mail.com",
  phone: "1-805-287-4750",
  info: "M Black Ltd"
});

contact.save(err => {
  if (err) {
    console.log('error', err);
  }
});
