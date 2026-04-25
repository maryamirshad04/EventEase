import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import EventForm from '../components/event/EventForm'
import { useEvents } from '../hooks/useEvents'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, updateEvent } = useEvents()
  const event = getEvent(id)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!event) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="font-display text-xl text-maroon mb-4">Event not found</p>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-caramel hover:text-wine underline">
            Back to Dashboard
          </button>
        </div>
      </PageWrapper>
    )
  }

  async function handleSubmit(data) {
    setIsSubmitting(true)
    try {
      await updateEvent({ ...data, id })
      navigate(`/events/${id}`)
    } catch (error) {
      console.error('Failed to update event:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-1.5 text-textLight hover:text-maroon text-sm mb-4 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Event
        </button>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-caramel rounded-full" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon">Edit Event</h1>
        </div>
        <p className="text-textMid text-sm ml-4 truncate">{event.name}</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sandGold text-lg">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-offWhite border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/events/${id}`)}
        />
      </div>
    </PageWrapper>
  )
}
