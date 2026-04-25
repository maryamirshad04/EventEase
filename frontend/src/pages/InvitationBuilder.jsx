import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import TemplateCard from '../components/invitation/TemplateCard'
import InvitePreview from '../components/invitation/InvitePreview'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { useEvents } from '../hooks/useEvents'
import api from '../utils/api'
import { useToast } from '../components/ui/ToastContainer'

// ── Template definitions ──────────────────────────────────────────────────────
export const TEMPLATES = [
  {
    id: 'wedding',
    name: 'Royal Wedding',
    bgColor: '#5C1A2E',
    primaryColor: '#FAF7F2',
    accentColor: '#D4A849',
    fontFamily: 'Playfair Display, serif',
    sampleLine1: 'Wedding Ceremony',
    sampleLine2: 'Cordially Invites You',
    type: 'wedding',
  },
  {
    id: 'birthday',
    name: 'Birthday Bash',
    bgColor: '#FAF7F2',
    primaryColor: '#5C1A2E',
    accentColor: '#C47D3E',
    fontFamily: 'Dancing Script, cursive',
    sampleLine1: "Birthday Celebration",
    sampleLine2: "You're Invited!",
    type: 'birthday',
  },
  {
    id: 'dinner',
    name: 'Elegant Dinner',
    bgColor: '#2C1810',
    primaryColor: '#FAF7F2',
    accentColor: '#D4A849',
    fontFamily: 'Cormorant Garamond, serif',
    sampleLine1: 'A Dinner Evening',
    sampleLine2: 'Your Company Requested',
    type: 'dinner',
  },
]

