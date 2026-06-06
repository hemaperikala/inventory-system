import { useState, useEffect } from 'react'
import axios from 'axios'
const API = 'https://inventory-system-k8a4.onrender.com'
const init = { name:'', email:'', phone:'' }
const colors = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#f97316']

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(init)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => axios.get(`${API}/customers/`).then(r=>setCustomers(r.data)).catch(()=>{})
  useEffect(()=>{load()},[])

  const submit = async()=>{
    setError(''); setSuccess('')
    if(!form.name||!form.email){setError('Name and Email are required');return}
    try{
      if(editId){await axios.put(`${API}/customers/${editId}`,{name:form.name,phone:form.phone});setSuccess('Customer updated!')}
      else{await axios.post(`${API}/customers/`,form);setSuccess('Customer added!')}
      setForm(init); setEditId(null); load()
    }catch(e){setError(e.response?.data?.detail||'Error occurred')}
  }

  const del=async(id)=>{if(confirm('Delete this customer?')){await axios.delete(`${API}/customers/${id}`);load()}}
  const edit=(c)=>{setForm({name:c.name,email:c.email,phone:c.phone||''});setEditId(c.id);window.scrollTo(0,0)}
  const initials=(name)=>name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
  const filtered=customers.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{marginBottom:'28px'}}>
        <div className="page-title">👥 Customers</div>
        <div className="page-sub">{customers.length} registered customers</div>
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px'}}>{editId?'✏️ Edit Customer':'➕ Add New Customer'}</div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'14px', alignItems:'flex-end'}}>
          <div><label className="label">Full Name *</label><input placeholder="John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
          <div><label className="label">Email Address *</label><input placeholder="john@email.com" value={form.email} disabled={!!editId} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          <div><label className="label">Phone Number</label><input placeholder="+91 99999 99999" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div style={{display:'flex', gap:'8px'}}>
            <button onClick={submit} className="btn btn-success" style={{padding:'12px 20px', whiteSpace:'nowrap'}}>{editId?'Update':'Add'}</button>
            {editId && <button onClick={()=>{setForm(init);setEditId(null)}} className="btn btn-ghost" style={{padding:'12px'}}>✕</button>}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0'}}>All Customers <span style={{color:'#475569', fontWeight:'400'}}>({filtered.length})</span></div>
          <input placeholder="🔍 Search customers..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'220px'}} />
        </div>
        <table>
          <thead><tr>{['Customer','Email','Phone','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((c,i)=>(
            <tr key={c.id}>
              <td>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'38px', height:'38px', borderRadius:'50%', background:colors[i%colors.length]+'25', border:`2px solid ${colors[i%colors.length]}50`, display:'flex', alignItems:'center', justifyContent:'center', color:colors[i%colors.length], fontWeight:'700', fontSize:'13px', flexShrink:0}}>
                    {initials(c.name)}
                  </div>
                  <div style={{fontWeight:'600', color:'#e2e8f0'}}>{c.name}</div>
                </div>
              </td>
              <td style={{color:'#a5b4fc'}}>{c.email}</td>
              <td style={{color:'#64748b'}}>{c.phone||'—'}</td>
              <td>
                <div style={{display:'flex', gap:'8px'}}>
                  <button onClick={()=>edit(c)} className="btn btn-warning" style={{padding:'7px 14px', fontSize:'13px'}}>Edit</button>
                  <button onClick={()=>del(c.id)} className="btn btn-danger" style={{padding:'7px 14px', fontSize:'13px'}}>Delete</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0&&<div style={{textAlign:'center',padding:'48px',color:'#334155'}}>
          <div style={{fontSize:'40px', marginBottom:'12px'}}>👥</div>
          <div>No customers yet. Add your first customer above!</div>
        </div>}
      </div>
    </div>
  )
}
