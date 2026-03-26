import { createContext, useContext, useReducer, useEffect } from 'react'

const EventContext = createContext(null)

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':      return action.payload
    case 'ADD_EVENT': return [...state, { ...action.payload, id: generateId('evt'), expenses: [], guests: [], status: 'upcoming' }]
    case 'UPDATE_EVENT':   return state.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e)
    case 'DELETE_EVENT':   return state.filter(e => e.id !== action.payload)
    case 'ADD_GUEST':      return state.map(e => e.id === action.payload.eventId ? { ...e, guests: [...(e.guests||[]), { ...action.payload.guest, id: generateId('g') }] } : e)
    case 'REMOVE_GUEST':   return state.map(e => e.id === action.payload.eventId ? { ...e, guests: e.guests.filter(g => g.id !== action.payload.guestId) } : e)
    case 'ADD_EXPENSE':    return state.map(e => e.id === action.payload.eventId ? { ...e, expenses: [...(e.expenses||[]), { ...action.payload.expense, id: generateId('ex') }] } : e)
    case 'REMOVE_EXPENSE': return state.map(e => e.id === action.payload.eventId ? { ...e, expenses: e.expenses.filter(ex => ex.id !== action.payload.expenseId) } : e)
    default: return state
  }
}

export function EventProvider({ children, userId }) {
  const storageKey = userId ? `ee_events_${userId}` : null
  const [events, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    if (!storageKey) { dispatch({ type: 'LOAD', payload: [] }); return }
    try {
      const stored = localStorage.getItem(storageKey)
      dispatch({ type: 'LOAD', payload: stored ? JSON.parse(stored) : [] })
    } catch { dispatch({ type: 'LOAD', payload: [] }) }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(events))
  }, [events, storageKey])

  const addEvent      = d     => dispatch({ type: 'ADD_EVENT',     payload: d })
  const updateEvent   = d     => dispatch({ type: 'UPDATE_EVENT',  payload: d })
  const deleteEvent   = id    => dispatch({ type: 'DELETE_EVENT',  payload: id })
  const addGuest      = (eid,g)   => dispatch({ type: 'ADD_GUEST',    payload: { eventId:eid, guest:g } })
  const removeGuest   = (eid,gid) => dispatch({ type: 'REMOVE_GUEST', payload: { eventId:eid, guestId:gid } })
  const addExpense    = (eid,ex)  => dispatch({ type: 'ADD_EXPENSE',  payload: { eventId:eid, expense:ex } })
  const removeExpense = (eid,xid) => dispatch({ type: 'REMOVE_EXPENSE',payload:{ eventId:eid, expenseId:xid } })

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, addGuest, removeGuest, addExpense, removeExpense }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEventContext must be inside EventProvider')
  return ctx
}
