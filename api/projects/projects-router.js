const express = require('express');
const projectsModel = require('./projects-model');
const projectsController = require('./projects-controller')(projectsModel);
const salesModel = require('../sales/sales-model');
const salesController = require('../sales/sales-controller')(salesModel);

let routes = () => {
  let projectsRouter = express.Router();

  projectsRouter.route('/')
    .get((req, res) => {
      projectsController.readAll((err, objects) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(objects);
        }
      });
    })
    .post((req, res) => {
      projectsController.createOne(req.body, (err, object) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(object);
        }
      });
    });

  projectsRouter.route('/:id')
    .put((req, res) => {
      projectsController.updateOne(req.params.id, req.body, (err, object) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(object);
        }
      });
    })
    .delete((req, res) => {
      projectsController.deleteOne(req.params.id, (err) => {
        if (err) {
          res.sendStatus(400).end(err);
        } else {
          res.sendStatus(204).end(req.params.id + " removed");
        }
      });
    });

  projectsRouter.route('/sales/:name')
    .get((req, res) => {
      salesController.findByParent(req.params.name, 'project', (err, items) => {
        if(err) {
          res.sendStatus(400).end(err);
        } else {
          res.json(items);
        }
      });
    });

  return projectsRouter;
}

module.exports = routes;
