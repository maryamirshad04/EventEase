// import { createContext, useContext, useState, useEffect, useCallback } from 'react'
// import api from '../utils/api'

// const VendorContext = createContext(null)

// export function VendorProvider({ children, userId }) {
//   const [vendors, setVendors] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchVendors = useCallback(async (category = '') => {
//     if (!userId) {
//       setVendors([])
//       setLoading(false)
//       return
//     }
//     try {
//       setLoading(true)
//       const query = category ? `?category=${encodeURIComponent(category)}` : '';
//       const res = await api.get(`/vendors${query}`)
//       setVendors(res.data || [])
//     } catch (err) {
//       console.error('Failed to fetch vendors:', err)
//     } finally {
//       setLoading(false)
//     }
//   }, [userId])

//   useEffect(() => {
//     fetchVendors()
//   }, [fetchVendors])

//   return (
//     <VendorContext.Provider value={{ vendors, loading, fetchVendors }}>
//       {children}
//     </VendorContext.Provider>
//   )
// }

// export function useVendorContext() {
//   const ctx = useContext(VendorContext)
//   if (!ctx) throw new Error('useVendorContext must be inside VendorProvider')
//   return ctx
// }
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { mockVendors } from '../data/mockVendors'

const VendorContext = createContext(null)

// Helper to generate temporary ID for optimistic updates
function genTempId() { 
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` 
}

export function VendorProvider({ children, userId }) {
  const [backendVendors, setBackendVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch vendors from backend
  const fetchVendors = useCallback(async (category = '') => {
    if (!userId) {
      setBackendVendors([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const query = category ? `?category=${encodeURIComponent(category)}` : ''
      const res = await api.get(`/vendors${query}`)
      setBackendVendors(res.data || [])
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
      setError(err.response?.data?.message || 'Failed to load vendors')
      setBackendVendors([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Merge default vendors (mockVendors) with user's backend vendors
  const allVendors = [
    ...mockVendors.map(v => ({ 
      ...v, 
      isCustom: false, 
      source: 'default',
      editable: false  // Default vendors cannot be edited/deleted
    })),
    ...backendVendors.map(v => ({ 
      ...v, 
      isCustom: true, 
      source: 'backend',
      editable: true   // User-created vendors can be edited/deleted
    }))
  ]

  // Add a new vendor to backend
  const addVendor = async (vendorData) => {
    if (!userId) throw new Error('User not authenticated')
    
    // Optimistic update with temp ID
    const tempId = genTempId()
    const tempVendor = {
      id: tempId,
      ...vendorData,
      isCustom: true,
      source: 'backend',
      editable: true,
      isTemp: true  // Mark as temporary
    }
    
    // Add to state optimistically
    setBackendVendors(prev => [...prev, tempVendor])
    
    try {
      // Send to backend
      const res = await api.post('/vendors', vendorData)
      
      // Replace temp vendor with real one from backend
      setBackendVendors(prev => 
        prev.map(v => v.id === tempId ? { ...res.data, isCustom: true, source: 'backend', editable: true } : v)
      )
      return res.data
    } catch (err) {
      // Remove temp vendor on failure
      setBackendVendors(prev => prev.filter(v => v.id !== tempId))
      console.error('Failed to add vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to add vendor')
    }
  }

  // Update an existing vendor
  const updateVendor = async (id, vendorData) => {
    if (!userId) throw new Error('User not authenticated')
    
    // Find if it's a backend vendor
    const vendor = backendVendors.find(v => v.id === id)
    if (!vendor) throw new Error('Vendor not found')
    if (vendor.source === 'default') throw new Error('Cannot edit default vendors')
    
    // Optimistic update
    const oldVendor = { ...vendor }
    setBackendVendors(prev => 
      prev.map(v => v.id === id ? { ...v, ...vendorData } : v)
    )
    
    try {
      const res = await api.put(`/vendors/${id}`, vendorData)
      // Update with backend response
      setBackendVendors(prev => 
        prev.map(v => v.id === id ? { ...res.data, isCustom: true, source: 'backend', editable: true } : v)
      )
      return res.data
    } catch (err) {
      // Revert on failure
      setBackendVendors(prev => 
        prev.map(v => v.id === id ? oldVendor : v)
      )
      console.error('Failed to update vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to update vendor')
    }
  }

  // Delete a vendor
  const deleteVendor = async (id) => {
    if (!userId) throw new Error('User not authenticated')
    
    // Find vendor
    const vendor = backendVendors.find(v => v.id === id)
    if (!vendor) throw new Error('Vendor not found')
    if (vendor.source === 'default') throw new Error('Cannot delete default vendors')
    
    // Optimistic delete
    setBackendVendors(prev => prev.filter(v => v.id !== id))
    
    try {
      await api.delete(`/vendors/${id}`)
      // Success - vendor already removed from state
    } catch (err) {
      // Restore on failure
      setBackendVendors(prev => [...prev, vendor])
      console.error('Failed to delete vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to delete vendor')
    }
  }

  // Load vendors when userId changes or on mount
  useEffect(() => {
    if (userId) {
      fetchVendors()
    } else {
      setBackendVendors([])
      setLoading(false)
    }
  }, [userId, fetchVendors])

  return (
    <VendorContext.Provider value={{ 
      vendors: allVendors,
      backendVendors,
      defaultVendors: mockVendors,
      loading,
      error,
      fetchVendors,
      addVendor,
      updateVendor,
      deleteVendor,
      // Helper to check if vendor is editable
      isEditable: (vendorId) => {
        const vendor = allVendors.find(v => v.id === vendorId)
        return vendor?.editable || false
      }
    }}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendorContext() {
  const ctx = useContext(VendorContext)
  if (!ctx) throw new Error('useVendorContext must be used inside VendorProvider')
  return ctx
}