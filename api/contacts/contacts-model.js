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

// schema functions before here

const Contact = mongoose.model('Contact', ContactsSchema);

// we can extend functions before exporting them, allowing crud operations:

/*
GET	Read (all, or with id; one) using .find(), .findOne(), .findById() and .where()
POST	Create (none) .save()
PUT	Update (one) .findByIdAndUpdate(id, data, {new:true}), .findOneAndUpdate()
DELETE	Delete (one) .findByIdAndRemove(), .delete()
*/

module.exports = Contact;
