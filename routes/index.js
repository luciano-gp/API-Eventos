const router = require('express').Router();
const events = require('./events');

router.use(events);

module.exports = router;