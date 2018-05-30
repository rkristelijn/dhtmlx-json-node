const express = require('express');

let routes = () => {
  let settingsRouter = express.Router();

  settingsRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/settings.json');
  });

  return settingsRouter;
}

module.exports = routes;
