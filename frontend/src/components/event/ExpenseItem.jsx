import { formatCurrency } from '../../utils/formatCurrency'

export default function ExpenseItem({ expense, onRemove, isAllocation, isVendorCost }) {
  const { id, name, amount, vendorName } = expense

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 group transition-colors
      ${isVendorCost ? 'bg-sandGold/5 hover:bg-sandGold/10' : 'bg-offWhite hover:bg-beige/40'}`}>

      {/* Type indicator */}
      <div className="flex-shrink-0">
        {isVendorCost ? (
          <div className="w-5 h-5 rounded-full bg-caramel/15 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-caramel" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-champagne flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-textMid" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
      </div>

      {/* Name & label */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isVendorCost ? 'text-caramel' : 'text-textDark'}`}>
          {name}
        </p>
        {isVendorCost && (
          <p className="text-[10px] text-textLight mt-0.5">Vendor cost</p>
        )}
        {isAllocation && (
          <p className="text-[10px] text-textLight mt-0.5">Budget allocation</p>
        )}
      </div>

      {/* Amount */}
      <span className={`text-xs font-bold flex-shrink-0 ${isVendorCost ? 'text-caramel' : 'text-textDark'}`}>
        {formatCurrency(amount)}
      </span>

      {/* Remove */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="text-textLight hover:text-burgundy opacity-0 group-hover:opacity-100 transition-all p-1 rounded flex-shrink-0"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      )}
    </div>
  )
}
