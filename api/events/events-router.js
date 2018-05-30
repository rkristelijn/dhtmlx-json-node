const express = require('express');

let routes = () => {
  let eventsRouter = express.Router();

  eventsRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/events.json');
  });

  return eventsRouter;
}

module.exports = routes;
