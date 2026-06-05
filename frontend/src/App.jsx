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
  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <nav className="sidebar">
        <div style={{marginBottom:'32px', padding:'0 4px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div className="logo-box">📦</div>
            <div>
              <div style={{fontWeight:'800', fontSize:'15px', color:'#e2e8f0', letterSpacing:'-0.3px'}}>InvenPro</div>
              <div style={{fontSize:'11px', color:'#334155', fontWeight:'500'}}>Management System</div>
            </div>
          </div>
        </div>

        <div style={{fontSize:'11px', color:'#334155', fontWeight:'700', padding:'0 14px', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.1em'}}>Navigation</div>

        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} className={`nav-btn ${page===n.id?'active':''}`}>
            <span style={{fontSize:'18px'}}>{n.icon}</span>
            <span>{n.label}</span>
            {page===n.id && <span style={{marginLeft:'auto', width:'6px', height:'6px', borderRadius:'50%', background:'#6366f1', boxShadow:'0 0 8px #6366f1'}}></span>}
          </button>
        ))}

        <div style={{marginTop:'auto', padding:'16px', background:'rgba(99,102,241,0.05)', borderRadius:'14px', border:'1px solid rgba(99,102,241,0.15)'}}>
          <div style={{fontSize:'11px', color:'#475569', fontWeight:'600', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em'}}>System Status</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981', animation:'pulse-glow 2s infinite'}}></div>
            <span style={{fontSize:'13px', color:'#34d399', fontWeight:'600'}}>API Running :8000</span>
          </div>
          <div style={{fontSize:'11px', color:'#334155', marginTop:'6px'}}>FastAPI + PostgreSQL</div>
        </div>
      </nav>

      <main className="main">
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