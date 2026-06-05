import { useState, useEffect } from 'react'
import axios from 'axios'
const API = 'http://127.0.0.1:8000'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({customer_id:'',product_id:'',quantity:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load=()=>Promise.all([
    axios.get(`${API}/orders/`),
    axios.get(`${API}/products/`),
    axios.get(`${API}/customers/`)
  ]).then(([o,p,c])=>{setOrders(o.data);setProducts(p.data);setCustomers(c.data)}).catch(()=>{})

  useEffect(()=>{load()},[])

  const submit=async()=>{
    setError('');setSuccess('')
    if(!form.customer_id||!form.product_id||!form.quantity){setError('Please fill all fields');return}
    try{
      await axios.post(`${API}/orders/`,{customer_id:+form.customer_id,product_id:+form.product_id,quantity:+form.quantity})
      setSuccess('Order placed! Stock automatically updated.')
      setForm({customer_id:'',product_id:'',quantity:''}); load()
    }catch(e){setError(e.response?.data?.detail||'Error occurred')}
  }

  const del=async(id)=>{if(confirm('Cancel this order?')){await axios.delete(`${API}/orders/${id}`);load()}}
  const getName=(list,id)=>list.find(x=>x.id===id)?.name||`#${id}`
  const selected=products.find(p=>p.id===+form.product_id)
  const total=selected&&form.quantity?(selected.price*+form.quantity).toFixed(2):null

  return (
    <div>
      <div style={{marginBottom:'28px'}}>
        <div className="page-title">🛒 Orders</div>
        <div className="page-sub">{orders.length} total orders placed</div>
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px'}}>➕ Place New Order</div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px', marginBottom:'14px'}}>
          <div>
            <label className="label">Customer *</label>
            <select value={form.customer_id} onChange={e=>setForm({...form,customer_id:e.target.value})}>
              <option value="">Select Customer</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Product *</label>
            <select value={form.product_id} onChange={e=>setForm({...form,product_id:e.target.value})}>
              <option value="">Select Product</option>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} — Stock: {p.stock}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quantity *</label>
            <input type="number" min="1" placeholder="Enter quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          </div>
        </div>
        {total && (
          <div style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'12px', padding:'16px 20px', marginBottom:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:'12px', color:'#475569', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Order Total</div>
              <div style={{fontSize:'11px', color:'#334155', marginTop:'2px'}}>{form.quantity} × ₹{selected.price}</div>
            </div>
            <div style={{fontSize:'28px', fontWeight:'800', color:'#34d399'}}>₹{total}</div>
          </div>
        )}
        <button onClick={submit} className="btn btn-success" style={{width:'100%', padding:'14px', fontSize:'15px', borderRadius:'14px'}}>
          🛒 Place Order
        </button>
      </div>

      <div className="card">
        <div style={{fontSize:'15px', fontWeight:'700', color:'#e2e8f0', marginBottom:'20px'}}>All Orders <span style={{color:'#475569', fontWeight:'400'}}>({orders.length})</span></div>
        <table>
          <thead><tr>{['Order ID','Customer','Product','Qty','Total','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{orders.slice().reverse().map(o=>(
            <tr key={o.id}>
              <td><span style={{fontWeight:'800', color:'#a5b4fc', fontSize:'15px'}}>#{o.id}</span></td>
              <td style={{fontWeight:'600', color:'#e2e8f0'}}>{getName(customers,o.customer_id)}</td>
              <td style={{color:'#94a3b8'}}>{getName(products,o.product_id)}</td>
              <td><span className="badge badge-info">{o.quantity}</span></td>
              <td style={{fontWeight:'800', color:'#34d399', fontSize:'15px'}}>₹{o.total_price}</td>
              <td><span className="badge badge-success">{o.status}</span></td>
              <td><button onClick={()=>del(o.id)} className="btn btn-danger" style={{padding:'7px 14px', fontSize:'13px'}}>Cancel</button></td>
            </tr>
          ))}</tbody>
        </table>
        {orders.length===0&&<div style={{textAlign:'center',padding:'48px',color:'#334155'}}>
          <div style={{fontSize:'40px', marginBottom:'12px'}}>🛒</div>
          <div>No orders yet. Place your first order above!</div>
        </div>}
      </div>
    </div>
  )
}