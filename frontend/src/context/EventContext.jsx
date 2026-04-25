import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const EventContext = createContext(null)

export function EventProvider({ children, userId }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [eventLoading, setEventLoading] = useState(false)

  // Fetch all events (basic info, no expenses)
  const fetchEvents = useCallback(async () => {
    if (!userId) {
      setEvents([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await api.get('/events')
      setEvents(res.data || [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Fetch a single event with FULL data (including expenses)
  const fetchEventById = useCallback(async (eventId) => {
    if (!userId || !eventId) return null
    try {
      setEventLoading(true)
      const res = await api.get(`/events/${eventId}`)
      const fullEvent = res.data
      setCurrentEvent(fullEvent)
      
      // Also update the event in the events array
      setEvents(prev => prev.map(e => 
        e.id === fullEvent.id ? fullEvent : e
      ))
      
      return fullEvent
    } catch (err) {
      console.error('Failed to fetch event:', err)
      return null
    } finally {
      setEventLoading(false)
    }
  }, [userId])

  // Get event from local state (might not have expenses)
  const getEvent = (eventId) => {
    return events.find(e => e.id === eventId) || null
  }

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const addEvent = async (eventData) => {
    const res = await api.post('/events', eventData)
    setEvents(prev => [...prev, res.data])
    return res.data
  }

  const updateEvent = async (eventData) => {
    const res = await api.put(`/events/${eventData.id}`, eventData)
    setEvents(prev => prev.map(e => e.id === res.data.id ? res.data : e))
    if (currentEvent?.id === res.data.id) {
      setCurrentEvent(res.data)
    }
    return res.data
  }

  const deleteEvent = async (id) => {
    await api.delete(`/events/${id}`)
    setEvents(prev => prev.filter(e => e.id !== id))
    if (currentEvent?.id === id) {
      setCurrentEvent(null)
    }
  }

  const addGuest = async (eventId, guestData) => {
    const res = await api.post(`/events/${eventId}/guests`, guestData)
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, guests: res.data } : e))
    if (currentEvent?.id === eventId) {
      setCurrentEvent(prev => ({ ...prev, guests: res.data }))
    }
    return res.data
  }

  const removeGuest = async (eventId, guestId) => {
    const res = await api.delete(`/events/${eventId}/guests/${guestId}`)
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, guests: res.data } : e))
    if (currentEvent?.id === eventId) {
      setCurrentEvent(prev => ({ ...prev, guests: res.data }))
    }
  }

  const addExpense = async (eventId, expenseData) => {
    const res = await api.post(`/events/${eventId}/expenses`, expenseData)
    // Refresh the event to get updated expenses
    await fetchEventById(eventId)
    return res.data
  }

  const removeExpense = async (eventId, expenseId) => {
    await api.delete(`/expenses/${expenseId}`)
    // Refresh the event to get updated expenses
    await fetchEventById(eventId)
  }

  return (
    <EventContext.Provider value={{ 
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
    }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEventContext must be inside EventProvider')
  return ctx
}