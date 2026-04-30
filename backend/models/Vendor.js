const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {                       
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
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
    type: String,
  },
  priceType: {
    type: String,
    enum: ['per_head', 'flat'],
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