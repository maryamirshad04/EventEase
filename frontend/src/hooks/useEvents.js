import { useEventContext } from '../context/EventContext'

export function useEvents() {
  const { 
    events, 
    loading, 
    currentEvent,
    eventLoading,
    fetchEvents,
    fetchEventById,
    getEvent,
    addEvent, 
    updateEvent, 
    deleteEvent, 
    addGuest, 
    removeGuest, 
    addExpense, 
    removeExpense 
  } = useEventContext()

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const pastEvents = events.filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const nextEvent = upcomingEvents[0] || null

  const totalGuests = events.reduce((sum, e) => sum + (e.guests?.length || 0), 0)
  const totalBudget = events.reduce((sum, e) => sum + Number(e.totalBudget || 0), 0)

  return {
    events,
    loading,
    currentEvent,
    eventLoading,
    fetchEvents,
    fetchEventById,
    getEvent,
    upcomingEvents,
    pastEvents,
    nextEvent,
    totalGuests,
    totalBudget,
    addEvent,
    updateEvent,
    deleteEvent,
    addGuest,
    removeGuest,
    addExpense,
    removeExpense,
  }
}