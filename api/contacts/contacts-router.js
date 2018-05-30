const express = require('express');

let routes = () => {
  let contactsRouter = express.Router();

  contactsRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/contacts.json');
  });

  return contactsRouter;
}

module.exports = routes;
