import { formatCurrency } from '../../utils/formatCurrency'

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`bg-offWhite rounded-xl p-5 border border-border shadow-sm flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold font-display text-wine leading-tight">{value}</p>
        <p className="text-xs text-textLight font-medium mt-0.5 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}

export default function StatsBar({ totalEvents, totalGuests, totalBudget }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Events"
        value={totalEvents}
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <circle cx="8" cy="14" r="1" fill="#7B2340"></circle>
            <circle cx="12" cy="14" r="1" fill="#7B2340"></circle>
            <circle cx="16" cy="14" r="1" fill="#7B2340"></circle>
            <circle cx="8" cy="18" r="1" fill="#7B2340"></circle>
            <circle cx="12" cy="18" r="1" fill="#7B2340"></circle>
            <circle cx="16" cy="18" r="1" fill="#7B2340"></circle>
          </svg>
        }
        accent="bg-wine/10"
      />
      <StatCard
        label="Total Guests"
        value={totalGuests.toLocaleString()}
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C47D3E" strokeWidth="1.6" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        }
        accent="bg-caramel/15"
      />
      <StatCard
        label="Total Budget"
        value={formatCurrency(totalBudget)}
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            <circle cx="6" cy="19" r="1.5" fill="#C9A84C"></circle>
            <circle cx="18" cy="5" r="1.5" fill="#C9A84C"></circle>
          </svg>
        }
        accent="bg-sandGold/20"
      />
    </div>
  )
}