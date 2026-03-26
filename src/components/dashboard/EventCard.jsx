import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { formatDateShort, formatTime, daysUntil } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'
import { calcPercent } from '../../utils/calcBudget'

export default function EventCard({ event }) {
  const { id, name, date, time, location, guests = [], expenses = [], totalBudget, status } = event
  const days = daysUntil(date)
  const percent = calcPercent(totalBudget, expenses)
  const isUpcoming = status === 'upcoming'

  return (
    <div className="bg-offWhite border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col group">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isUpcoming ? 'bg-wine' : 'bg-border'}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-maroon leading-snug group-hover:text-wine transition-colors line-clamp-2">
            {name}
          </h3>
          <Badge label={isUpcoming ? 'Upcoming' : 'Past'} color={isUpcoming ? 'upcoming' : 'past'} size="sm" />
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-1.5 text-sm text-textMid">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-caramel flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formatDateShort(date)} • {formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-caramel flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-textLight">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
            </svg>
            {guests.length} guests
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            {formatCurrency(totalBudget)}
          </span>
          {isUpcoming && days !== null && days >= 0 && (
            <span className="ml-auto text-caramel font-medium">
              {days === 0 ? 'Today!' : `${days}d away`}
            </span>
          )}
        </div>

        {/* Budget bar */}
        {expenses.length > 0 && (
          <div className="w-full bg-champagne rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent >= 100 ? 'bg-burgundy' : percent >= 60 ? 'bg-caramel' : 'bg-olive'
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-5 py-3 bg-beige/60 border-t border-border flex items-center justify-between gap-2">
        <Link
          to={`/events/${id}`}
          className="text-sm font-medium text-maroon hover:text-wine transition-colors flex items-center gap-1"
        >
          View Details
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link
          to={`/events/${id}/invite`}
          className="text-xs text-textLight hover:text-caramel transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Invite
        </Link>
      </div>
    </div>
  )
}
