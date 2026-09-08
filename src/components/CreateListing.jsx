import { useState } from 'react'
import PropertyForm from './PropertyForm.jsx'

export default function CreateListing({ onCreate }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const create = async (property) => { setSubmitting(true); setError(''); try { await onCreate(property); setSent(true) } catch (err) { setError(err.message) } finally { setSubmitting(false) } }
  if (sent) return <div className="success"><h2>Submission received</h2><p>Your property has been added and is awaiting verification.</p></div>
  return <><PropertyForm onSubmit={create} submitting={submitting} />{error && <p role="alert">{error}</p>}</>
}
