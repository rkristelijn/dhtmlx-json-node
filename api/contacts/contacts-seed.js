const Contact = require('./contacts-model');
const fs = require('fs');

fs.readFile('./api/contacts/contacts.json', (err, data) => {
  console.log(`Creating contacts...`);

  if (err) console.log('error', err);
  obj = JSON.parse(data);
  for (item of obj.rows) {
    console.log(`\tCreating ${item.data[1]}...`);
    contact = new Contact({
      photo: item.data[0],
      name: item.data[1],
      dob: item.data[2],
      pos: item.data[3],
      email: item.data[4],
      phone: item.data[5],
      company: item.data[6],
      info: item.data[7]
    });

    contact.save(err => {
      if (err) {
        console.log('error', err);
      }
    });
  }
});
