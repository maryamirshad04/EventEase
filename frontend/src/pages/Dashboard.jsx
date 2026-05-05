import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import StatsBar from '../components/dashboard/StatsBar'
import EventCard from '../components/dashboard/EventCard'
import Button from '../components/ui/Button'
import { useEvents } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { formatDate, formatTime, daysUntil } from '../utils/formatDate'
import { SparklesIcon } from "@heroicons/react/24/solid";
function EmptyState() {
  return (
    <div className="animate-fade-in">
      {/* Hero Image Section */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <img
          src="/assets/download.jfif"
          alt="Start planning your first event"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/50 via-maroon/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-offWhite mb-2">
            Let's plan your first event
          </h2>
          <p className="text-champagne/90 text-sm max-w-md mx-auto">
            Every celebration starts with a single step. Let's create something memorable together.
          </p>
        </div>
      </div>

      {/* Main CTA Button */}
      <div className="text-center mb-12">
        <Link to="/events/new">
          <Button variant="primary" size="lg" className="px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Your First Event
          </Button>
        </Link>
      </div>

      {/* Guided Steps */}
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-sm text-wine mb-6 font-medium">
          <span className="inline-block px-4 py-1.5 rounded-full border border-sandGold/30 bg-offWhite/30">
            Follow these simple steps to get started:
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 - Event Details */}
          <div className="bg-offWhite rounded-xl p-5 border border-border hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center mb-4 group-hover:bg-wine/20 transition-colors">
              <svg className="w-6 h-6 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-maroon mb-2">Add event details</h3>
            <p className="text-textLight text-sm leading-relaxed">
              Name your event, set the date and time - give your celebration an identity.
            </p>
            <div className="mt-3 text-xs text-sandGold font-medium flex items-center gap-1">
              <span>Step 1 of 3</span>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Step 2 - Location */}
          <div className="bg-offWhite rounded-xl p-5 border border-border hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center mb-4 group-hover:bg-wine/20 transition-colors">
              <svg className="w-6 h-6 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-maroon mb-2">Choose location</h3>
            <p className="text-textLight text-sm leading-relaxed">
              Select the perfect venue — whether it's a hall, home, or outdoor space.
            </p>
            <div className="mt-3 text-xs text-sandGold font-medium flex items-center gap-1">
              <span>Step 2 of 3</span>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Step 3 - Invite Guests */}
          <div className="bg-offWhite rounded-xl p-5 border border-border hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center mb-4 group-hover:bg-wine/20 transition-colors">
              <svg className="w-6 h-6 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-maroon mb-2">Invite guests</h3>
            <p className="text-textLight text-sm leading-relaxed">
              Add your guest list and send beautiful invitations to your loved ones.
            </p>
            <div className="mt-3 text-xs text-sandGold font-medium flex items-center gap-1">
              <span>Step 3 of 3</span>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 text-center">
          <div className="relative max-w-md mx-auto">
            {/* Top border with decorative ends */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-sandGold"></div>
              <div className="w-2 h-2 rotate-45 bg-sandGold/60"></div>
              <div className="w-24 h-px bg-sandGold/40"></div>
              <div className="w-2 h-2 rotate-45 bg-sandGold/60"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-sandGold"></div>
            </div>

            {/* Main content */}
            <div className="py-4 px-6">
              <div className="inline-flex items-center gap-3 text-xs text-wine bg-offWhite/50 px-4 py-2 rounded-full border border-sandGold/20">
                <svg className="w-3 h-3 text-sandGold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">Ready to begin?</span>
                <svg className="w-3 h-3 text-sandGold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Bottom border with decorative ends */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-sandGold"></div>
              <div className="w-2 h-2 rotate-45 bg-sandGold/60"></div>
              <div className="w-24 h-px bg-sandGold/40"></div>
              <div className="w-2 h-2 rotate-45 bg-sandGold/60"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-sandGold"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroBanner({ event }) {
  if (!event) return null
  const days = daysUntil(event.date)
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-wine via-maroon to-burgundy" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4A849' stroke-width='0.5'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3Cpath d='M30 10 L30 50 M10 30 L50 30'/%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="absolute top-4 left-4 w-8 h-8 opacity-40" style={{ borderTop: '2px solid #D4A849', borderLeft: '2px solid #D4A849' }} />
      <div className="absolute top-4 right-4 w-8 h-8 opacity-40" style={{ borderTop: '2px solid #D4A849', borderRight: '2px solid #D4A849' }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 opacity-40" style={{ borderBottom: '2px solid #D4A849', borderLeft: '2px solid #D4A849' }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 opacity-40" style={{ borderBottom: '2px solid #D4A849', borderRight: '2px solid #D4A849' }} />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-champagne/70 text-xs uppercase tracking-widest mb-2 font-medium">Next Upcoming Event</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-offWhite mb-3 leading-tight">{event.name}</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-champagne/80">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-sandGold" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {formatDate(event.date)} • {formatTime(event.time)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-sandGold" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {event.location}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
          {days !== null && days >= 0 && (
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-sandGold">
                {days === 0 ? <SparklesIcon className="w-10 h-10" /> : days}
              </p>
              <p className="text-champagne/70 text-xs uppercase tracking-wide">{days === 0 ? 'Today!' : 'days away'}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Link to={`/events/${event.id}`}>
              <Button variant="secondary" size="sm">View Event</Button>
            </Link>
            <Link to={`/events/${event.id}/invite`}>
              <Button variant="light" size="sm" >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Invite
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick action cards shown when there are events
function QuickActions({ events }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <Link to="/events/new"
        className="group flex items-center gap-4 bg-offWhite border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center flex-shrink-0 group-hover:bg-wine/20 transition-colors">
          <svg className="w-5 h-5 text-wine" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-maroon">New Event</p>
          <p className="text-xs text-textLight">Plan a celebration</p>
        </div>
      </Link>

      {/* Invitation quick link — uses most recent event */}
      {events.length > 0 && (
        <Link to={`/events/${events[0].id}/invite`}
          className="group flex items-center gap-4 bg-offWhite border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-10 h-10 rounded-lg bg-sandGold/15 flex items-center justify-center flex-shrink-0 group-hover:bg-sandGold/25 transition-colors">
            <svg className="w-5 h-5 text-caramel" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-maroon">Make Invitation</p>
            <p className="text-xs text-textLight truncate max-w-[120px]">{events[0].name}</p>
          </div>
        </Link>
      )}

      <Link to="/vendors"
        className="group flex items-center gap-4 bg-offWhite border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="w-10 h-10 rounded-lg bg-olive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-olive/20 transition-colors">
          <svg className="w-5 h-5 text-olive" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-maroon">Browse Vendors</p>
          <p className="text-xs text-textLight">Find or add vendors</p>
        </div>
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const { events, loading, upcomingEvents, pastEvents, nextEvent, totalGuests, totalBudget } = useEvents()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <p className="text-textLight">Loading events...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Greeting Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-wine/20 to-caramel/20 rounded-2xl border border-wine/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <p className="text-xs text-wine/70 uppercase tracking-widest font-semibold">Welcome back</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-wine to-maroon bg-clip-text text-transparent">
            {user?.name || 'Planner'}
          </h1>
          <p className="text-sm text-textDark/80 mt-2 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse bg-textDark"></span>
            Ready to plan your next celebration?
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <HeroBanner event={nextEvent} />
          <QuickActions events={upcomingEvents.length > 0 ? upcomingEvents : events} />
          <section className="mb-8">
            <StatsBar totalEvents={events.length} totalGuests={totalGuests} totalBudget={totalBudget} />
          </section>

          {/* Upcoming Events Card */}
          <section className="mb-10">
            <div className="bg-offWhite/80 rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-beige to-champagne px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-maroon">Upcoming Events</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-wine/10 text-wine text-xs font-medium">
                          {upcomingEvents.length} {upcomingEvents.length === 1 ? 'event' : 'events'} planned
                        </span>
                        {upcomingEvents.length > 0 && (
                          <span className="text-xs text-textLight">
                            • Next: {upcomingEvents[0]?.date ? new Date(upcomingEvents[0].date).toLocaleDateString() : 'Soon'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => navigate('/events/new')} className="shadow-sm hover:shadow-md transition-shadow">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Event
                  </Button>
                </div>
              </div>

              {/* Events content */}
              <div className="p-6">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-beige/50 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <p className="text-textLight text-base mb-2">No upcoming events</p>
                    <p className="text-sm text-textLight/70 mb-4">Start planning your next celebration</p>
                    <Link
                      to="/events/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-wine transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create Your First Event
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Past */}
          {pastEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-display text-xl font-semibold text-textMid">Past Events</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pastEvents.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          )}
        </>
      )}
    </PageWrapper>
  )
}