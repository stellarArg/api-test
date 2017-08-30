
const express = require('express');
const router = express.Router();

const
  usersRouter = require('./users-router'),
  segmentsRouter = require('./segments-router');


router.use('/users', usersRouter);
router.use('/segments', segmentsRouter);


module.exports = router;
