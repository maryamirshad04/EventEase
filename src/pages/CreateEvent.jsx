import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import EventForm from '../components/event/EventForm'
import { useEvents } from '../hooks/useEvents'

export default function CreateEvent() {
  const navigate = useNavigate()
  const { addEvent } = useEvents()

  function handleSubmit(data) {
    addEvent(data)
    navigate('/dashboard')
  }

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="mb-8">
  <div className="flex items-center justify-between mb-6">
    <button
    onClick={() => navigate('/dashboard')}
    className="flex items-center gap-1.5 text-sm mb-5 px-3 py-1.5 rounded-lg bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 transition-all duration-200 w-fit"
  >
    <svg className="w-4 h-4 text-maroon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
    <span className="text-maroon font-medium">Back to Dashboard</span>
  </button>
    
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-sandGold/40"></div>
      <div className="w-8 h-px bg-sandGold/30"></div>
      <span className="text-xs text-textLight">Step 1 of 3</span>
    </div>
  </div>
  
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-wine/5 to-transparent rounded-2xl"></div>
    <div className="relative p-6 rounded-2xl border border-sandGold/20 bg-offWhite/30 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-wine to-maroon flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-offWhite" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon mb-1">Create New Event</h1>
          <p className="text-textMid text-sm">Fill in the details to plan your event</p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Ornamental divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sandGold text-lg">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-offWhite border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <EventForm onSubmit={handleSubmit} onCancel={() => navigate('/dashboard')} />
      </div>
    </PageWrapper>
  )
}
