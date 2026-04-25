import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function VendorCard({ vendor, onEdit, onDelete }) {
  const { name, category, description, phone, email, priceRange, isCustom } = vendor

  function handleContact() {
    if (email) window.location.href = `mailto:${email}`
    else if (phone) window.location.href = `tel:${phone}`
  }

  return (
    <div className="bg-offWhite border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col overflow-hidden group">
      <div className="h-1 w-full bg-gradient-to-r from-wine via-caramel to-sandGold opacity-70" />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name + badges */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-maroon group-hover:text-wine transition-colors leading-snug">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isCustom && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sandGold/20 text-caramel border border-sandGold/30">
                My Vendor
              </span>
            )}
            <Badge label={category} color={category} size="sm" />
          </div>
        </div>

        <p className="text-sm text-textMid leading-relaxed line-clamp-2 flex-1">{description}</p>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-sandGold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold text-caramel">{priceRange || 'Price on request'}</span>
        </div>

        <div className="border-t border-border/60 mt-1" />

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-textLight space-y-0.5">
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-caramel transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-caramel transition-colors truncate max-w-[160px]">
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {email}
              </a>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {isCustom && onEdit && (
              <button onClick={onEdit}
                className="p-1.5 text-textLight hover:text-caramel hover:bg-champagne rounded-md transition-colors"
                aria-label="Edit vendor">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {isCustom && onDelete && (
              <button onClick={onDelete}
                className="p-1.5 text-textLight hover:text-burgundy hover:bg-burgundy/10 rounded-md transition-colors"
                aria-label="Delete vendor">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
