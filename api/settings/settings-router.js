const express = require('express');
const settingsModel = require('./settings-model');
const settingsController = require('./settings-controller')(settingsModel);

let routes = () => {
  let settingsRouter = express.Router();

  // settingsRouter.get('/', (req, res) => {
  //   res.sendFile(__dirname + '/settings.json');
  // });

  settingsRouter.route('/')
    .get((req, res) => {
      settingsController.readAll((err, objects) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(objects);
        }
      });
    });

  return settingsRouter;
}

module.exports = routes;
