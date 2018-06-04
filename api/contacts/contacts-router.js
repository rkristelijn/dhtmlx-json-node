const express = require('express');
const Contacts = require('./contacts-model');
const contactsController = require('./contacts-controller')(Contacts);
const hardCodedValues = false;

let routes = () => {
  let contactsRouter = express.Router();

  contactsRouter.get('/', (req, res) => {
    if (hardCodedValues) {
      res.sendFile(__dirname + '/contacts.json');
    } else {
      contactsController.readAll((err, contacts) => {
        if (err) {
          res.sendStatus(400).send(err);
        } else {
          res.json(contacts);
        }
      });
    }
  });

  return contactsRouter;
}

module.exports = routes;
