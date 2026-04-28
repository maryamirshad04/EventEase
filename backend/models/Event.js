const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
});
guestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  datetime: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  totalBudget: { type: Number, required: true, default: 0 },
  
  categoryBudgets: {
    Food: { type: Number, default: 0 },
    Decor: { type: Number, default: 0 },
    Venue: { type: Number, default: 0 },
    Photography: { type: Number, default: 0 },
    Entertainment: { type: Number, default: 0 },
    Florist: { type: Number, default: 0 },
    Miscellaneous: { type: Number, default: 0 }
  },
  
  guests: [guestSchema],
  status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
}, { timestamps: true });

eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Event', eventSchema);
