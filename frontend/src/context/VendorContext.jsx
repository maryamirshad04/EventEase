import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { mockVendors } from '../data/mockVendors'

const VendorContext = createContext(null)
function genTempId() { 
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` 
}

export function VendorProvider({ children, userId }) {
  const [backendVendors, setBackendVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  const allVendors = [
    ...mockVendors.map(v => ({ 
      ...v, 
      isCustom: false, 
      source: 'default',
      editable: false  
    })),
    ...backendVendors.map(v => ({ 
      ...v, 
      isCustom: true, 
      source: 'backend',
      editable: true   
    }))
  ]

  const addVendor = async (vendorData) => {
    if (!userId) throw new Error('User not authenticated')
    
    const tempId = genTempId()
    const tempVendor = {
      id: tempId,
      ...vendorData,
      isCustom: true,
      source: 'backend',
      editable: true,
      isTemp: true 
    }
    
    setBackendVendors(prev => [...prev, tempVendor])
    
    try {
      const res = await api.post('/vendors', vendorData)
      setBackendVendors(prev => 
        prev.map(v => v.id === tempId ? { ...res.data, isCustom: true, source: 'backend', editable: true } : v)
      )
      return res.data
    } catch (err) {
      setBackendVendors(prev => prev.filter(v => v.id !== tempId))
      console.error('Failed to add vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to add vendor')
    }
  }

  const updateVendor = async (id, vendorData) => {
    if (!userId) throw new Error('User not authenticated')
    
    const vendor = backendVendors.find(v => v.id === id)
    if (!vendor) throw new Error('Vendor not found')
    if (vendor.source === 'default') throw new Error('Cannot edit default vendors')
    
    const oldVendor = { ...vendor }
    setBackendVendors(prev => 
      prev.map(v => v.id === id ? { ...v, ...vendorData } : v)
    )
    
    try {
      const res = await api.put(`/vendors/${id}`, vendorData)
      setBackendVendors(prev => 
        prev.map(v => v.id === id ? { ...res.data, isCustom: true, source: 'backend', editable: true } : v)
      )
      return res.data
    } catch (err) {
      setBackendVendors(prev => 
        prev.map(v => v.id === id ? oldVendor : v)
      )
      console.error('Failed to update vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to update vendor')
    }
  }

  const deleteVendor = async (id) => {
    if (!userId) throw new Error('User not authenticated')
    
    const vendor = backendVendors.find(v => v.id === id)
    if (!vendor) throw new Error('Vendor not found')
    if (vendor.source === 'default') throw new Error('Cannot delete default vendors')
    
    setBackendVendors(prev => prev.filter(v => v.id !== id))
    
    try {
      await api.delete(`/vendors/${id}`)
    } catch (err) {
      setBackendVendors(prev => [...prev, vendor])
      console.error('Failed to delete vendor:', err)
      throw new Error(err.response?.data?.message || 'Failed to delete vendor')
    }
  }

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