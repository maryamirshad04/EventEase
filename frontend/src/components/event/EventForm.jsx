import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import GuestList from './GuestList'

const emptyForm = { name: '', date: '', time: '', location: '', description: '', totalBudget: '' }

export default function EventForm({ initialData = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData ? {
    name: initialData.name || '',
    date: initialData.date || '',
    time: initialData.time || '',
    location: initialData.location || '',
    description: initialData.description || '',
    totalBudget: initialData.totalBudget || '',
  } : emptyForm)

  const [guests, setGuests] = useState(initialData?.guests || [])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Event name is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.time) e.time = 'Time is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.totalBudget || isNaN(form.totalBudget) || Number(form.totalBudget) <= 0)
      e.totalBudget = 'Enter a valid budget'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      await onSubmit?.({
        ...form,
        totalBudget: Number(form.totalBudget),
        guests,
        expenses: initialData?.expenses || [],
        status: initialData?.status || 'upcoming',
        ...(initialData?.id ? { id: initialData.id } : {}),
      })
    } finally {
      setLoading(false)
    }
  }

  function addGuest(g) {
    setGuests(prev => [...prev, { ...g, id: `g_${Date.now()}` }])
  }
  function removeGuest(id) {
    setGuests(prev => prev.filter(g => g.id !== id))
  }

  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-textMid uppercase tracking-wide border-l-4 border-caramel pl-3">
        {title}
      </h3>
      {children}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section title="Event Details">
        <Input label="Event Name" value={form.name} onChange={set('name')} error={errors.name} required placeholder="e.g. Fatima & Bilal's Walima" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Date" type="date" value={form.date} onChange={set('date')} error={errors.date} required />
          <Input label="Time" type="time" value={form.time} onChange={set('time')} error={errors.time} required />
        </div>
        <Input label="Location" value={form.location} onChange={set('location')} error={errors.location} required placeholder="Venue name & area" />
        <Input label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Brief description of the event..." rows={3} />
      </Section>

      <div className="border-t border-border" />

      <Section title="Budget">
        <Input
          label="Total Budget (PKR)"
          type="number"
          value={form.totalBudget}
          onChange={set('totalBudget')}
          error={errors.totalBudget}
          required
          placeholder="e.g. 150000"
          hint="Enter your maximum planned spend in Pakistani Rupees"
        />
      </Section>

      <div className="border-t border-border" />

      <Section title={`Guest List (${guests.length})`}>
        <GuestList guests={guests} onAdd={addGuest} onRemove={removeGuest} />
      </Section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
        <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
          {initialData ? 'Save Changes' : 'Create Event'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  )
}
