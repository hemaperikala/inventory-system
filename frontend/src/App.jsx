import { useState } from 'react'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import './App.css'

const nav = [
  { id:'dashboard', label:'Dashboard', icon:'⚡' },
  { id:'products', label:'Products', icon:'📦' },
  { id:'customers', label:'Customers', icon:'👥' },
  { id:'orders', label:'Orders', icon:'🛒' },
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  return (
    <div style={{display:'flex', minHeight:'100vh', position:'relative'}}>

      {/* Hamburger button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position:'fixed', top:'16px', left:'16px', zIndex:1000,
          background:'rgba(30,27,60,0.95)', border:'1px solid rgba(99,102,241,0.3)',
          borderRadius:'10px', width:'40px', height:'40px',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:'5px', cursor:'pointer',
          backdropFilter:'blur(10px)', transition:'all 0.2s'
        }}
      >
        <span style={{width:'18px', height:'2px', background:'#e2e8f0', borderRadius:'2px', transition:'all 0.3s',
          transform: sidebarOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}}></span>
        <span style={{width:'18px', height:'2px', background:'#e2e8f0', borderRadius:'2px', transition:'all 0.3s',
          opacity: sidebarOpen ? 0 : 1}}></span>
        <span style={{width:'18px', height:'2px', background:'#e2e8f0', borderRadius:'2px', transition:'all 0.3s',
          transform: sidebarOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'}}></span>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
            zIndex:998, backdropFilter:'blur(2px)',
            animation:'fadeIn 0.2s ease'
          }}
        />
      )}

      {/* Sidebar */}
      <nav className="sidebar" style={{
        position:'fixed', top:0, left:0, height:'100vh', zIndex:999,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: sidebarOpen ? '4px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{marginBottom:'32px', padding:'0 4px', marginTop:'8px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div className="logo-box">📦</div>
            <div>
              <div style={{fontWeight:'800', fontSize:'15px', color:'#e2e8f0', letterSpacing:'-0.3px'}}>InvenPro</div>
              <div style={{fontSize:'11px', color:'#64748b', fontWeight:'500'}}>Management System</div>
            </div>
            {/* Close button inside sidebar */}
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                marginLeft:'auto', background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px',
                width:'28px', height:'28px', cursor:'pointer', color:'#94a3b8',
                fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center'
              }}
            >✕</button>
          </div>
        </div>

        <div style={{fontSize:'11px', color:'#334155', fontWeight:'700', padding:'0 14px', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.1em'}}>Navigation</div>

        {nav.map(n => (
          <button key={n.id} onClick={() => navigate(n.id)} className={`nav-btn ${page===n.id?'active':''}`}>
            <span style={{fontSize:'18px'}}>{n.icon}</span>
            <span>{n.label}</span>
            {page===n.id && <span style={{marginLeft:'auto', width:'6px', height:'6px', borderRadius:'50%', background:'#6366f1', boxShadow:'0 0 8px #6366f1'}}></span>}
          </button>
        ))}

        <div style={{marginTop:'auto', padding:'16px', background:'rgba(99,102,241,0.05)', borderRadius:'14px', border:'1px solid rgba(99,102,241,0.15)'}}>
          <div style={{fontSize:'11px', color:'#475569', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em'}}>System Status</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981'}}></div>
            <span style={{fontSize:'13px', color:'#34d399', fontWeight:'600'}}>API Running: Live</span>
          </div>
          <div style={{fontSize:'11px', color:'#334155', marginTop:'6px'}}>FastAPI + PostgreSQL</div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main" style={{marginLeft:0, width:'100%', paddingTop:'64px'}}>
        <div className="page-enter" key={page}>
          {page === 'dashboard' && <Dashboard setPage={setPage} />}
          {page === 'products' && <Products />}
          {page === 'customers' && <Customers />}
          {page === 'orders' && <Orders />}
        </div>
      </main>
    </div>
  )
}