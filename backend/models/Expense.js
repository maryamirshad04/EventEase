const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Venue', 'Food', 'Decor', 'Photography', 'Miscellaneous', 'Entertainment', 'Florist'],
    required: true,
  },
}, { timestamps: true });

expenseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
