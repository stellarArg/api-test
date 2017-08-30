
const express = require('express');
const router = express.Router();

const CrudController = require('../../controllers/crud-controller');
const CrudService = require('../../services/crud-service');

const Model = require('../../models/segment');

const controller = new CrudController(new CrudService(Model));

router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id', controller.patch.bind(controller));
router.delete('/:id', controller.delete.bind(controller));


module.exports = router;
