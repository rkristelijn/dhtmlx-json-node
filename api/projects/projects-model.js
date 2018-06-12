const mongoose = require('mongoose');

const ProjectsSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  due: String,
  project: String,
  status: String,
  assign: String,
  info: String
});

const Projects = mongoose.model('Projects', ProjectsSchema);

module.exports = Projects;
