import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Sidebar from '../components/layout/Sidebar'
import BudgetTracker from '../components/event/BudgetTracker'
import GuestList from '../components/event/GuestList'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useEvents } from '../hooks/useEvents'
import { formatDate, formatTime, daysUntil } from '../utils/formatDate'

function getInitials(name = '') {
  if (!name) return '??'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchEventById, addGuest, removeGuest, addExpense, removeExpense, deleteEvent } = useEvents()
  const [event, setEvent] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch full event data on mount
  useEffect(() => {
    async function loadEvent() {
      if (id) {
        setLoading(true)
        const fullEvent = await fetchEventById(id)
        setEvent(fullEvent)
        setLoading(false)
      }
    }
    loadEvent()
  }, [id, fetchEventById])

  // Only show loading spinner on initial load
  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-champagne rounded mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-champagne/50 rounded mx-auto"></div>
          </div>
          <p className="font-display text-xl text-maroon mb-4 mt-8">Loading event details...</p>
        </div>
      </PageWrapper>
    )
  }

  if (!event) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-burgundy/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-burgundy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="font-display text-xl text-maroon mb-4">Event not found</p>
          <p className="text-textLight text-sm mb-6">The event you're looking for doesn't exist or has been deleted.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-wine transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const { 
    name = 'Untitled Event', 
    date = '', 
    time = '', 
    location = 'Location TBD', 
    description = '', 
    guests = [], 
    status = 'upcoming',
    totalBudget = 0,
    expenses = []
  } = event

  const days = date ? daysUntil(date) : null
  const isUpcoming = status === 'upcoming'

  async function handleDelete() {
    if (id) {
      await deleteEvent(id)
      navigate('/dashboard')
    }
  }

  // Optimistic update for adding expense
  async function handleAddExpense(expenseData) {
    // Generate temporary ID for optimistic update
    const tempId = `temp_${Date.now()}`
    const optimisticExpense = { ...expenseData, id: tempId }
    
    // Update UI immediately
    setEvent(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), optimisticExpense]
    }))
    
    try {
      // Make actual API call
      const newExpense = await addExpense(id, expenseData)
      
      // Replace temp expense with real one
      setEvent(prev => ({
        ...prev,
        expenses: prev.expenses.map(exp => 
          exp.id === tempId ? newExpense : exp
        )
      }))
    } catch (error) {
      // If failed, remove the optimistic expense
      setEvent(prev => ({
        ...prev,
        expenses: prev.expenses.filter(exp => exp.id !== tempId)
      }))
      console.error('Failed to add expense:', error)
      alert('Failed to add expense. Please try again.')
    }
  }

  // Optimistic update for removing expense
  async function handleRemoveExpense(expenseId) {
    // Store the expense being removed for potential rollback
    const removedExpense = event.expenses?.find(exp => exp.id === expenseId)
    
    // Update UI immediately
    setEvent(prev => ({
      ...prev,
      expenses: (prev.expenses || []).filter(exp => exp.id !== expenseId)
    }))
    
    try {
      await removeExpense(id, expenseId)
    } catch (error) {
      // Rollback on failure
      setEvent(prev => ({
        ...prev,
        expenses: [...(prev.expenses || []), removedExpense]
      }))
      console.error('Failed to remove expense:', error)
      alert('Failed to remove expense. Please try again.')
    }
  }

  // // Optimistic update for adding guest
  // async function handleAddGuest(guestData) {
  //   const tempId = `temp_${Date.now()}`
  //   const optimisticGuest = { ...guestData, id: tempId }
  //     console.log('Optimistic guest:', optimisticGuest) // Debug

  //   // Update UI immediately
  //   setEvent(prev => ({
  //     ...prev,
  //     guests: [...(prev.guests || []), optimisticGuest]
  //   }))
    
  //   try {
  //     const newGuest = await addGuest(id, guestData)
  //         console.log('API returned guest:', newGuest) // Debug - check what this returns

  //     // Replace temp guest with real one
  //     setEvent(prev => ({
  //       ...prev,
  //       guests: prev.guests.map(guest => 
  //         guest.id === tempId ? newGuest : guest
  //       )
  //     }))
  //   } catch (error) {
  //     // Rollback on failure
  //     setEvent(prev => ({
  //       ...prev,
  //       guests: prev.guests.filter(guest => guest.id !== tempId)
  //     }))
  //     console.error('Failed to add guest:', error)
  //     alert('Failed to add guest. Please try again.')
  //   }
  // }
