const Vendor = require('../models/Vendor');

const getVendors = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {
      $or: [
        { user: req.user.id },  
        { isDefault: true }       
      ]
    };

    if (category) {
      query.category = category;
    }

    const vendors = await Vendor.find(query);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    if (vendor.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createVendor = async (req, res) => {
  try {
    const { name, category, description, phone, email, priceRange, priceType, priceMin, priceMax } = req.body;
    
    const vendor = await Vendor.create({
      name,
      category,
      description,
      phone,
      email,
      priceRange,
      priceType,
      priceMin,
      priceMax,
      user: req.user.id 
    });
    
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor.isDefault) {
  return res.status(403).json({ message: 'Cannot modify default vendor' });
}
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
        if (vendor.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor.isDefault) {
  return res.status(403).json({ message: 'Cannot modify default vendor' });
}
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    if (vendor.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await vendor.deleteOne();
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,  
  updateVendor,
  deleteVendor   
};