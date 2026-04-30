import { useState } from 'react'
import ProgressBar from '../ui/ProgressBar'
import ExpenseItem from './ExpenseItem'
import VendorPicker from './VendorPicker'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useBudget } from '../../hooks/useBudget'
import { formatCurrency } from '../../utils/formatCurrency'

const CATEGORIES = ['Food', 'Decor', 'Venue', 'Photography', 'Entertainment', 'Florist', 'Miscellaneous']

function categorySpent(expenses = [], category) {
  if (!Array.isArray(expenses)) return 0
  return expenses
    .filter(ex => ex?.category === category)
    .reduce((sum, ex) => sum + Number(ex?.amount || 0), 0)
}

export default function BudgetTracker({ event, onAddExpense, onRemoveExpense }) {
  const safeEvent = event || {}
  const { spent, remaining, percent } = useBudget(safeEvent)
  const expenses = Array.isArray(safeEvent?.expenses) ? safeEvent.expenses : []
  const guestCount = safeEvent?.guests?.length || 0
  const totalBudget = safeEvent?.totalBudget || 0

  // Add expense form
  const [addForm, setAddForm] = useState({ name: '', amount: '', category: 'Food' })
  const [addErrors, setAddErrors] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)

  // Vendor picker modal
  const [vendorModal, setVendorModal] = useState(null) // { expenseCategory, expenseBudget } | null

  function validateAdd() {
    const e = {}
    if (!addForm.name?.trim()) e.name = 'Expense name required'
    if (!addForm.amount || isNaN(addForm.amount) || Number(addForm.amount) <= 0)
      e.amount = 'Enter a valid amount'
    setAddErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAddExpense() {
    if (!validateAdd()) return
    if (onAddExpense) {
      onAddExpense({
        name: addForm.name.trim(),
        amount: Number(addForm.amount),
        category: addForm.category,
        type: 'allocation'
      })
    }
    setAddForm({ name: '', amount: '', category: 'Food' })
    setShowAddForm(false)
  }

  function handleVendorSelected({ vendorId, vendorName, vendorCost, priceType, guestCount: gc, ratePerHead }) {
    // Build a descriptive expense name
    let name = vendorName
    if (priceType === 'per_head') name = `${vendorName} (${gc} guests × ${formatCurrency(ratePerHead)}/head)`

    if (onAddExpense) {
      onAddExpense({
        name,
        amount: vendorCost,
        category: vendorModal?.expenseCategory || 'Miscellaneous',
        vendorId,
        vendorName,
        type: 'vendor'
      })
    }
    setVendorModal(null)
  }

  // Open vendor picker for a category
  function openVendorPicker(category) {
    if (!category) return

    const categoryAllocation = expenses
      .filter(ex => ex?.category === category && ex?.type === 'allocation')
      .reduce((sum, ex) => sum + Number(ex?.amount || 0), 0)

    setVendorModal({
      expenseCategory: category,
      expenseBudget: categoryAllocation
    })
  }

  // Group expenses by category for display
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catExpenses = expenses.filter(ex => ex?.category === cat)
    if (catExpenses.length > 0) acc[cat] = catExpenses
    return acc
  }, {})

  return (
    <div className="bg-offWhite border border-border rounded-xl overflow-hidden shadow-sm">

      {/* ── Budget header ───────────────────────────────────────────────── */}
      <div className="px-5 py-4 bg-wine text-offWhite">
        <h3 className="font-display text-lg font-semibold mb-3">Budget Overview</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-champagne/70 text-xs uppercase tracking-wide">Total</p>
            <p className="font-bold text-champagne text-sm mt-0.5">{formatCurrency(totalBudget)}</p>
          </div>
          <div>
            <p className="text-champagne/70 text-xs uppercase tracking-wide">Spent</p>
            <p className="font-bold text-sandGold text-sm mt-0.5">{formatCurrency(spent || 0)}</p>
          </div>
          <div>
            <p className="text-champagne/70 text-xs uppercase tracking-wide">Left</p>
            <p className={`font-bold text-sm mt-0.5 ${(remaining || 0) < 0 ? 'text-red-300' : 'text-offWhite'}`}>
              {(remaining || 0) < 0 ? '−' : ''}{formatCurrency(Math.abs(remaining || 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 border-b border-border">
        <ProgressBar percent={percent || 0} label={`${percent || 0}% of budget used`} showPercent={false} />
      </div>

      {/* ── Expenses section ────────────────────────────────────────────── */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-textMid uppercase tracking-wide">
            Expenses ({expenses.length})
          </h4>
          <Button variant="ghost" size="sm" onClick={() => setShowAddForm(v => !v)}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Budget Line
          </Button>
        </div>

        {/* Add budget line form */}
        {showAddForm && (
          <div className="bg-beige/50 rounded-xl p-4 mb-4 border border-border/60 animate-slide-up space-y-3">
            <p className="text-xs font-semibold text-textMid uppercase tracking-wide">New Budget Allocation</p>
            <Input
              placeholder="e.g. Catering Budget"
              value={addForm.name || ''}
              onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
              error={addErrors.name}
            />
            <Input
              type="number"
              placeholder="Allocated amount (PKR)"
              value={addForm.amount || ''}
              onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
              error={addErrors.amount}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textMid">Category</label>
              <select
                value={addForm.category || 'Food'}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-md bg-offWhite border border-border text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-sandGold"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddExpense}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* ── Grouped expense list ──────────────────────────────────────── */}
        {!expenses || expenses.length === 0 ? (
          <div className="text-center py-8 text-sm text-textLight">
            <p className="text-3xl mb-3">📋</p>
            <p>No budget lines yet.</p>
            <p className="text-xs mt-1">Add a budget allocation above, then assign a vendor to it.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-0.5">
            {Object.entries(grouped).map(([category, catExpenses]) => {
              // Safely filter expenses
              const safeCatExpenses = Array.isArray(catExpenses) ? catExpenses : []

              const allocations = safeCatExpenses.filter(ex => ex?.type === 'allocation')
              const vendorCosts = safeCatExpenses.filter(ex => ex?.type === 'vendor')
              const totalAlloc = allocations.reduce((s, ex) => s + Number(ex?.amount || 0), 0)
              const totalVendor = vendorCosts.reduce((s, ex) => s + Number(ex?.amount || 0), 0)
              const catOver = totalAlloc > 0 && totalVendor > totalAlloc

              return (
                <div key={category} className="border border-border rounded-xl overflow-hidden">
                  {/* Category header */}
                  <div className={`flex items-center justify-between px-4 py-2.5 ${catOver ? 'bg-burgundy/8' : 'bg-champagne/50'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-maroon uppercase tracking-wide">{category}</span>
                      {catOver && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-burgundy bg-burgundy/10 border border-burgundy/20 px-2 py-0.5 rounded-full">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Over by {formatCurrency(totalVendor - totalAlloc)}
                        </span>
                      )}
                    </div>
                    {/* Select vendor button */}
                    <button
                      onClick={() => openVendorPicker(category)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-maroon hover:text-wine bg-offWhite border border-border hover:border-caramel/50 px-2.5 py-1 rounded-full transition-all"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      </svg>
                      Select Vendor
                    </button>
                  </div>

                  {/* Allocation lines */}
                  <div className="divide-y divide-border/40">
                    {allocations.map(ex => (
                      <ExpenseItem
                        key={ex?.id || Math.random()}
                        expense={ex || {}}
                        onRemove={onRemoveExpense}
                      />
                    ))}
                    {vendorCosts.map(ex => (
                      <ExpenseItem
                        key={ex?.id || Math.random()}
                        expense={ex || {}}
                        onRemove={onRemoveExpense}
                      />
                    ))}
                  </div>

                  {/* Category mini-summary if vendor assigned */}
                  {vendorCosts.length > 0 && totalAlloc > 0 && (
                    <div className={`px-4 py-2 flex items-center justify-between text-xs border-t ${catOver ? 'border-burgundy/20 bg-burgundy/5' : 'border-border/40 bg-beige/30'}`}>
                      <span className="text-textLight">Allocated: {formatCurrency(totalAlloc)}</span>
                      <span className={`font-semibold ${catOver ? 'text-burgundy' : 'text-olive'}`}>
                        Vendor: {formatCurrency(totalVendor)}
                        {catOver
                          ? ` (−${formatCurrency(totalVendor - totalAlloc)} over)`
                          : ` (${formatCurrency(totalAlloc - totalVendor)} free)`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Vendor Picker Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={!!vendorModal}
        onClose={() => setVendorModal(null)}
        title={`Select Vendor — ${vendorModal?.expenseCategory || 'Category'}`}
        maxWidth="max-w-lg"
      >
        {vendorModal && (
          <VendorPicker
            expenseCategory={vendorModal.expenseCategory}
            expenseBudget={vendorModal.expenseBudget || 0}
            guestCount={guestCount}
            onSelect={handleVendorSelected}
            onClose={() => setVendorModal(null)}
          />
        )}
      </Modal>
    </div>
  )
}