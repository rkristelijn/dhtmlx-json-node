const express = require('express');
const Contacts = require('./contacts-model');
const contactsController = require('./contacts-controller')(Contacts);
const hardCodedValues = false;

let routes = () => {
  let contactsRouter = express.Router();

  contactsRouter.get('/', (req, res) => {
    contactsController.readAll((err, contacts) => {
      if (err) {
        res.sendStatus(400).send(err);
      } else {
        res.json(contacts);
      }
    });

  });

  contactsRouter.put('/:id', (req, res) => {
    console.log('putting...', req.params.id);
    contactsController.updateOne(req.params.id, req.data, (err, contact) => {
      if (err) {
        res.sendStatus(400).send(err);
      } else {
        res.json(contact);
      }
    });
  });

  return contactsRouter;
}

module.exports = routes;
