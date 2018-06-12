const Contact = require('./contacts-model');
const fs = require('fs');

fs.readFile('./api/contacts/contacts.json', (err, data) => {
  if (err) console.log('error', err);
  obj = JSON.parse(data);
  for (contact of obj.rows) {
    console.log(`Creating ${contact.data[1]}...`);
    contact = new Contact({
      photo: contact.data[0],
      name: contact.data[1],
      dob: contact.data[2],
      pos: contact.data[3],
      email: contact.data[4],
      phone: contact.data[5],
      company: contact.data[6],
      info: contact.data[7]
    });

    contact.save(err => {
      if (err) {
        console.log('error', err);
      }
    });
  }
});
