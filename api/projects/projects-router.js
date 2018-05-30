const express = require('express');

let routes = () => {
  let projectsRouter = express.Router();

  projectsRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/projects.json');
  });

  return projectsRouter;
}

module.exports = routes;
