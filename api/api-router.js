const express = require('express');
const contactsRouter = require('./contacts/contacts-router')();

let routes = () => {
  let apiRouter = express.Router();

  apiRouter.use('/contacts', contactsRouter);

  apiRouter.get('/', (req, res) => {
    res.json({
      contacts: { links: `${req.protocol}://${req.headers.host}/api/contacts` }
    });
  });

  return apiRouter;
}

module.exports = routes;
