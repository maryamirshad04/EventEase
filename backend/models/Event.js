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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  datetime: {
  type: Date,
  required: true,
},
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  totalBudget: {
    type: Number,
    required: true,
    default: 0,
  },
  guests: [guestSchema],
  status: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming',
  },
}, { timestamps: true });

//virtual to transform _id to id for the frontend
eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Event', eventSchema);
