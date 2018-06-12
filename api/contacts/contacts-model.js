const mongoose = require('mongoose');

const ContactsSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    default: "<img src='imgs/contacts/small/some-one.png' border='0' class='contact_photo' height='40' width='40'>"
  },
  name: String,
  dob: String,
  pos: String,
  email: String,
  phone: String,
  company: String,
  info: String
});

const Contact = mongoose.model('Contact', ContactsSchema);

module.exports = Contact;
