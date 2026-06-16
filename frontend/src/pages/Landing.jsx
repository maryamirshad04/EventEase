import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE STYLES INJECTED ONCE
// ─────────────────────────────────────────────────────────────────────────────
const responsiveStyles = `
  @media (max-width: 768px) {
    .landing-nav-icons { display: none !important; }
    .landing-hero-left { bottom: 5% !important; left: 3% !important; max-width: 92% !important; }
    .landing-hero-right { display: none !important; }
    .landing-hero-img { object-position: 60% center !important; }
    .landing-dove-left { width: clamp(260px, 80%, 500px) !important; left: -5% !important; }
    .landing-dove-right { width: clamp(200px, 60%, 400px) !important; bottom: -1% !important; right: -5% !important; }
    .landing-hero-h2 { font-size: clamp(28px, 8vw, 48px) !important; }
    .landing-hero-btns { flex-direction: column !important; gap: 8px !important; }
    .landing-hero-btns button { width: 100% !important; text-align: center !important; }
    .landing-features-section { padding: 48px 20px !important; }
    .landing-features-grid { grid-template-columns: 1fr !important; }
    .landing-cta-section { padding: 48px 20px !important; }
    .landing-footer { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 10px !important; padding: 18px 20px !important; }
    .landing-auth-btns .signin-btn { display: none !important; }
    .landing-auth-btns .signup-btn { display: none !important; }
    .landing-hero-aspect { aspect-ratio: auto !important; min-height: 480px !important; max-height: 90vh !important; }
  }
  @media (max-width: 480px) {
    .landing-wordmark { font-size: 20px !important; }
    .landing-hero-h2 { font-size: clamp(24px, 9vw, 36px) !important; }
    .landing-hero-eyebrow { font-size: 9px !important; }
    .landing-dove-left { width: 70% !important; }
    .landing-dove-right { width: 55% !important; }
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// ORNAMENTAL BORDER SVG
// ─────────────────────────────────────────────────────────────────────────────
function OrnamentalBorder() {
  const roseX = [200,280,360,440,520,600,680,760,840,920,1000,1080,1160,1240,1320]
  const roseY = [80,170,260,350,440,530,620,710]
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1366 760" preserveAspectRatio="none" fill="none">
      <rect x="16" y="16" width="1334" height="728" stroke="#C9A84C" strokeWidth="1.4" opacity="0.7"/>
      <rect x="22" y="22" width="1322" height="716" stroke="#C9A84C" strokeWidth="0.5" opacity="0.35"/>
      {[
        { tx: 0,    ty: 0,   sx: 1, sy: 1 },
        { tx: 1366, ty: 0,   sx:-1, sy: 1 },
        { tx: 0,    ty: 760, sx: 1, sy:-1 },
        { tx: 1366, ty: 760, sx:-1, sy:-1 },
      ].map(({ tx, ty, sx, sy }, i) => (
        <g key={i} transform={`translate(${tx},${ty}) scale(${sx},${sy})`}>
          <circle cx="40" cy="40" r="11" stroke="#C9A84C" strokeWidth="1.2" fill="none"/>
          <circle cx="40" cy="40" r="4"  fill="#C9A84C" opacity="0.55"/>
          <path d="M16 40 L64 40 M40 16 L40 64" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4"/>
          <path d="M58 18 Q78 26 98 18 Q116 12 134 20 Q150 28 168 20" stroke="#C9A84C" strokeWidth="1" fill="none" opacity="0.75"/>
          <path d="M18 58 Q26 78 18 98 Q12 116 20 134 Q28 150 20 168" stroke="#C9A84C" strokeWidth="1" fill="none" opacity="0.75"/>
          <circle cx="98"  cy="18"  r="5" fill="none" stroke="#C9A84C" strokeWidth="0.9" opacity="0.7"/>
          <circle cx="98"  cy="18"  r="2" fill="#C9A84C" opacity="0.35"/>
          <circle cx="134" cy="21"  r="3.5" fill="none" stroke="#C9A84C" strokeWidth="0.9" opacity="0.55"/>
          <circle cx="18"  cy="98"  r="5" fill="none" stroke="#C9A84C" strokeWidth="0.9" opacity="0.7"/>
          <circle cx="18"  cy="98"  r="2" fill="#C9A84C" opacity="0.35"/>
          <circle cx="21"  cy="134" r="3.5" fill="none" stroke="#C9A84C" strokeWidth="0.9" opacity="0.55"/>
        </g>
      ))}
      <path d="M180 18 Q200 28 220 18 Q240 10 260 20 Q280 28 300 18 Q320 10 340 20 Q360 28 380 18 Q400 10 420 20 Q450 28 480 18 Q510 10 540 20 Q570 28 600 18 Q630 10 660 20 Q690 28 720 18 Q750 10 780 20 Q810 28 840 18 Q870 10 900 20 Q930 28 960 18 Q990 10 1020 20 Q1050 28 1080 18 Q1110 10 1140 20 Q1170 28 1200 18 Q1230 10 1260 20 Q1290 28 1320 18" stroke="#C9A84C" strokeWidth="0.9" fill="none" opacity="0.5"/>
      <path d="M180 742 Q200 732 220 742 Q240 750 260 740 Q280 732 300 742 Q320 750 340 740 Q360 732 380 742 Q400 750 420 740 Q450 732 480 742 Q510 750 540 740 Q570 732 600 742 Q630 750 660 740 Q690 732 720 742 Q750 750 780 740 Q810 732 840 742 Q870 750 900 740 Q930 732 960 742 Q990 750 1020 740 Q1050 732 1080 742 Q1110 750 1140 740 Q1170 732 1200 742 Q1230 750 1260 740 Q1290 732 1320 742" stroke="#C9A84C" strokeWidth="0.9" fill="none" opacity="0.5"/>
      {roseX.map((x,i) => (
        <g key={`t${i}`}>
          <circle cx={x} cy="18"  r="3.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.55"/>
          <circle cx={x} cy="18"  r="1.2" fill="#C9A84C" opacity="0.4"/>
          <circle cx={x} cy="742" r="3.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.55"/>
          <circle cx={x} cy="742" r="1.2" fill="#C9A84C" opacity="0.4"/>
        </g>
      ))}
      {roseY.map((y,i) => (
        <g key={`s${i}`}>
          <circle cx="18"   cy={y} r="3" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.45"/>
          <circle cx="18"   cy={y} r="1" fill="#C9A84C" opacity="0.3"/>
          <circle cx="1348" cy={y} r="3" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.45"/>
          <circle cx="1348" cy={y} r="1" fill="#C9A84C" opacity="0.3"/>
        </g>
      ))}
      <line x1="683" y1="22" x2="683" y2="738" stroke="#C9A84C" strokeWidth="0.9" opacity="0.35" strokeDasharray="5 7"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ name:'', email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

async function handleSubmit(e) {
  e.preventDefault(); setError('')
  if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
  if (mode==='signup' && !form.name.trim()) { setError('Please enter your name.'); return }
  
  setLoading(true)
    const result = mode==='signup'
    ? await signup({ name:form.name.trim(), email:form.email.trim(), password:form.password })
    : await login({ email:form.email.trim(), password:form.password })
  
  setLoading(false)
  
  if (result.error) { 
    setError(result.error); 
    return; 
  }
  
  onClose(); 
  navigate('/dashboard')
}

  const inputStyle = {
    width:'100%', padding:'10px 14px', borderRadius:8,
    background:'rgba(255,255,255,0.75)', border:'1px solid rgba(201,168,76,0.35)',
    color:'#2C1810', fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box',
  }
  const labelStyle = {
    fontSize:11, fontWeight:600, color:'#5A3825', textTransform:'uppercase',
    letterSpacing:'0.1em', fontFamily:'Inter,sans-serif', display:'block', marginBottom:6,
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div
        style={{ position:'absolute', inset:0, background:'rgba(44,13,24,0.72)', backdropFilter:'blur(6px)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={onClose}
      />
      <motion.div
        style={{
          position:'relative', zIndex:1, width:'100%', maxWidth:360, overflow:'hidden',
          background:'linear-gradient(160deg,#FAF7F0,#F0E8D4)', borderRadius:16,
          border:'1px solid rgba(201,168,76,0.4)', boxShadow:'0 24px 60px rgba(44,13,24,0.4)',
        }}
        initial={{ opacity:0, y:32, scale:0.95 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}
      >
        <div style={{ height:3, background:'linear-gradient(to right,#7B2340,#C9A84C,#C47D3E,#C9A84C,#7B2340)' }}/>
        <div style={{ padding:'28px 32px' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
            <div style={{ position:'relative', width:36, height:36, marginBottom:12 }}>
              <div style={{ position:'absolute', inset:0, transform:'rotate(45deg)', borderRadius:4, background:'#7B2340' }}/>
              <div style={{ position:'absolute', inset:6, transform:'rotate(45deg)', borderRadius:3, background:'#C9A84C' }}/>
            </div>
            <h2 style={{ fontFamily:'Playfair Display,serif', color:'#5C1A2E', fontSize:22, fontWeight:700, margin:0 }}>
              {mode==='login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize:12, color:'#8B6B52', fontFamily:'Inter,sans-serif', margin:'4px 0 0' }}>
              {mode==='login' ? 'Sign in to your planning space' : 'Your private event planning space'}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(to right,transparent,#C9A84C)' }}/>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#C9A84C"><path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75Z"/></svg>
            <div style={{ flex:1, height:1, background:'linear-gradient(to left,transparent,#C9A84C)' }}/>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {mode==='signup' && (
              <div><label style={labelStyle}>Full Name</label><input type="text" value={form.name} onChange={set('name')} placeholder="Your name" style={inputStyle}/></div>
            )}
            <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" style={inputStyle}/></div>
            <div><label style={labelStyle}>Password</label><input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" style={inputStyle}/></div>
            {error && (
              <div style={{ background:'rgba(139,26,74,0.08)', border:'1px solid rgba(139,26,74,0.25)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#8B1A4A', fontFamily:'Inter,sans-serif' }}>
                {error}
              </div>
            )}
            <motion.button
              type="submit" disabled={loading} whileTap={{ scale:0.97 }}
              style={{
                width:'100%', padding:'11px 0', borderRadius:8, marginTop:4,
                background:'linear-gradient(135deg,#7B2340,#5C1A2E)', color:'#F5EDD8',
                fontSize:14, fontWeight:600, fontFamily:'Inter,sans-serif',
                border:'none', cursor:loading?'not-allowed':'pointer', opacity:loading?0.6:1,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}
            >
              {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {mode==='login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>
          <p style={{ textAlign:'center', fontSize:12, color:'#8B6B52', fontFamily:'Inter,sans-serif', marginTop:14 }}>
            {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={onSwitch} style={{ color:'#C47D3E', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontSize:12 }}>
              {mode==='login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────────────────────────────────────
function FeatureCard({ image, title, description }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.3s ease',
      cursor: 'default', height: '100%', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#f5f0e6' }}>
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#5C1A2E', fontWeight: 600, margin: '0 0 12px 0' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#8B6B52', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [authMode, setAuthMode] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const leftBirdVariants = {
    hidden:  { x:'-130%', y:'20%', opacity:0, rotate:-6 },
    visible: { x:'0%', y:'0%', opacity:1, rotate:0, transition:{ duration:1.5, ease:[0.22,1,0.36,1], delay:0.4 } },
  }
  const rightBirdVariants = {
    hidden:  { x:'130%', y:'15%', opacity:0, rotate:6 },
    visible: { x:'0%', y:'0%', opacity:1, rotate:0, transition:{ duration:1.5, ease:[0.22,1,0.36,1], delay:0.6 } },
  }
  const floatLeft  = { y:[0,-14,0], rotate:[0, 2,0], transition:{ duration:4.2, ease:'easeInOut', repeat:Infinity } }
  const floatRight = { y:[0,-11,0], rotate:[0,-2,0], transition:{ duration:4.8, ease:'easeInOut', repeat:Infinity, delay:0.7 } }

  const featureCards = [
    { image: '/assets/plan-events.jfif',    title: 'Plan Events',     description: 'Walima, mehndi, birthdays — all in one place.' },
    { image: '/assets/guest-lists.jfif',    title: 'Guest Lists',     description: 'Add guests and manage invitees effortlessly.' },
    { image: '/assets/budget-tracker.jfif', title: 'Budget Tracker',  description: 'Log expenses and stay within your budget.' },
    { image: '/assets/vendors.jfif',        title: 'Your Vendors',    description: 'Save your own trusted vendors per event.' },
    { image: '/assets/invitations.jfif',    title: 'Invitations',     description: 'Design and download beautiful invite cards.' },
  ]

  const navIcons = [
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label:'Events' },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, label:'Guests' },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, label:'Budget' },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:'Invite' },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="1.6" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label:'Vendors' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#e6d0a3', fontFamily:'Playfair Display,serif', overflowX:'hidden' }}>

      {/* Inject responsive styles */}
      <style>{responsiveStyles}</style>

      {/* ══════════════════════ TOP NAV BAR ══════════════════════════════════ */}
      <motion.header
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease:'easeOut' }}
        style={{
          background:'#e6d0a3', borderBottom:'1px solid rgba(201,168,76,0.28)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 28px', height:64, position:'relative',
        }}
      >
        {/* Left — feature icons (hidden on mobile) */}
        <div className="landing-nav-icons" style={{ display:'flex', alignItems:'center', gap:6 }}>
          {navIcons.map(({ icon, label }) => (
            <button key={label} onClick={() => setAuthMode('login')}
              style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'4px 6px', borderRadius:6 }}>
              {icon}
              <span style={{ fontSize:9, color:'#8B6B52', fontFamily:'Inter,sans-serif', letterSpacing:'0.04em' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Mobile hamburger (visible only on mobile via CSS) */}
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'none' }}
          className="landing-hamburger"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B2340" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Center — wordmark */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
          <h1 className="landing-wordmark" style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(20px,2.5vw,30px)', fontWeight:700, color:'#3D1A0F', margin:0, letterSpacing:'0.04em' }}>
            EventEase
          </h1>
        </div>

        {/* Right — auth buttons */}
        <div className="landing-auth-btns" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <motion.button
            onClick={() => setAuthMode('login')} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            className="signin-btn"
            style={{ padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer', background:'transparent', border:'1px solid rgba(123,35,64,0.45)', color:'#7B2340' }}
          >Sign In</motion.button>
          <motion.button
            onClick={() => setAuthMode('signup')} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            className="signup-btn"
            style={{ padding:'8px 20px', borderRadius:6, fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif', cursor:'pointer', background:'linear-gradient(135deg,#7B2340,#5C1A2E)', border:'none', color:'#F5EDD8', boxShadow:'0 2px 10px rgba(92,26,46,0.3)' }}
          >Sign Up Free</motion.button>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <style>{`
        @media (max-width: 768px) {
          .landing-hamburger { display: block !important; }
        }
      `}</style>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            style={{ background:'#e6d0a3', borderBottom:'1px solid rgba(201,168,76,0.28)', overflow:'hidden', zIndex:40, position:'relative' }}
          >
            <div style={{ padding:'12px 24px', display:'flex', flexDirection:'column', gap:4 }}>
              {navIcons.map(({ icon, label }) => (
                <button key={label} onClick={() => { setAuthMode('login'); setMobileMenuOpen(false) }}
                  style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(201,168,76,0.15)' }}>
                  {icon}
                  <span style={{ fontSize:14, color:'#5C1A2E', fontFamily:'Inter,sans-serif', fontWeight:500 }}>{label}</span>
                </button>
              ))}
              <button onClick={() => { setAuthMode('login'); setMobileMenuOpen(false) }}
                style={{ marginTop:8, padding:'10px', borderRadius:6, background:'transparent', border:'1px solid rgba(123,35,64,0.45)', color:'#7B2340', fontFamily:'Inter,sans-serif', fontWeight:500, fontSize:14, cursor:'pointer' }}>
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════ HERO ══════════════════════════════════════ */}
      <div className="landing-hero-aspect" style={{ position:'relative', width:'100%', aspectRatio:'1366/760', maxHeight:'calc(100vh - 64px)', overflow:'hidden' }}>

        <img src="/assets/hero-bg.png" alt="" draggable="false" className="landing-hero-img"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block', userSelect:'none' }}
        />

        <OrnamentalBorder />

        {/* LEFT DOVE */}
        <div className="landing-dove-left" style={{ position:'absolute', top:'0.2%', left:'-10%', width:'clamp(396px,61.6%,836px)', zIndex:10, pointerEvents:'none' }}>
          <motion.div variants={leftBirdVariants} initial="hidden" animate="visible">
            <motion.img src="/assets/dove-left.png" alt="" animate={floatLeft}
              style={{ width:'100%', display:'block', mixBlendMode:'screen', filter:'brightness(1.08) contrast(1.05)' }}
            />
          </motion.div>
        </div>

        {/* RIGHT DOVE */}
        <div className="landing-dove-right" style={{ position:'absolute', bottom:'-3%', right:'-3%', width:'clamp(342px,53.2%,722px)', zIndex:10, pointerEvents:'none' }}>
          <motion.div variants={rightBirdVariants} initial="hidden" animate="visible">
            <motion.img src="/assets/dove-right.png" alt="" animate={floatRight}
              style={{ width:'100%', display:'block', mixBlendMode:'screen', filter:'brightness(1.08) contrast(1.05)' }}
            />
          </motion.div>
        </div>

        {/* LEFT PANEL TEXT */}
        <motion.div
          className="landing-hero-left"
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:1, ease:[0.22,1,0.36,1], delay:0.9 }}
          style={{ position:'absolute', bottom:'10%', left:'5%', zIndex:20, maxWidth:'40%' }}
        >
          <p className="landing-hero-eyebrow" style={{ fontSize:'clamp(10px,1.1vw,13px)', color:'rgba(232,213,163,0.75)', fontFamily:'Inter,sans-serif', fontWeight:300, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:8 }}>
            Your Planner
          </p>
          <h2 className="landing-hero-h2" style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(26px,4.5vw,58px)', fontWeight:700, color:'#E8D5A3', lineHeight:1.12, marginBottom:22 }}>
            Plan Every<br/>Celebration
          </h2>
          <div style={{ width:56, height:2, background:'linear-gradient(to right,#C9A84C,transparent)', marginBottom:22 }}/>
          <div className="landing-hero-btns" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <motion.button
              onClick={() => setAuthMode('signup')}
              whileHover={{ scale:1.04, boxShadow:'0 6px 24px rgba(201,168,76,0.45)' }} whileTap={{ scale:0.97 }}
              style={{ padding:'10px 26px', borderRadius:6, fontSize:'clamp(11px,1.1vw,14px)', fontWeight:600, fontFamily:'Inter,sans-serif', cursor:'pointer', background:'linear-gradient(135deg,#C9A84C,#C47D3E)', border:'none', color:'#2C0D18', boxShadow:'0 4px 16px rgba(201,168,76,0.35)' }}
            >Start Planning Free</motion.button>
            <motion.button
              onClick={() => setAuthMode('login')}
              whileHover={{ scale:1.02, background:'rgba(201,168,76,0.14)' }} whileTap={{ scale:0.97 }}
              style={{ padding:'10px 22px', borderRadius:6, fontSize:'clamp(11px,1.1vw,14px)', fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer', background:'rgba(201,168,76,0.07)', border:'1px solid rgba(201,168,76,0.5)', color:'#E8D5A3' }}
            >Sign In</motion.button>
          </div>
        </motion.div>

        {/* RIGHT PANEL TEXT (hidden on mobile) */}
        <motion.div
          className="landing-hero-right"
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:2, ease:[0.22,1,0.36,1], delay:1.5 }}
          style={{ position:'absolute', top:'12%', right:'5%', zIndex:20, maxWidth:'38%', textAlign:'right' }}
        >
          <p style={{ fontSize:'clamp(10px,1.1vw,13px)', color:'rgba(232,213,163,0.7)', fontFamily:'Inter,sans-serif', fontWeight:300, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:8 }}>
            Everything you need
          </p>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,4vw,52px)', fontWeight:700, color:'#E8D5A3', lineHeight:1.18, marginBottom:24 }}>
            All Your Events,<br/>One Place
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
            {[['','Beautiful invitations'],['','Expense tracking'],['','Guest list management'],['','Your own vendors']].map(([icon,text]) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:'clamp(11px,1vw,13px)', color:'rgba(232,213,163,0.85)', fontFamily:'Inter,sans-serif', fontWeight:300 }}>{text}</span>
                <span style={{ fontSize:'clamp(14px,1.5vw,18px)' }}>{icon}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════ FEATURES ══════════════════════════════════ */}
      <motion.section
        className="landing-features-section"
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true, margin:'-80px' }}
        transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
        style={{ background:'#e6d0a3', padding:'64px 40px' }}
      >
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:11, color:'#C47D3E', fontFamily:'Inter,sans-serif', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10 }}>Why EventEase</p>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(22px,3vw,34px)', color:'#5C1A2E', fontWeight:700, marginBottom:16 }}>Plan with Purpose</h2>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
              <div style={{ width:60, height:1, background:'linear-gradient(to right,transparent,#C9A84C)' }}/>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="#C9A84C"><path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75Z"/></svg>
              <div style={{ width:60, height:1, background:'linear-gradient(to left,transparent,#C9A84C)' }}/>
            </div>
          </div>
          <div className="landing-features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:30, justifyContent:'center' }}>
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.5, delay:index * 0.08 }}
                whileHover={{ y:-8 }}
              >
                <FeatureCard image={card.image} title={card.title} description={card.description}/>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════ CTA BANNER ════════════════════════════════ */}
      <motion.section
        className="landing-cta-section"
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        viewport={{ once:true }} transition={{ duration:0.7 }}
        style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#2C0D18,#5C1A2E,#7B2340)', padding:'60px 40px', textAlign:'center' }}
      >
        <div style={{ position:'absolute', inset:0, opacity:0.05, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A84C' stroke-width='0.5'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/svg%3E\")", backgroundSize:'60px 60px' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:580, margin:'0 auto' }}>
          <p style={{ fontFamily:'Amiri,serif', fontSize:30, color:'#C9A84C', marginBottom:14, opacity:0.85 }}>بِسْمِ اللَّهِ</p>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(20px,2.8vw,30px)', color:'#FAF7F2', fontWeight:700, marginBottom:12 }}>Start Planning Your Next Celebration</h2>
          <p style={{ fontSize:14, color:'rgba(232,213,163,0.72)', fontFamily:'Inter,sans-serif', fontWeight:300, marginBottom:28 }}>Free to use. Private to you. Built for Pakistani celebrations.</p>
          <motion.button
            onClick={() => setAuthMode('signup')}
            whileHover={{ scale:1.04, boxShadow:'0 8px 32px rgba(201,168,76,0.45)' }} whileTap={{ scale:0.97 }}
            style={{ padding:'13px 40px', borderRadius:8, fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif', cursor:'pointer', background:'linear-gradient(135deg,#C9A84C,#C47D3E)', border:'none', color:'#2C0D18', boxShadow:'0 4px 20px rgba(201,168,76,0.32)' }}
          >Create Your Free Account</motion.button>
        </div>
      </motion.section>

      {/* ══════════════════════ FOOTER ════════════════════════════════════ */}
      <footer className="landing-footer" style={{ background:'#e6d0a3', borderTop:'1px solid rgba(201,168,76,0.22)', padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {/* Replace the colored div with actual icon */}
          <img 
            src="/icon1.png" 
            alt="EventEase" 
            style={{ 
              width: 24, 
              height: 24, 
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Failed to load icon in landing footer')
              e.target.style.display = 'none'
            }}
            onLoad={() => {
              console.log('Landing footer icon loaded successfully!')
            }}
          />
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:14, fontWeight:700, color:'#5C1A2E' }}>
            Event<span style={{ color:'#C47D3E' }}>Ease</span>
          </span>
        </div>
        <p style={{ fontSize:11, color:'#8B6B52', fontFamily:'Inter,sans-serif' }}>Ayka Imran & Maryam Irshad · 2026</p>
        <p style={{ fontSize:11, color:'#C9A84C', fontFamily:'Inter,sans-serif' }}>v1.0 ✦ 2026</p>
      </footer>

      {/* ══════════════════════ AUTH MODAL ════════════════════════════════ */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={() => setAuthMode(m => m==='login' ? 'signup' : 'login')}
        />
      )}
    </div>
  )
}
