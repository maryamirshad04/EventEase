import { forwardRef } from 'react'
import { formatDate, formatTime } from '../../utils/formatDate'

// ── Wedding Template ──────────────────────────────────────────────────────────
function WeddingTemplate({ data }) {
  const { hostName, eventName, date, time, location, message, rsvp } = data
  return (
    <div
      id="invite-preview"
      style={{
        width: '100%', aspectRatio: '2/3',
        background: 'linear-gradient(160deg, #3D0B1A 0%, #5C1A2E 40%, #7B2340 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10%', position: 'relative',
        overflow: 'hidden', fontFamily: 'Playfair Display, serif',
      }}
    >
      {/* Corner ornaments */}
      {[['top-3 left-3','0 0'],['top-3 right-3','0 -90deg'],['bottom-3 left-3','0 90deg'],['bottom-3 right-3','0 180deg']].map(([pos], i) => (
        <div key={i} className={`absolute ${pos} opacity-40`} style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M2 2 L2 16 M2 2 L16 2" stroke="#D4A849" strokeWidth="1.5" />
            <circle cx="2" cy="2" r="2" fill="#D4A849" />
          </svg>
        </div>
      ))}
      {/* Bismillah */}
      <p style={{ color: '#D4A849', fontSize: 'clamp(8px,2.5vw,13px)', fontFamily: 'Amiri, serif', marginBottom: '4%', opacity: 0.9, textAlign: 'center' }}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>
      {/* Host */}
      <p style={{ color: '#E8D5A3', fontSize: 'clamp(9px,2.8vw,14px)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3%', textAlign: 'center' }}>
        {hostName || 'The Families of'}
      </p>
      {/* Decorative line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '80%', marginBottom: '4%' }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #D4A849)' }} />
        {/* Wedding rings icon instead of star */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
          <circle cx="8" cy="16" r="4" stroke="#D4A849" />
          <circle cx="16" cy="16" r="4" stroke="#D4A849" />
          <path d="M12 12 L12 8 M12 8 L15 5 M12 8 L9 5" stroke="#D4A849" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.5" fill="#D4A849" />
        </svg>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #D4A849)' }} />
      </div>
      {/* Event name */}
      <h1 style={{ color: '#FAF7F2', fontSize: 'clamp(16px,5vw,28px)', fontWeight: 700, textAlign: 'center', lineHeight: 1.2, marginBottom: '5%', fontFamily: 'Playfair Display, serif' }}>
        {eventName || 'Wedding Ceremony'}
      </h1>
      {/* Invite line */}
      <p style={{ color: '#E8D5A3', fontSize: 'clamp(8px,2.2vw,11px)', marginBottom: '5%', opacity: 0.85, textAlign: 'center', letterSpacing: '0.05em' }}>
        cordially invites you to celebrate
      </p>
      {/* Divider */}
      <div style={{ width: '60%', height: 1, background: '#D4A849', opacity: 0.5, marginBottom: '5%' }} />
      {/* Date & Time with calendar icon */}
      <div style={{ textAlign: 'center', marginBottom: '3%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p style={{ color: '#D4A849', fontSize: 'clamp(10px,3vw,15px)', fontWeight: 600 }}>
            {date ? formatDate(date) : 'Date TBD'}
          </p>
        </div>
        {time && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p style={{ color: '#E8D5A3', fontSize: 'clamp(8px,2.2vw,11px)', opacity: 0.8 }}>
              {formatTime(time)}
            </p>
          </div>
        )}
      </div>
      {/* Location with pin icon */}
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '4%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p style={{ color: '#E8D5A3', fontSize: 'clamp(8px,2.2vw,11px)', opacity: 0.8, textAlign: 'center' }}>
            {location}
          </p>
        </div>
      )}
      {/* Message with quote icon */}
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '3%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p style={{ color: '#E8D5A3', fontSize: 'clamp(7px,2vw,10px)', opacity: 0.7, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{message}"
          </p>
        </div>
      )}
      {/* RSVP with envelope icon */}
      {rsvp && (
        <div style={{ borderTop: '1px solid rgba(212,168,73,0.3)', paddingTop: '4%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <polyline points="22,7 12,13 2,7"></polyline>
            </svg>
            <p style={{ color: '#D4A849', fontSize: 'clamp(7px,1.8vw,10px)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              RSVP • {rsvp}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Birthday Template ─────────────────────────────────────────────────────────
function BirthdayTemplate({ data }) {
  const { hostName, eventName, date, time, location, message, rsvp } = data
  return (
    <div
      id="invite-preview"
      style={{
        width: '100%', aspectRatio: '2/3',
        background: '#FAF7F2',
        border: '3px solid #C47D3E',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8%', position: 'relative',
        overflow: 'hidden', fontFamily: 'Dancing Script, cursive',
      }}
    >
      {/* Inner border */}
      <div style={{ position: 'absolute', inset: 10, border: '1px solid #E8D5A3', borderRadius: 8, pointerEvents: 'none' }} />
      {/* Gold dot corners */}
      {[['top-6 left-6'],['top-6 right-6'],['bottom-6 left-6'],['bottom-6 right-6']].map(([pos], i) => (
        <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full bg-sandGold opacity-60`} />
      ))}
      {/* Header text */}
      <p style={{ color: '#C47D3E', fontSize: 'clamp(8px,2.5vw,12px)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '4%', textAlign: 'center' }}>
        You're Invited
      </p>
      {/* Birthday cake icon instead of emoji */}
      <div style={{ marginBottom: '2%' }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#C47D3E" strokeWidth="1.5">
          <path d="M12 2 L12 6 M9 4 L15 4" stroke="#C47D3E" strokeWidth="1.5" />
          <rect x="4" y="8" width="16" height="12" rx="2" fill="#F5E6D3" stroke="#C47D3E" />
          <circle cx="8" cy="12" r="1" fill="#C47D3E" />
          <circle cx="12" cy="12" r="1" fill="#C47D3E" />
          <circle cx="16" cy="12" r="1" fill="#C47D3E" />
          <path d="M6 16 L18 16" stroke="#C47D3E" strokeWidth="1.2" />
          <path d="M8 19 L16 19" stroke="#C47D3E" strokeWidth="1.2" />
        </svg>
      </div>
      <h2 style={{ color: '#5C1A2E', fontSize: 'clamp(14px,4.5vw,24px)', fontWeight: 700, textAlign: 'center', lineHeight: 1.2, marginBottom: '4%' }}>
        {eventName || 'Birthday Celebration'}
      </h2>
      {/* For whose birthday */}
      {hostName && (
        <p style={{ color: '#7B2340', fontSize: 'clamp(9px,2.8vw,14px)', marginBottom: '5%', textAlign: 'center' }}>
          Hosted by {hostName}
        </p>
      )}
      <div style={{ width: '50%', borderTop: '2px dashed #D4A849', marginBottom: '5%' }} />
      <div style={{ textAlign: 'center', marginBottom: '3%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C47D3E" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p style={{ color: '#C47D3E', fontSize: 'clamp(10px,3vw,16px)', fontWeight: 600 }}>
            {date ? formatDate(date) : 'Date TBD'}
          </p>
        </div>
        {time && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6B52" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p style={{ color: '#8B6B52', fontSize: 'clamp(8px,2.2vw,11px)', fontFamily: 'Inter, sans-serif' }}>{formatTime(time)}</p>
          </div>
        )}
      </div>
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '4%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6B52" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p style={{ color: '#8B6B52', fontSize: 'clamp(8px,2.2vw,11px)', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
            {location}
          </p>
        </div>
      )}
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '3%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5A3825" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p style={{ color: '#5A3825', fontSize: 'clamp(7px,2vw,10px)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5 }}>
            "{message}"
          </p>
        </div>
      )}
      {rsvp && (
        <div style={{ background: '#5C1A2E', color: '#FAF7F2', padding: '6px 16px', borderRadius: 999, fontSize: 'clamp(7px,2vw,10px)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <polyline points="22,7 12,13 2,7"></polyline>
          </svg>
          RSVP: {rsvp}
        </div>
      )}
    </div>
  )
}

// ── Dinner Template ───────────────────────────────────────────────────────────
function DinnerTemplate({ data }) {
  const { hostName, eventName, date, time, location, message, rsvp } = data
  return (
    <div
      id="invite-preview"
      style={{
        width: '100%', aspectRatio: '2/3',
        background: '#2C1810',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '9%', position: 'relative',
        overflow: 'hidden', fontFamily: 'Cormorant Garamond, serif',
      }}
    >
      {/* Top gold bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #5C1A2E, #D4A849, #5C1A2E)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #5C1A2E, #D4A849, #5C1A2E)' }} />
      {/* Gold frame */}
      <div style={{ position: 'absolute', inset: 12, border: '1px solid rgba(212,168,73,0.3)', pointerEvents: 'none' }} />
      {/* Fork and knife icons instead of emoji */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '4%' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
          <path d="M12 2 L12 8 M9 5 L15 5" stroke="#D4A849" />
          <path d="M6 2 L6 12 C6 14 8 16 12 16 C16 16 18 14 18 12 L18 2" stroke="#D4A849" fill="none" />
          <path d="M8 16 L8 22 M16 16 L16 22" stroke="#D4A849" strokeWidth="1.2" />
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
          <path d="M6 2 L6 12 C6 14 8 16 12 16 C16 16 18 14 18 12 L18 2" stroke="#D4A849" fill="none" />
          <path d="M8 16 L8 22 M16 16 L16 22" stroke="#D4A849" strokeWidth="1.2" />
        </svg>
      </div>
      {/* Request */}
      <p style={{ color: '#D4A849', fontSize: 'clamp(8px,2.2vw,11px)', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 300, marginBottom: '3%', textAlign: 'center' }}>
        The Pleasure of Your Company
      </p>
      <p style={{ color: '#D4A849', fontSize: 'clamp(8px,2.2vw,11px)', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 300, marginBottom: '5%', textAlign: 'center' }}>
        is requested at
      </p>
      {/* Event name */}
      <h1 style={{ color: '#FAF7F2', fontSize: 'clamp(14px,4.5vw,26px)', fontWeight: 600, textAlign: 'center', lineHeight: 1.25, marginBottom: '3%', fontStyle: 'italic' }}>
        {eventName || 'A Dinner Evening'}
      </h1>
      {hostName && (
        <p style={{ color: '#E8D5A3', fontSize: 'clamp(9px,2.5vw,13px)', marginBottom: '5%', textAlign: 'center' }}>
          Hosted by {hostName}
        </p>
      )}
      {/* Gold rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '70%', marginBottom: '5%' }}>
        <div style={{ flex: 1, height: 1, background: '#D4A849', opacity: 0.5 }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D4A849' }} />
        <div style={{ flex: 1, height: 1, background: '#D4A849', opacity: 0.5 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: '3%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p style={{ color: '#D4A849', fontSize: 'clamp(10px,3vw,16px)', fontWeight: 500 }}>
            {date ? formatDate(date) : 'Date TBD'}
          </p>
        </div>
        {time && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6B52" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p style={{ color: '#8B6B52', fontSize: 'clamp(8px,2.2vw,11px)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>{formatTime(time)}</p>
          </div>
        )}
      </div>
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '4%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6B52" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p style={{ color: '#8B6B52', fontSize: 'clamp(8px,2vw,10px)', fontFamily: 'Inter, sans-serif', textAlign: 'center', fontWeight: 300 }}>
            {location}
          </p>
        </div>
      )}
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '4%' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p style={{ color: '#E8D5A3', fontSize: 'clamp(7px,1.8vw,9px)', fontStyle: 'italic', textAlign: 'center', opacity: 0.7, lineHeight: 1.6 }}>
            "{message}"
          </p>
        </div>
      )}
      {rsvp && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4A849" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <polyline points="22,7 12,13 2,7"></polyline>
          </svg>
          <p style={{ color: '#D4A849', fontSize: 'clamp(7px,1.8vw,9px)', letterSpacing: '0.15em', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase' }}>
            Kindly RSVP • {rsvp}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Template map ──────────────────────────────────────────────────────────────
const TEMPLATE_COMPONENTS = {
  wedding:  WeddingTemplate,
  birthday: BirthdayTemplate,
  dinner:   DinnerTemplate,
}

const InvitePreview = forwardRef(function InvitePreview({ template, data }, ref) {
  const TemplateComponent = TEMPLATE_COMPONENTS[template?.id] || WeddingTemplate
  return (
    <div ref={ref} className="w-full transition-opacity duration-150">
      <TemplateComponent data={data} />
    </div>
  )
})

export default InvitePreview