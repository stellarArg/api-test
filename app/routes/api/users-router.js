
const express = require('express');
const router = express.Router();

const UsersController = require('../../controllers/users-controller');


router.get('/noop', UsersController.noop);


module.exports = router;
