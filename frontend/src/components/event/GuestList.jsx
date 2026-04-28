import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'bg-wine/20 text-wine',
  'bg-caramel/20 text-caramel',
  'bg-olive/20 text-olive',
  'bg-maroon/20 text-maroon',
  'bg-sandGold/30 text-caramel',
]

export default function GuestList({ guests = [], onAdd, onRemove, readOnly = false }) {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [emailErr,  setEmailErr]  = useState('')

  function validate() {
    let valid = true
    if (!name.trim())  { setNameErr('Name is required');           valid = false } else setNameErr('')
    if (!email.trim()) { setEmailErr('Email is required');         valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr('Enter a valid email'); valid = false
    } else setEmailErr('')
    return valid
  }

  function handleAdd() {
    if (!validate()) return
    // onAdd?.({ id: `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    // name: name.trim(), email: email.trim() })
    onAdd?.({
  name: name.trim(),
  email: email.trim()
})
    setName(''); setEmail('')
  }

  return (
    <div className="space-y-4">
      {/* Guest table */}
      {guests.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-champagne/60 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-textMid uppercase tracking-wide">Guest</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-textMid uppercase tracking-wide">Email</th>
                {!readOnly && <th className="px-4 py-2.5 w-10" />}
              </tr>
            </thead>
            <tbody>
              {guests.map((g, i) => (
                <tr key={g._id || g.id} className={i % 2 === 0 ? 'bg-offWhite' : 'bg-beige/40'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {getInitials(g.name)}
                      </div>
                      <span className="text-textDark font-medium">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-textMid">{g.email}</td>
                  {!readOnly && (
                    <td className="px-4 py-3 text-right">
                      <button
onClick={() => onRemove?.(g._id || g.id)}
                        className="text-textLight hover:text-burgundy transition-colors p-1 rounded"
                        aria-label="Remove guest"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-textLight text-sm border border-dashed border-border rounded-lg bg-beige/30">
          <svg className="w-10 h-10 mx-auto mb-2 opacity-40 text-caramel" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          No guests added yet
        </div>
      )}

      {/* Add guest form */}
      {!readOnly && (
        <div className="bg-beige/40 rounded-lg p-4 border border-border/60">
          <p className="text-xs font-semibold text-textMid uppercase tracking-wide mb-3">Add Guest</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              error={nameErr}
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={emailErr}
            />
          </div>
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={handleAdd}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Guest
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
