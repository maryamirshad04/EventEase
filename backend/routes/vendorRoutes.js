const express = require('express');
const router = express.Router();
const { 
  getVendors, 
  getVendorById, 
  createVendor,    
  updateVendor,   
  deleteVendor    
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getVendors)
  .post(protect, createVendor);

router.route('/:id')
  .get(protect, getVendorById)
  .put(protect, updateVendor)   
  .delete(protect, deleteVendor); 

module.exports = router;