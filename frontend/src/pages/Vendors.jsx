import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import VendorCard from '../components/vendors/VendorCard'
import CategoryFilter from '../components/vendors/CategoryFilter'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { useVendorContext } from '../context/VendorContext'

const ALL_CATEGORIES = ['All', 'Catering', 'Photography', 'Decor', 'Venue', 'Entertainment', 'Florist']
const EMPTY_FORM = { name: '', category: 'Catering', description: '', phone: '', email: '', priceRange: '' }

function VendorForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function set(k) {
    return e => setForm(f => ({ ...f, [k]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.name?.trim()) e.name = 'Vendor name required'
    if (!form.description?.trim()) e.description = 'Description required'
    if (!form.phone && !form.email) e.phone = 'At least phone or email required'
    setErrors(e);
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Vendor Name"
        value={form.name || ''}
        onChange={set('name')}
        error={errors.name}
        required
        placeholder="e.g. Gulshan Flowers"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-textMid">Category <span className="text-burgundy">*</span></label>
        <select
          value={form.category || 'Catering'}
          onChange={set('category')}
          className="w-full px-3 py-2.5 rounded-md bg-offWhite border border-border text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-sandGold"
        >
          {ALL_CATEGORIES.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <Input
        label="Description"
        type="textarea"
        rows={2}
        value={form.description || ''}
        onChange={set('description')}
        error={errors.description}
        required
        placeholder="Brief description of services"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Phone"
          value={form.phone || ''}
          onChange={set('phone')}
          error={errors.phone}
          placeholder="+92 300 1234567"
        />
        <Input
          label="Email"
          type="email"
          value={form.email || ''}
          onChange={set('email')}
          placeholder="vendor@email.com"
        />
      </div>
      <Input
        label="Price Range"
        value={form.priceRange || ''}
        onChange={set('priceRange')}
        placeholder="e.g. PKR 500–900 / head"
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" size="md" fullWidth>Save Vendor</Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel} fullWidth>Cancel</Button>
      </div>
    </form>
  )
}

export default function Vendors() {
  const navigate = useNavigate()
  const { vendors = [], addVendor, updateVendor, deleteVendor } = useVendorContext()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = useMemo(() => {
    if (!Array.isArray(vendors)) return []

    return vendors.filter(v => {
      if (!v) return false

      const matchCat = category === 'All' || v?.category === category

      // Search filter
      const matchSearch = !search ||
        (v?.name && v.name.toLowerCase().includes(search.toLowerCase())) ||
        (v?.description && v.description.toLowerCase().includes(search.toLowerCase()))

      return matchCat && matchSearch
    })
  }, [vendors, category, search])

  function handleAdd(data) {
    addVendor(data);
    setShowAdd(false)
  }

  function handleEdit(data) {
    if (editing?.id) {
      updateVendor(editing.id, data)
      setEditing(null)
    }
  }

  function handleDelete() {
    if (deleteConfirm) {
      deleteVendor(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-beige/80 to-offWhite/80 rounded-xl border border-wine/20 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 hover:text-maroon transition-all duration-200 group cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:text-maroon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="text-textMid hover:text-maroon transition-colors">Dashboard</span>
              </button>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="flex-shrink-0">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.8" className="flex-shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                  <circle cx="6" cy="18" r="1" fill="#C9A84C"></circle>
                  <circle cx="18" cy="18" r="1" fill="#C9A84C"></circle>
                </svg>
                <span className="text-wine font-semibold bg-wine/10 px-2 py-0.5 rounded-md">Vendor Directory</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-wine/20 to-caramel/20 rounded-2xl border border-wine/60 p-6 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                    <path d="M12 13 L12 22"></path>
                    <path d="M9 18 L15 18"></path>
                    <circle cx="6" cy="18" r="1" fill="#C9A84C"></circle>
                    <circle cx="18" cy="18" r="1" fill="#C9A84C"></circle>
                  </svg>
                  <p className="text-xs text-wine/70 uppercase tracking-widest font-semibold">Vendor Management</p>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-wine to-maroon bg-clip-text text-transparent">
                  Vendor Directory
                </h1>
                <p className="text-sm text-textDark/80 mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sandGold animate-pulse"></span>
                  System vendors + your own trusted contacts
                </p>
              </div>

              <Button variant="primary" size="md" onClick={() => setShowAdd(true)} className="shadow-sm hover:shadow-md transition-all self-start mt-2">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add My Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sandGold text-lg">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Search + filter */}
      <div className="bg-offWhite border border-border rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textLight pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vendors…"
            className="w-full pl-9 pr-4 py-2.5 rounded-md bg-beige border border-border text-textDark placeholder-textLight text-sm focus:outline-none focus:ring-2 focus:ring-sandGold transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight hover:text-maroon transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <CategoryFilter categories={ALL_CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-offWhite/80 rounded-lg border border-sandGold/20">
          <svg className="w-3.5 h-3.5 text-sandGold" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 12a1 1 0 01-1-1V6a1 1 0 012 0v5a1 1 0 01-1 1zm0 4a1 1 0 100-2 1 1 0 000 2z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-textMid">
            Showing <span className="font-bold text-wine text-base">{filtered.length}</span>
            <span className="mx-1">vendor{filtered.length !== 1 ? 's' : ''}</span>
            {category !== 'All' && (
              <>
                <span className="mx-1">in</span>
                <span className="px-2 py-0.5 bg-wine/10 rounded-full text-wine font-semibold text-xs ml-1">
                  {category}
                </span>
              </>
            )}
          </p>
        </div>
        {(search || category !== 'All') && (
          <button
            onClick={() => { setSearch(''); setCategory('All') }}
            className="text-xs text-caramel hover:text-wine font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <VendorCard
              key={v?.id || Math.random()}
              vendor={v}
              onEdit={v?.isCustom ? () => setEditing(v) : undefined}
              onDelete={v?.isCustom ? () => setDeleteConfirm(v?.id) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-offWhite border border-dashed border-border rounded-xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="font-display text-lg font-semibold text-maroon mb-2">No vendors found</h3>
          <p className="text-sm text-textMid mb-4">Try adjusting your search or clearing the filters</p>
          <button
            onClick={() => { setSearch(''); setCategory('All') }}
            className="text-sm text-caramel hover:text-wine font-medium underline transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Vendor Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Your Vendor">
        <VendorForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Vendor">
        {editing && (
          <VendorForm
            initialData={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Remove Vendor"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-textMid">Are you sure you want to remove this vendor from your list?</p>
      </Modal>
    </PageWrapper>
  )
}