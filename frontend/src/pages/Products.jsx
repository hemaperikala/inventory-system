import { useState, useEffect } from 'react'
import axios from 'axios'
const API = 'http://127.0.0.1:8000'
const init = { name:'', sku:'', description:'', price:'', stock:'' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(init)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => axios.get(`${API}/products/`).then(r=>setProducts(r.data)).catch(()=>setError('Cannot connect to backend. Make sure uvicorn is running!'))
  useEffect(()=>{load()},[])

  const submit = async()=>{
    setError(''); setSuccess('')
    if(!form.name||!form.sku||!form.price||!form.stock){setError('Please fill Name, SKU, Price and Stock fields');return}
    try{
      if(editId){
        await axios.put(`${API}/products/${editId}`,{name:form.name,description:form.description,price:+form.price,stock:+form.stock})
        setSuccess('Product updated successfully!')
      }else{
        await axios.post(`${API}/products/`,{...form,price:+form.price,stock:+form.stock})
        setSuccess('Product added successfully!')
      }
      setForm(init); setEditId(null); load()
    }catch(e){setError(e.response?.data?.detail||'Error: Make sure backend is running on port 8000')}
  }

  const del=async(id)=>{if(confirm('Delete this product?')){await axios.delete(`${API}/products/${id}`);load()}}
  const edit=(p)=>{setForm({name:p.name,sku:p.sku,description:p.description||'',price:p.price,stock:p.stock});setEditId(p.id);window.scrollTo(0,0)}
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.sku.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{marginBottom:'28px'}}>
        <div className="page-title">📦 Products</div>
        <div className="page-sub">{products.length} products in inventory</div>
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px'}}>{editId?'✏️ Edit Product':'➕ Add New Product'}</div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px', marginBottom:'14px'}}>
          <div><label className="label">Product Name *</label><input placeholder="e.g. Rice Bag 5kg" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
          <div><label className="label">SKU *</label><input placeholder="e.g. RICE-001" value={form.sku} disabled={!!editId} onChange={e=>setForm({...form,sku:e.target.value})} /></div>
          <div><label className="label">Description</label><input placeholder="Optional description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div><label className="label">Price (₹) *</label><input type="number" placeholder="0.00" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
          <div><label className="label">Stock Quantity *</label><input type="number" placeholder="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} /></div>
          <div style={{display:'flex', gap:'8px', alignItems:'flex-end'}}>
            <button onClick={submit} className="btn btn-primary" style={{flex:1, padding:'12px'}}>{editId?'Update Product':'Add Product'}</button>
            {editId && <button onClick={()=>{setForm(init);setEditId(null);setError('');setSuccess('')}} className="btn btn-ghost" style={{padding:'12px 16px'}}>✕</button>}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0'}}>All Products <span style={{color:'#475569', fontWeight:'400'}}>({filtered.length})</span></div>
          <input placeholder="🔍 Search by name or SKU..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'240px'}} />
        </div>
        <table>
          <thead><tr>{['Product','SKU','Price','Stock','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p=>(
            <tr key={p.id}>
              <td>
                <div style={{fontWeight:'600', color:'#e2e8f0'}}>{p.name}</div>
                <div style={{fontSize:'12px', color:'#475569', marginTop:'2px'}}>{p.description||'No description'}</div>
              </td>
              <td><span className="badge badge-info">{p.sku}</span></td>
              <td style={{fontWeight:'700', color:'#34d399', fontSize:'15px'}}>₹{p.price}</td>
              <td><span className={`badge ${p.stock>5?'badge-success':'badge-danger'}`}>{p.stock} units</span></td>
              <td>
                <div style={{display:'flex', gap:'8px'}}>
                  <button onClick={()=>edit(p)} className="btn btn-warning" style={{padding:'7px 14px', fontSize:'13px'}}>Edit</button>
                  <button onClick={()=>del(p.id)} className="btn btn-danger" style={{padding:'7px 14px', fontSize:'13px'}}>Delete</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0&&<div style={{textAlign:'center',padding:'48px',color:'#334155'}}>
          <div style={{fontSize:'40px', marginBottom:'12px'}}>📦</div>
          <div>No products found. Add your first product above!</div>
        </div>}
      </div>
    </div>
  )
}