const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  priceRange: {
    type: String, // e.g. 'PKR 800–1,500 / head'
  },
  priceType: {
    type: String, // 'per_head' | 'flat'
  },
  priceMin: {
    type: Number,
  },
  priceMax: {
    type: Number,
  },
}, { timestamps: true });

vendorSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