async function handleAddGuest(guestData) {
  try {
    const updatedGuests = await addGuest(id, guestData)

    setEvent(prev => ({
      ...prev,
      guests: updatedGuests
    }))
  } catch (error) {
    console.error('Failed to add guest:', error)
  }
}
  // Optimistic update for removing guest
  async function handleRemoveGuest(guestId) {
    const removedGuest = event.guests?.find(guest => guest.id === guestId)
    
    // Update UI immediately
    setEvent(prev => ({
      ...prev,
      guests: (prev.guests || []).filter(guest => guest.id !== guestId)
    }))
    
    try {
      await removeGuest(id, guestId)
    } catch (error) {
      // Rollback on failure
      setEvent(prev => ({
        ...prev,
        guests: [...(prev.guests || []), removedGuest]
      }))
      console.error('Failed to remove guest:', error)
      alert('Failed to remove guest. Please try again.')
    }
  }

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-textLight hover:text-maroon text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        All Events
      </button>

      {/* Page header */}
      <div className="bg-offWhite border border-border rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Wine accent bar */}
        <div className={`h-1.5 w-full ${isUpcoming ? 'bg-gradient-to-r from-wine via-caramel to-sandGold' : 'bg-border'}`} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge 
                  label={isUpcoming ? 'Upcoming' : 'Past'} 
                  color={isUpcoming ? 'upcoming' : 'past'} 
                />
                {isUpcoming && days !== null && days >= 0 && (
                  <span className="text-xs font-semibold text-caramel bg-caramel/10 px-2.5 py-1 rounded-full">
                    {days === 0 ? 'Today!' : `${days} days away`}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon leading-tight mb-4">
                {name}
              </h1>
              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-sm text-textMid">
                  <div className="w-8 h-8 rounded-lg bg-wine/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-wine" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-textDark">{date ? formatDate(date) : 'Date TBD'}</p>
                    <p className="text-xs text-textLight">{time ? formatTime(time) : 'Time TBD'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-textMid">
                  <div className="w-8 h-8 rounded-lg bg-caramel/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-caramel" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-textDark truncate">{location}</p>
                    <p className="text-xs text-textLight">Venue</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-textMid">
                  <div className="w-8 h-8 rounded-lg bg-olive/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-olive" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-textDark">{guests?.length || 0} Guests</p>
                    <p className="text-xs text-textLight">Invited</p>
                  </div>
                </div>
              </div>

              {description && (
                <p className="mt-4 text-sm text-textMid leading-relaxed border-l-4 border-champagne pl-3">
                  {description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <Link to={`/events/${id}/edit`}>
                <Button variant="secondary" size="sm" fullWidth>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </Button>
              </Link>
              <Link to={`/events/${id}/invite`}>
                <Button variant="outline" size="sm" fullWidth>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Invite
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setDeleteModal(true)}>
                <svg className="w-3.5 h-3.5 text-burgundy" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-burgundy">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Guest list */}
        <div className="flex-1 min-w-0">
          <div className="bg-offWhite border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-maroon">
                Guest List
              </h2>
              <span className="text-xs text-textLight bg-champagne px-2.5 py-1 rounded-full">
                {guests?.length || 0} invited
              </span>
            </div>

            {/* Guest avatars strip */}
            {guests?.length > 0 && (
              <div className="px-6 py-3 border-b border-border/50 flex items-center gap-1 flex-wrap">
                {guests.slice(0, 8).map((g, i) => (
                  <div
                    key={g?.id || i}
                    title={g?.name || 'Guest'}
                    className="w-8 h-8 rounded-full bg-wine/15 flex items-center justify-center text-xs font-semibold text-wine border-2 border-offWhite -ml-1 first:ml-0"
                    style={{ zIndex: guests.length - i }}
                  >
                    {getInitials(g?.name)}
                  </div>
                ))}
                {guests.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-champagne flex items-center justify-center text-xs font-medium text-textMid border-2 border-offWhite -ml-1">
                    +{guests.length - 8}
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <GuestList
                guests={guests || []}
                onAdd={handleAddGuest}
                onRemove={handleRemoveGuest}
              />
            </div>
          </div>
        </div>

        {/* Right: Budget sidebar */}
        <Sidebar>
          <BudgetTracker
            event={{
              ...event,
              totalBudget: totalBudget || 0,
              expenses: expenses || []
            }}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
          />
        </Sidebar>
      </div>

      {/* Delete confirm modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Event"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete Event</Button>
          </>
        }
      >
        <p className="text-sm text-textMid leading-relaxed">
          Are you sure you want to delete <strong className="text-maroon">{name}</strong>?
          This action cannot be undone and all guest and expense data will be lost.
        </p>
      </Modal>
    </PageWrapper>
  )
}