const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const IndexController = require('../controllers/index');

// Welcome Page
router.get('/', forwardAuthenticated, IndexController.index_get_index);

// Dashboard
router.get('/dashboard', ensureAuthenticated, IndexController.index_get_dashboard);

module.exports = router;
