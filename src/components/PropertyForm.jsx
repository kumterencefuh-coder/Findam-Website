import { useState } from 'react'
import { cities } from '../data.js'

export default function PropertyForm({ onSubmit, submitting = false }) {
  const [city, setCity] = useState('')
  const [type, setType] = useState('Rent')
  const [photos, setPhotos] = useState([])
  const addPhotos = (event) => Array.from(event.target.files || []).slice(0, 6).forEach((file) => { const reader = new FileReader(); reader.onload = () => setPhotos((current) => [...current, { name: file.name, url: URL.createObjectURL(file), data: reader.result }].slice(0, 6)); reader.readAsDataURL(file) })
  const submit = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); onSubmit({ title: form.get('title'), city, type, price: Number(form.get('price')) * 1000, phone: form.get('phone'), photos: photos.map((photo) => photo.data) }) }
  return <form className="property-form" onSubmit={submit}>
    <label>Property title<input name="title" required placeholder="e.g. 2 Bedroom Apartment" /></label>
    <label><span>Where is it?</span><select value={city} onChange={(event) => setCity(event.target.value)} required><option value="">Select city</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Property type</span><select value={type} onChange={(event) => setType(event.target.value)}><option>Rent</option><option>Guesthouse</option></select></label>
    <label>Price (thousand FCFA)<input name="price" required type="number" min="1" placeholder="e.g. 150" /><small>Enter 150 for 150,000 FCFA.</small></label>
    <label>Phone number<input name="phone" required type="tel" placeholder="+237" /></label>
    <label className="photo-upload">Property photos<input type="file" accept="image/*" multiple onChange={addPhotos} /><span>Upload up to 6 photos of rooms or the building</span></label>
    {photos.length > 0 && <div className="photo-previews">{photos.map((photo) => <img src={photo.url} alt={photo.name} key={photo.url} />)}</div>}
    <button className="primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit for verification'}</button>
  </form>
}
