const Vendor = require('../models/Vendor');

// @desc    Get all vendors (with optional category filter)
// @route   GET /api/vendors
// @access  Public
const getVendors = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const vendors = await Vendor.find(query);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById
};