export default function InvitationBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent } = useEvents()
  const event = getEvent(id)
  const previewRef = useRef(null)
  const { showSuccess, showError, showWarning } = useToast()

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0])
  const [downloading, setDownloading] = useState(false)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)

  // Guest selection modal states
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState([])
  const [selectAll, setSelectAll] = useState(true)
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  const [formData, setFormData] = useState({
    eventName: event?.name || '',
    date: formatDateForInput(event?.date),  // ← Fixed
    time: event?.time || '',
    location: event?.location || '',
    hostName: '',
    message: '',
    rsvp: '',
  });

  function setField(key) {
    return (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleDownload() {
    const el = document.getElementById('invite-preview')
    if (!el) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `${(formData.eventName || 'invitation').replace(/\s+/g, '_')}_invite.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
      showError('Download failed. Please try the Print option instead.')
    } finally {
      setDownloading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  // Open guest selection modal
 function handleSendEmailClick() {
  if (!event?.guests || event.guests.length === 0) {
    showWarning('Please add guests to this event first.')
    return
  }
  setSelectedGuests(event.guests.map(g => String(g._id || g.id)))
  setSelectAll(true)
  setShowGuestModal(true)
}

  // Toggle individual guest selection
  function toggleGuest(guestId) {
  if (!guestId) return
  const sid = String(guestId)
  const newSelected = selectedGuests.includes(sid)
    ? selectedGuests.filter(id => id !== sid)
    : [...selectedGuests, sid]
  setSelectedGuests(newSelected)
  setSelectAll(newSelected.length === event?.guests?.length)
}

  // Toggle select all guests 
  function toggleSelectAll() {
    const allGuestIds = event.guests.map(g => String(g._id || g.id));
    if (selectAll) {
      setSelectedGuests([]);
      setSelectAll(false);
    } else {
      setSelectedGuests(allGuestIds);
      setSelectAll(true);
    }
  }
  // Send emails to selected guests
  async function handleSendEmails() {
    if (selectedGuests.length === 0) {
      showWarning('Please select at least one guest to send invitations to.')
      return
    }

    const selectedGuestObjects = event.guests
      .filter(g => selectedGuests.includes(String(g._id || g.id)))
      .filter(g => g.email); // keep only valid emails

    setSending(true)
    setShowGuestModal(false)

    try {
      await api.post('/invitations/send', {
        eventId: id,
        templateId: selectedTemplate.id,
        templateData: {
          eventName: formData.eventName,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          hostName: formData.hostName,
          message: formData.message,
          rsvp: formData.rsvp,
        },
        guests: selectedGuestObjects
      })
      showSuccess(`Invitations sent successfully to ${selectedGuests.length} guest${selectedGuests.length !== 1 ? 's' : ''}!`)
    } catch (error) {
      console.error('Failed to send invitations:', error.response?.data || error.message)
      showError('Failed to send invitations. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <p className="text-textLight">Loading templates...</p>
        </div>
      </PageWrapper>
    )
  }

  // Get guest object by id to display name
  const getGuestName = (guestId) => {
    const guest = event?.guests?.find(g => g.id === guestId)
    return guest?.name || 'Unknown'
  }

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-beige/80 to-offWhite/80 rounded-xl border border-wine/20 p-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 hover:text-maroon transition-all duration-200 group"
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
            {event && (
              <>
                <Link
                  to={`/events/${id}`}
                  className="flex items-center gap-1.5 hover:text-maroon transition-all duration-200 group truncate max-w-[180px] sm:max-w-[250px]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="flex-shrink-0 group-hover:text-maroon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-textMid hover:text-maroon transition-colors truncate">{event.name}</span>
                </Link>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" className="flex-shrink-0">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.8" className="flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="text-wine font-semibold bg-wine/10 px-2 py-0.5 rounded-md">Invitation Builder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Header Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-wine/20 to-caramel/20 rounded-2xl border border-wine/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
              <line x1="12" y1="13" x2="12" y2="22"></line>
              <line x1="9" y1="18" x2="15" y2="18"></line>
            </svg>
            <p className="text-xs text-wine/70 uppercase tracking-widest font-semibold">Create Invitation</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-wine to-maroon bg-clip-text text-transparent">
            Invitation Builder
          </h1>
          <p className="text-sm text-textLight mt-2 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sandGold animate-pulse"></span>
            Choose a template, fill in the details, and download or email your invitation
          </p>
        </div>
      </div>

      {/* Main layout: form left, preview right */}
      <div className="flex flex-col xl:flex-row gap-8">

        {/* ── Left panel ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Template selector */}
          <div className="bg-offWhite border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-maroon">Choose Template</h2>
              <p className="text-xs text-textLight mt-0.5">Select the style that fits your occasion</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map(t => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    isSelected={selectedTemplate.id === t.id}
                    onSelect={() => setSelectedTemplate(t)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-offWhite border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-maroon">Invitation Details</h2>
              <p className="text-xs text-textLight mt-0.5">Changes appear live in the preview</p>
            </div>
            <div className="p-5 space-y-4">
              <Input
                label="Event / Occasion Name"
                value={formData.eventName}
                onChange={setField('eventName')}
                placeholder="e.g. Fatima & Bilal's Walima"
                required
              />
              <Input
                label="Host Name"
                value={formData.hostName}
                onChange={setField('hostName')}
                placeholder="e.g. The Khan & Raza Families"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={setField('date')}
                />
                <Input
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={setField('time')}
                />
              </div>
              <Input
                label="Location / Venue"
                value={formData.location}
                onChange={setField('location')}
                placeholder="Venue name & address"
              />

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-textLight uppercase tracking-wide">Optional</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Input
                label="Personal Message"
                type="textarea"
                value={formData.message}
                onChange={setField('message')}
                placeholder="Add a personal note for your guests…"
                rows={2}
              />
              <Input
                label="RSVP Details"
                value={formData.rsvp}
                onChange={setField('rsvp')}
                placeholder="e.g. +92 300 1234567 by June 1st"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              loading={downloading}
              fullWidth
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {downloading ? 'Generating…' : 'Download as PNG'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handlePrint}
              fullWidth
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v1a1 1 0 01-1 1H7a1 1 0 01-1-1zm9-4a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
              Print
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleSendEmailClick}
              loading={sending}
              fullWidth
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Send Emails
            </Button>
          </div>
        </div>

        {/* ── Right panel: live preview ── */}
        <div className="w-full xl:w-80 2xl:w-96 flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-offWhite border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-maroon">Live Preview</h2>
                <span className="text-xs text-textLight bg-champagne px-2 py-0.5 rounded-full">
                  {selectedTemplate.name}
                </span>
              </div>
              <div className="p-4">
                <InvitePreview
                  ref={previewRef}
                  template={selectedTemplate}
                  data={formData}
                />
              </div>
              <div className="px-5 pb-4">
                <p className="text-xs text-textLight text-center">
                  Preview updates as you type above
                </p>
              </div>
            </div>

            {/* Bismillah note */}
            <div className="mt-4 text-center">
              <p className="font-arabic text-xl text-caramel opacity-70">بِسْمِ اللَّهِ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Selection Modal */}
      <Modal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="Select Guests to Invite"
        size="max-w-md"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowGuestModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendEmails}
              loading={sending}
              fullWidth
            >
              Send to {selectedGuests.length} Guest{selectedGuests.length !== 1 ? 's' : ''}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-textMid">
            Choose which guests should receive this invitation.
          </p>

          {/* Select All option */}
          <div className="border-b border-border pb-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-border text-wine focus:ring-wine focus:ring-offset-0 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-textDark group-hover:text-maroon transition-colors">
                  Select All Guests
                </span>
                <p className="text-xs text-textLight">
                  {event?.guests?.length || 0} total guests
                </p>
              </div>
            </label>
          </div>

          {/* Guest list with checkboxes */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {event?.guests?.map((guest, index) => (
              <label
                key={guest._id || guest.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-champagne/30 transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedGuests.includes(guest._id || guest.id)}
                  onChange={() => toggleGuest(guest._id || guest.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-textDark group-hover:text-maroon transition-colors">
                    {guest.name}
                  </p>
                  {guest.email && (
                    <p className="text-xs text-textLight truncate">{guest.email}</p>
                  )}
                </div>
                {guest.email ? (
                  <svg className="w-3.5 h-3.5 text-olive flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                ) : (
                  <span className="text-[10px] text-textLight italic">No email</span>
                )}
              </label>
            ))}
          </div>

          {/* Warning if some guests don't have emails */}
          {event?.guests?.some(g => !g.email) && (
            <div className="flex items-start gap-2 p-3 bg-caramel/10 rounded-lg border border-caramel/20">
              <svg className="w-4 h-4 text-caramel flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-caramel">
                Some guests don't have email addresses. They will be skipped when sending.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </PageWrapper>
  )
}