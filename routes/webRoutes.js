const express = require('express');

const router = express.Router();

const homeController = require('../controller/web/homeController');

router.get('/', homeController.home);


module.exports = router;