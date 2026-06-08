import { useState, useEffect } from 'react'
import axios from 'axios'
const API = 'https://inventory-system-k8a4.onrender.com'

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState({ products:0, customers:0, orders:0, revenue:0 })
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/products/`),
      axios.get(`${API}/customers/`),
      axios.get(`${API}/orders/`)
    ]).then(([p,c,o]) => {
      const rev = o.data.reduce((s,x) => s+(x.total_price||0), 0)
      setStats({ products:p.data.length, customers:c.data.length, orders:o.data.length, revenue:rev })
      setLowStock(p.data.filter(x => x.stock <= 5))
    }).catch(()=>{})
  }, [])

  const cards = [
    { label:'Total Products', page:'products', value:stats.products, icon:'📦', accent:'#6366f1', glow:'rgba(99,102,241,0.3)', bg:'rgba(99,102,241,0.1)' },
    { label:'Total Customers', page:'customers', value:stats.customers, icon:'👥', accent:'#10b981', glow:'rgba(16,185,129,0.3)', bg:'rgba(16,185,129,0.1)' },
    { label:'Total Orders', page:'orders', value:stats.orders, icon:'🛒', accent:'#f59e0b', glow:'rgba(245,158,11,0.3)', bg:'rgba(245,158,11,0.1)' },
    { label:'Total Revenue', page:'orders', value:`₹${stats.revenue.toFixed(0)}`, icon:'💰', accent:'#06b6d4', glow:'rgba(6,182,212,0.3)', bg:'rgba(6,182,212,0.1)' },
  ]

  return (
    <div>
      <div style={{marginBottom:'32px'}}>
        <div className="page-title">Welcome back! 👋</div>
        <div className="page-sub">Here's your inventory overview for today</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px'}}>
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{'--accent':c.accent,'--glow':c.glow}}
            onClick={() => setPage(c.page)}>
            <div className="icon-box" style={{background:c.bg, fontSize:'24px'}}>{c.icon}</div>
            <div style={{fontSize:'32px', fontWeight:'800', color:c.accent, letterSpacing:'-1px'}}>{c.value}</div>
            <div style={{fontSize:'13px', color:'#475569', marginTop:'4px', fontWeight:'500'}}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        <div className="card">
          <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
            <span style={{fontSize:'18px'}}>⚡</span> Quick Actions
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {[
              ['products','📦 Add New Product','#6366f1','rgba(99,102,241,0.1)'],
              ['customers','👥 Add New Customer','#10b981','rgba(16,185,129,0.1)'],
              ['orders','🛒 Place New Order','#f59e0b','rgba(245,158,11,0.1)'],
            ].map(([p,l,c,bg]) => (
              <button key={p} onClick={() => setPage(p)} className="btn"
                style={{background:bg, color:c, border:`1px solid ${c}40`, textAlign:'left', padding:'14px 18px', borderRadius:'12px', fontSize:'14px', fontWeight:'600', transition:'all 0.3s'}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
            <span style={{fontSize:'18px'}}>⚠️</span> Low Stock Alert
            {lowStock.length > 0 && <span className="badge badge-danger" style={{marginLeft:'auto'}}>{lowStock.length} items</span>}
          </div>
          {lowStock.length === 0
            ? <div style={{textAlign:'center', padding:'24px', color:'#334155'}}>
                <div style={{fontSize:'32px', marginBottom:'8px'}}>✅</div>
                <div style={{fontSize:'14px'}}>All products have sufficient stock!</div>
              </div>
            : lowStock.map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div>
                  <div style={{fontSize:'14px', fontWeight:'600', color:'#e2e8f0'}}>{p.name}</div>
                  <div style={{fontSize:'12px', color:'#475569'}}>SKU: {p.sku}</div>
                </div>
                <span className="badge badge-danger">Only {p.stock} left</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}