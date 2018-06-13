const mongoose = require('mongoose');

const EventsSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  image: String,
  title: String,
  date: String,
  place: String,
  lat: String,
  lng: String
});

const Events = mongoose.model('Events', EventsSchema);

module.exports = Events;
