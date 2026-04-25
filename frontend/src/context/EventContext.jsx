import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const EventContext = createContext(null)

export function EventProvider({ children, userId }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

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
    return res.data
  }

  const deleteEvent = async (id) => {
    await api.delete(`/events/${id}`)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const addGuest = async (eventId, guestData) => {
    const res = await api.post(`/events/${eventId}/guests`, guestData)
    // Update the local event state with the new guests array
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, guests: res.data } : e))
    return res.data
  }

  const removeGuest = async (eventId, guestId) => {
    const res = await api.delete(`/events/${eventId}/guests/${guestId}`)
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, guests: res.data } : e))
  }

  const addExpense = async (eventId, expenseData) => {
    const res = await api.post(`/events/${eventId}/expenses`, expenseData)
    // The backend returns the single expense, so we append it to the event's expenses
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, expenses: [...(e.expenses || []), res.data] }
      }
      return e
    }))
    return res.data
  }

  const removeExpense = async (eventId, expenseId) => {
    await api.delete(`/expenses/${expenseId}`)
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, expenses: (e.expenses || []).filter(ex => ex.id !== expenseId) }
      }
      return e
    }))
  }

  return (
    <EventContext.Provider value={{ 
      events, loading, fetchEvents,
      addEvent, updateEvent, deleteEvent, 
      addGuest, removeGuest, 
      addExpense, removeExpense 
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
