const express = require('express');
const Contacts = require('./contacts-model');
const contactsController = require('./contacts-controller')(Contacts);
const hardCodedValues = false;

let routes = () => {
  let contactsRouter = express.Router();

  contactsRouter.get('/', (req, res) => {
    contactsController.readAll((err, contacts) => {
      if (err) {
        res.sendStatus(400).end(err);
      } else {
        res.json(contacts);
      }
    });
  });

  contactsRouter.put('/:id', (req, res) => {
    contactsController.updateOne(req.params.id, req.body, (err, contact) => {
      if (err) {
        res.sendStatus(400).end(err);
      } else {
        res.json(contact);
      }
    });
  });

  contactsRouter.post('/', (req, res) => {
    contactsController.createOne(req.body, (err, contact) => {
      if (err) {
        res.sendStatus(400).end(err);
      } else {
        res.sendStatus(201).json(contact);
      }
    });
  });

  contactsRouter.delete('/:id', (req, res) => {
    contactsController.deleteOne(req.params.id, (err) => {
      if (err) {
        res.sendStatus(400).end(err);
      } else {
        res.sendStatus(204).end(req.params.id + " removed");
      }
    });
  });

  return contactsRouter;
}

module.exports = routes;
