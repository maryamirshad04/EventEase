const express = require('express');
const router = express.Router();
const { getVendors, getVendorById } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getVendors);

router.route('/:id')
  .get(protect, getVendorById);

module.exports = router;
