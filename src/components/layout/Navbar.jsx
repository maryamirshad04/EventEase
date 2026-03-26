import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vendors',   label: 'Vendors' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-wine font-semibold border-b-2 border-wine pb-0.5'
      : 'text-textMid hover:text-maroon transition-colors duration-150 font-medium'

  function handleLogout() {
    logout()
    navigate('/')
  }

  function getInitials(name = '') {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border shadow-sm" style={{ backgroundColor: '#e6d0a3' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo with icon */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <img 
              src="/icon1.png" 
              alt="EventEase" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                console.error('Failed to load icon in navbar')
                e.target.style.display = 'none'
              }}
              onLoad={() => {
                console.log('Navbar icon loaded successfully!')
              }}
            />
            <span className="font-display text-xl font-bold text-wine tracking-tight">
              Event<span className="text-caramel">Ease</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events/new')}
              className="flex items-center gap-2 px-4 py-2 bg-maroon text-offWhite text-sm font-medium rounded-md hover:bg-wine transition-colors duration-150 shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Event
            </button>

            {/* User avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="w-9 h-9 rounded-full bg-wine/15 flex items-center justify-center text-sm font-semibold text-wine border border-wine/20 hover:bg-wine/25 transition-colors"
              >
                {getInitials(user?.name || '')}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-52 bg-offWhite rounded-xl border border-border shadow-lg overflow-hidden animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-border bg-beige/60">
                    <p className="text-sm font-semibold text-maroon truncate">{user?.name}</p>
                    <p className="text-xs text-textLight truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-textMid hover:bg-champagne hover:text-burgundy transition-colors text-left"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-textMid hover:text-maroon hover:bg-champagne rounded-md transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border animate-slide-up" style={{ backgroundColor: '#e6d0a3' }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            {/* User info with icon in mobile view */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-beige/60 rounded-lg">
              <img 
                src="/icon1.png" 
                alt="EventEase" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-maroon truncate">{user?.name}</p>
                <p className="text-xs text-textLight truncate">{user?.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-wine/15 flex items-center justify-center text-xs font-semibold text-wine">
                {getInitials(user?.name || '')}
              </div>
            </div>

            {navLinks.map(l => (
              <NavLink
                key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-wine/10 text-wine font-semibold' : 'text-textMid hover:bg-champagne hover:text-maroon'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
              <button
                onClick={() => { navigate('/events/new'); setMobileOpen(false) }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-maroon text-offWhite text-sm font-medium rounded-md hover:bg-wine transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Event
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-burgundy border border-burgundy/20 rounded-md hover:bg-burgundy/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}