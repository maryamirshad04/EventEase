const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  addGuest,
  removeGuest,
  getEventBudget,
    updateCategoryBudget 
} = require('../controllers/eventController');
const { getExpenses, addExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .get(protect, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.route('/:id/guests')
  .post(protect, addGuest);

router.route('/:id/guests/:guestId')
  .delete(protect, removeGuest);

router.route('/:id/budget')
  .get(protect, getEventBudget);

router.route('/:id/category-budget')
  .put(protect, updateCategoryBudget);

router.route('/:eventId/expenses')
  .get(protect, getExpenses)
  .post(protect, addExpense);

module.exports = router;
