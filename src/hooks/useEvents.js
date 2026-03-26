import { useEventContext } from '../context/EventContext'

export function useEvents() {
  const { events, addEvent, updateEvent, deleteEvent, addGuest, removeGuest, addExpense, removeExpense } = useEventContext()

  const getEvent = (id) => events.find(e => e.id === id) || null

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const pastEvents = events.filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const nextEvent = upcomingEvents[0] || null

  const totalGuests = events.reduce((sum, e) => sum + (e.guests?.length || 0), 0)
  const totalBudget = events.reduce((sum, e) => sum + Number(e.totalBudget || 0), 0)

  return {
    events, upcomingEvents, pastEvents, nextEvent,
    totalGuests, totalBudget,
    getEvent, addEvent, updateEvent, deleteEvent,
    addGuest, removeGuest, addExpense, removeExpense,
  }
}
