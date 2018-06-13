const express = require('express');
const eventsModel = require('./events-model');
const eventsController = require('./events-controller')(eventsModel);

let routes = () => {
  let eventsRouter = express.Router();

  eventsRouter.route('/')
    .get((req, res) => {
      eventsController.readAll((err, objects) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(objects);
        }
      });
    });

  return eventsRouter;
}

module.exports = routes;
