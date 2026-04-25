import { createContext, useContext, useState, useEffect } from 'react'
import { mockVendors } from '../data/mockVendors'

const VendorContext = createContext(null)
function genId() { return `v_custom_${Date.now()}_${Math.random().toString(36).slice(2,6)}` }

export function VendorProvider({ children, userId }) {
  const storageKey = userId ? `ee_vendors_${userId}` : null
  const [customVendors, setCustomVendors] = useState([])

  useEffect(() => {
    if (!storageKey) { setCustomVendors([]); return }
    try { const s = localStorage.getItem(storageKey); setCustomVendors(s ? JSON.parse(s) : []) }
    catch { setCustomVendors([]) }
  }, [storageKey])

  useEffect(() => { if (storageKey) localStorage.setItem(storageKey, JSON.stringify(customVendors)) }, [customVendors, storageKey])

  const vendors = [
    ...mockVendors.map(v => ({ ...v, isCustom: false })),
    ...customVendors.map(v => ({ ...v, isCustom: true })),
  ]

  const addVendor    = (d) => { const v = { ...d, id: genId(), isCustom: true }; setCustomVendors(p => [...p, v]); return v }
  const updateVendor = (d) => setCustomVendors(p => p.map(v => v.id === d.id ? { ...v, ...d } : v))
  const deleteVendor = (id) => setCustomVendors(p => p.filter(v => v.id !== id))

  return (
    <VendorContext.Provider value={{ vendors, customVendors, addVendor, updateVendor, deleteVendor }}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendorContext() {
  const ctx = useContext(VendorContext)
  if (!ctx) throw new Error('useVendorContext must be inside VendorProvider')
  return ctx
}
