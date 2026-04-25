import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { VendorProvider } from './context/VendorContext'
import Navbar from './components/layout/Navbar'
// Remove the import - we don't need it for public folder files
import { ToastProvider } from './components/ui/ToastContainer' 

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EditEvent from './pages/EditEvent'
import EventDetail from './pages/EventDetail'
import Vendors from './pages/Vendors'
import InvitationBuilder from './pages/InvitationBuilder'
import NotFound from './pages/NotFound'

// Protected route: redirect to / if not logged in
function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rotate-45 bg-wine rounded-sm animate-pulse" />
            <div className="absolute inset-1.5 rotate-45 bg-sandGold rounded-sm opacity-80" />
          </div>
          <p className="text-sm text-textLight font-medium">Loading…</p>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  return children
}

// App shell (with navbar + providers that need userId)
function AppShell() {
  const { user } = useAuth()
  
  return (
    <ToastProvider>  

    <EventProvider userId={user?.id}>
      <VendorProvider userId={user?.id}>
        <div className="min-h-screen flex flex-col" style={{ 
          backgroundImage: "url('/assets/dashboard-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}>
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/dashboard"         element={<Protected><Dashboard /></Protected>} />
              <Route path="/events/new"         element={<Protected><CreateEvent /></Protected>} />
              <Route path="/events/:id"         element={<Protected><EventDetail /></Protected>} />
              <Route path="/events/:id/edit"    element={<Protected><EditEvent /></Protected>} />
              <Route path="/events/:id/invite"  element={<Protected><InvitationBuilder /></Protected>} />
              <Route path="/vendors"            element={<Protected><Vendors /></Protected>} />
              <Route path="*"                   element={<NotFound />} />
            </Routes>
          </div>

          <footer className="border-t border-border" style={{ backgroundColor: '#e6d0a3' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img 
                    src="/icon1.png" 
                    alt="EventEase" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      console.error('Failed to load /icon1.png')
                      e.target.style.display = 'none'
                    }}
                    onLoad={() => {
                      console.log('Icon loaded successfully from public folder!')
                    }}
                  />
                  <span className="font-display text-sm font-bold text-wine">
                    Event<span className="text-caramel">Ease</span>
                  </span>
                </div>
                <p className="text-xs text-wine text-center">
                  Crafted for Pakistani celebrations &mdash; Ayka Imran & Maryam Irshad
                </p>
                <div className="flex items-center gap-4 text-xs text-textLight">
                  <span>v1.0</span>
                  <span className="text-sandGold">✦</span>
                  <span>2026</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </VendorProvider>
    </EventProvider>
    </ToastProvider>                    
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing — public */}
        <Route path="/" element={<LandingGuard />} />
        {/* All app routes */}
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </AuthProvider>
  )
}

// If already logged in, skip landing and go to dashboard
function LandingGuard() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <Landing />
}