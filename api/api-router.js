const express = require('express');
const contactsRouter = require('./contacts/contacts-router')();
const projectsRouter = require('./projects/projects-router')();
const settingsRouter = require('./settings/settings-router')();
const eventsRouter = require('./events/events-router')();

let routes = () => {
  let apiRouter = express.Router();

  apiRouter.use('/contacts', contactsRouter);
  apiRouter.use('/projects', projectsRouter);
  apiRouter.use('/settings', settingsRouter);
  apiRouter.use('/events', eventsRouter);

  apiRouter.get('/', (req, res) => {
    res.json({
      contacts: { links: `${req.protocol}://${req.headers.host}/api/contacts` },
      projects: { links: `${req.protocol}://${req.headers.host}/api/projects` },
      settings: { links: `${req.protocol}://${req.headers.host}/api/settings` },
      events: { links: `${req.protocol}://${req.headers.host}/api/events` }
    });
  });

  return apiRouter;
}

module.exports = routes;
