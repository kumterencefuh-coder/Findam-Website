import { useEffect, useState } from 'react'

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('findam-admin-token') || '')
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const load = async () => { const response = await fetch('/api/admin/listings', { headers: { 'X-Admin-Token': token } }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setListings(result.data) }
  useEffect(() => { if (token) load().catch((err) => setError(err.message)) }, [])
  const confirm = async (id) => { const response = await fetch(`/api/admin/listings/${id}/confirm`, { method: 'POST', headers: { 'X-Admin-Token': token } }); if (!response.ok) { const result = await response.json(); throw new Error(result.error) } await load() }
  if (!token) return <section className="shell section form-wrap"><h1 className="page-title">Admin review</h1><p>Enter the admin token to review pending listings.</p><form onSubmit={(event) => { event.preventDefault(); localStorage.setItem('findam-admin-token', token); load().catch((err) => setError(err.message)) }}><input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Admin token" /><button className="primary">Open review</button></form>{error && <p role="alert">{error}</p>}</section>
  return <section className="shell section"><p className="kicker">ADMIN PORTAL</p><h1 className="page-title">Listing review</h1>{error && <p role="alert">{error}</p>}<div className="cards">{listings.map((listing) => <article className="agent" key={listing.id}><h3>{listing.title}</h3><p>{listing.city} · {listing.type}</p><span>Status: {listing.status || (listing.verified ? 'confirmed' : 'pending')}</span>{listing.status !== 'confirmed' && !listing.verified && <button className="primary" onClick={() => confirm(listing.id).catch((err) => setError(err.message))}>Confirm listing</button>}</article>)}</div></section>
}
