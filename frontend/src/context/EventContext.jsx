import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const EventContext = createContext(null)

export function EventProvider({ children }) { 
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [eventLoading, setEventLoading] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/events')
      setEvents(res.data || [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
      throw err 
    } finally {
      setLoading(false)
    }
  }, []) 

  const fetchEventById = useCallback(async (eventId) => {
    if (!eventId) return null
    
    try {
      setEventLoading(true)
      const res = await api.get(`/events/${eventId}`)
      const fullEvent = res.data
      setCurrentEvent(fullEvent)
      
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
  }, [])

  const getEvent = (eventId) => {
    return events.find(e => e.id === eventId) || null
  }

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const addEvent = async (eventData) => {
    try {
      const res = await api.post('/events', eventData)
      const newEvent = res.data

      const formattedEvent = {
        ...newEvent,
        id: newEvent.id || newEvent._id,
        date: newEvent.datetime ? newEvent.datetime.split('T')[0] : '',
        time: newEvent.datetime ? newEvent.datetime.split('T')[1]?.slice(0, 5) : '',
      }
      
      setEvents(prev => [...prev, formattedEvent])
      return formattedEvent
    } catch (err) {
      console.error('Add event error:', err.response?.data || err.message)
      throw err
    }
  }

  const updateEvent = async (eventData) => {
    try {
      const res = await api.put(`/events/${eventData.id}`, eventData)
      const updatedEvent = res.data    
      const formattedEvent = {
        ...updatedEvent,
        id: updatedEvent.id || updatedEvent._id,
        date: updatedEvent.datetime ? updatedEvent.datetime.split('T')[0] : '',
        time: updatedEvent.datetime ? updatedEvent.datetime.split('T')[1]?.slice(0, 5) : '',
      }
      
      setEvents(prev => prev.map(e => e.id === formattedEvent.id ? formattedEvent : e))
      if (currentEvent?.id === formattedEvent.id) {
        setCurrentEvent(formattedEvent)
      }
      return formattedEvent
    } catch (err) {
      console.error('Update event error:', err.response?.data || err.message)
      throw err
    }
  }

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
      if (currentEvent?.id === id) {
        setCurrentEvent(null)
      }
    } catch (err) {
      console.error('Delete event error:', err.response?.data || err.message)
      throw err
    }
  }

  const addGuest = async (eventId, guestData) => {
    try {
      const res = await api.post(`/events/${eventId}/guests`, guestData)
      const updatedGuests = res.data
      
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, guests: updatedGuests } : e
      ))
      if (currentEvent?.id === eventId) {
        setCurrentEvent(prev => ({ ...prev, guests: updatedGuests }))
      }
      return updatedGuests
    } catch (err) {
      console.error('Add guest error:', err.response?.data || err.message)
      throw err
    }
  }

  const removeGuest = async (eventId, guestId) => {
    try {
      const res = await api.delete(`/events/${eventId}/guests/${guestId}`)
      const updatedGuests = res.data
      
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, guests: updatedGuests } : e
      ))
      if (currentEvent?.id === eventId) {
        setCurrentEvent(prev => ({ ...prev, guests: updatedGuests }))
      }
    } catch (err) {
      console.error('Remove guest error:', err.response?.data || err.message)
      throw err
    }
  }

  const addExpense = async (eventId, expenseData) => {
    try {
      const res = await api.post(`/events/${eventId}/expenses`, expenseData)
      await fetchEventById(eventId)
      return res.data
    } catch (err) {
      console.error('Add expense error:', err.response?.data || err.message)
      throw err
    }
  }

  const removeExpense = async (eventId, expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`)
      await fetchEventById(eventId)
    } catch (err) {
      console.error('Remove expense error:', err.response?.data || err.message)
      throw err
    }
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