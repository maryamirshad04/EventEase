const Event = require('../models/Event');
const Expense = require('../models/Expense');

// @desc    Get all events for logged in user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id })
      .populate('guests')
      .sort({ datetime: 1 })
      .lean();

    const transformed = events.map(e => ({
      ...e,
      id: e._id,
      // Format datetime for frontend display
      date: e.datetime ? e.datetime.toISOString().split('T')[0] : '',
      time: e.datetime ? e.datetime.toTimeString().slice(0, 5) : '',
    }));

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // safer comparison
    if (String(event.user) !== String(req.user.id)) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const expenses = await Expense.find({ event: event._id });

    const transformedEvent = {
     ...event,
      id: event._id,
      date: event.datetime ? event.datetime.toISOString().split('T')[0] : '',
      time: event.datetime ? event.datetime.toTimeString().slice(0, 5) : '',
      expenses: expenses || []
    };

    res.json(transformedEvent);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { name, datetime, time, location, description, totalBudget, status, guests } = req.body;
if (!datetime) {
      return res.status(400).json({ message: 'Event date and time is required' });
    }
    const event = await Event.create({
      user: req.user.id,
      name,
      datetime: new Date(datetime),
      time,
      location,
      description,
      totalBudget: totalBudget || 0,
      status: status || 'upcoming',
      guests: guests || []
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

   if (updateData.datetime) {
      updateData.datetime = new Date(updateData.datetime);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    // Append expenses so the frontend receives complete data
    const expenses = await Expense.find({ event: updatedEvent._id });
    const eventData = updatedEvent.toJSON();
    eventData.expenses = expenses;

    res.json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete associated expenses
    await Expense.deleteMany({ event: req.params.id });
    await event.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add guest to event
// @route   POST /api/events/:id/guests
// @access  Private
const addGuest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    event.guests.push(req.body);
    await event.save();

    res.status(201).json(event.guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove guest from event
// @route   DELETE /api/events/:id/guests/:guestId
// @access  Private
const removeGuest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    event.guests = event.guests.filter((guest) => guest._id.toString() !== req.params.guestId);
    await event.save();

    res.json(event.guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget vs expenses
// @route   GET /api/events/:id/budget
// @access  Private
const getEventBudget = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const expenses = await Expense.find({ event: req.params.id });
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      totalBudget: event.totalBudget,
      totalExpenses,
      remainingBudget: event.totalBudget - totalExpenses,
      expensesByCategory: expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addGuest,
  removeGuest,
  getEventBudget
};
