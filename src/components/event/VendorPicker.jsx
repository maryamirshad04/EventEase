import { useState, useMemo } from 'react'
import { useVendorContext } from '../../context/VendorContext'
import { formatCurrency } from '../../utils/formatCurrency'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

// Map expense categories to vendor categories
const CATEGORY_MAP = {
  Food:          'Catering',
  Catering:      'Catering',
  Decor:         'Decor',
  Venue:         'Venue',
  Photography:   'Photography',
  Entertainment: 'Entertainment',
  Florist:       'Florist',
  Miscellaneous: null, // show all
}

function avg(min, max) { return Math.round((min + max) / 2) }

export default function VendorPicker({
  expenseCategory,   // e.g. "Food", "Photography"
  expenseBudget,     // number — the allocated budget for this expense line
  guestCount,        // number — total guests on the event
  onSelect,          // fn({ vendorId, vendorName, vendorCost, guestCount?, priceType })
  onClose,
}) {
  const { vendors } = useVendorContext()
  const [step, setStep]           = useState('list')   // 'list' | 'configure'
  const [chosen, setChosen]       = useState(null)     // vendor object
  const [customAmount, setCustomAmount] = useState('')
  const [customGuests, setCustomGuests] = useState(String(guestCount || ''))
  const [amountErr, setAmountErr] = useState('')
  const [guestErr,  setGuestErr]  = useState('')

  // Filter vendors to matching category
  const vendorCategory = CATEGORY_MAP[expenseCategory] ?? null
  const filtered = useMemo(() =>
    vendors.filter(v => !vendorCategory || v.category === vendorCategory),
    [vendors, vendorCategory]
  )

  // ── Pick a vendor ────────────────────────────────────────────────────────
  function handlePick(vendor) {
    setChosen(vendor)
    const defaultAmt = vendor.priceMin && vendor.priceMax
      ? String(avg(vendor.priceMin, vendor.priceMax))
      : ''
    setCustomAmount(defaultAmt)
    setCustomGuests(String(guestCount || ''))
    setAmountErr('')
    setGuestErr('')
    setStep('configure')
  }

  // ── Computed cost ────────────────────────────────────────────────────────
  const isPerHead    = chosen?.priceType === 'per_head'
  const guests       = parseInt(customGuests, 10) || 0
  const ratePerHead  = parseInt(customAmount, 10)  || 0
  const flatAmount   = parseInt(customAmount, 10)  || 0
  const vendorCost   = isPerHead ? guests * ratePerHead : flatAmount

  const isOverBudget = expenseBudget > 0 && vendorCost > expenseBudget
  const overBy       = isOverBudget ? vendorCost - expenseBudget : 0

  // ── Confirm ──────────────────────────────────────────────────────────────
  function handleConfirm() {
    let valid = true
    if (isPerHead) {
      if (!guests || guests <= 0) { setGuestErr('Enter number of guests'); valid = false }
      else setGuestErr('')
      if (!ratePerHead || ratePerHead <= 0) { setAmountErr('Enter rate per head'); valid = false }
      else setAmountErr('')
    } else {
      if (!flatAmount || flatAmount <= 0) { setAmountErr('Enter the agreed amount'); valid = false }
      else setAmountErr('')
    }
    if (!valid) return

    onSelect({
      vendorId:   chosen.id,
      vendorName: chosen.name,
      vendorCost,
      priceType:  chosen.priceType,
      ...(isPerHead ? { guestCount: guests, ratePerHead } : {}),
    })
  }

  // ── Render: vendor list ──────────────────────────────────────────────────
  if (step === 'list') {
    return (
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-textLight text-sm">
            <p className="text-3xl mb-3">🔍</p>
            <p>No vendors found for <strong>{expenseCategory}</strong>.</p>
            <p className="mt-1 text-xs">Add your own vendor in the Vendors directory.</p>
          </div>
        ) : (
          filtered.map(vendor => (
            <div
              key={vendor.id}
              className="flex items-start gap-3 p-4 bg-beige/40 border border-border rounded-xl hover:border-caramel/50 hover:bg-champagne/40 transition-all cursor-pointer group"
              onClick={() => handlePick(vendor)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-maroon">{vendor.name}</span>
                  {vendor.isCustom && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sandGold/20 text-caramel border border-sandGold/30">
                      My Vendor
                    </span>
                  )}
                  <Badge label={vendor.category} color={vendor.category} size="sm" />
                </div>
                <p className="text-xs text-textMid line-clamp-1 mb-2">{vendor.description}</p>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-sandGold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-caramel">{vendor.priceRange}</span>
                  <span className="text-[10px] text-textLight ml-1">
                    {vendor.priceType === 'per_head' ? '(per head)' : '(flat rate)'}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-maroon flex items-center gap-1">
                  Select
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  // ── Render: configure cost ───────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => setStep('list')}
        className="flex items-center gap-1.5 text-xs text-textLight hover:text-maroon transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
        </svg>
        Back to vendors
      </button>

      {/* Selected vendor summary */}
      <div className="bg-beige/60 border border-border rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center flex-shrink-0 text-lg">🏪</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-maroon">{chosen?.name}</p>
            <p className="text-xs text-textMid mt-0.5">{chosen?.priceRange}</p>
          </div>
          <Badge label={chosen?.category} color={chosen?.category} size="sm" />
        </div>
      </div>

      {/* Expense budget reminder */}
      {expenseBudget > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-champagne/60 rounded-lg border border-border text-xs text-textMid">
          <svg className="w-3.5 h-3.5 text-caramel flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          Budget allocated for <strong className="text-maroon mx-0.5">{expenseCategory}</strong>: {formatCurrency(expenseBudget)}
        </div>
      )}

      {/* Per-head configuration */}
      {isPerHead ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-textMid uppercase tracking-wide">Configure Per-Head Cost</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-textMid block mb-1.5">Rate per head (PKR)</label>
              <input
                type="number"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setAmountErr('') }}
                placeholder={`${chosen?.priceMin}–${chosen?.priceMax}`}
                className="w-full px-3 py-2.5 rounded-md bg-offWhite border border-border text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-sandGold transition-colors"
              />
              {/* Range hint pills */}
              <div className="flex gap-1.5 mt-1.5">
                {[chosen?.priceMin, avg(chosen?.priceMin, chosen?.priceMax), chosen?.priceMax].filter(Boolean).map((v, i) => (
                  <button key={i} onClick={() => setCustomAmount(String(v))}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-champagne border border-border text-textMid hover:bg-sandGold/30 transition-colors">
                    {formatCurrency(v)}
                  </button>
                ))}
              </div>
              {amountErr && <p className="text-xs text-burgundy mt-1">{amountErr}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-textMid block mb-1.5">Number of guests</label>
              <input
                type="number"
                value={customGuests}
                onChange={e => { setCustomGuests(e.target.value); setGuestErr('') }}
                placeholder="e.g. 150"
                className="w-full px-3 py-2.5 rounded-md bg-offWhite border border-border text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-sandGold transition-colors"
              />
              {guestCount > 0 && (
                <button onClick={() => setCustomGuests(String(guestCount))}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-champagne border border-border text-textMid hover:bg-sandGold/30 transition-colors mt-1.5">
                  Use event guests ({guestCount})
                </button>
              )}
              {guestErr && <p className="text-xs text-burgundy mt-1">{guestErr}</p>}
            </div>
          </div>

          {/* Live calculation */}
          {ratePerHead > 0 && guests > 0 && (
            <div className="bg-offWhite border border-border rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between items-center text-textMid">
                <span>{formatCurrency(ratePerHead)} × {guests} guests</span>
                <span className="font-bold text-maroon">{formatCurrency(vendorCost)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flat configuration */
        <div className="space-y-4">
          <p className="text-xs font-semibold text-textMid uppercase tracking-wide">Enter Agreed Amount</p>
          <div>
            <label className="text-xs font-medium text-textMid block mb-1.5">Amount (PKR)</label>
            <input
              type="number"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setAmountErr('') }}
              placeholder={`${chosen?.priceMin}–${chosen?.priceMax}`}
              className="w-full px-3 py-2.5 rounded-md bg-offWhite border border-border text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-sandGold transition-colors"
            />
            {/* Quick pick pills */}
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {[chosen?.priceMin, avg(chosen?.priceMin, chosen?.priceMax), chosen?.priceMax].filter(Boolean).map((v, i) => (
                <button key={i} onClick={() => setCustomAmount(String(v))}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-champagne border border-border text-textMid hover:bg-sandGold/30 transition-colors">
                  {i === 0 ? 'Min' : i === 1 ? 'Avg' : 'Max'}: {formatCurrency(v)}
                </button>
              ))}
            </div>
            {amountErr && <p className="text-xs text-burgundy mt-1">{amountErr}</p>}
          </div>
        </div>
      )}

      {/* Over-budget warning */}
      {isOverBudget && vendorCost > 0 && (
        <div className="flex items-start gap-2.5 bg-burgundy/8 border border-burgundy/25 rounded-xl px-4 py-3 animate-fade-in">
          <svg className="w-4 h-4 text-burgundy mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-xs font-semibold text-burgundy">Over budget by {formatCurrency(overBy)}</p>
            <p className="text-xs text-burgundy/80 mt-0.5 leading-relaxed">
              Vendor cost ({formatCurrency(vendorCost)}) exceeds your {expenseCategory} budget ({formatCurrency(expenseBudget)}).
              You can still add it, but consider adjusting your budget allocation.
            </p>
          </div>
        </div>
      )}

      {/* Confirm total */}
      {vendorCost > 0 && !isOverBudget && expenseBudget > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-olive/8 border border-olive/20 rounded-lg text-xs text-olive">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Within budget — {formatCurrency(expenseBudget - vendorCost)} remaining
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          variant="primary" size="md" fullWidth
          onClick={handleConfirm}
        >
          {isOverBudget ? '⚠ Add Anyway' : 'Add to Expenses'}
        </Button>
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  )
}
