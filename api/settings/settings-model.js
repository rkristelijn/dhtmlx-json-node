const mongoose = require('mongoose');

const SettingsSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: String,
  image: String,
  title: String,
  descr: String
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
