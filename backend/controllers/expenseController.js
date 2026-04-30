const Expense = require('../models/Expense');
const Event = require('../models/Event');

const getExpenses = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const expenses = await Expense.find({ event: req.params.eventId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
        console.log("BODY RECEIVED:", req.body); 

    const expense = await Expense.create({
      event: req.params.eventId,
      name: req.body.name,
      amount: req.body.amount,
      category: req.body.category,
      type: req.body.type,
      vendorId: req.body.vendorId || null,
      vendorName: req.body.vendorName || null,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    const event = await Event.findById(expense.event);
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const event = await Event.findById(expense.event);
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await expense.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
};
