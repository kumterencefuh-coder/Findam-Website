const API_URL = 'https://findam-backend.onrender.com/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const text = await response.text()
  let payload
  try { payload = text ? JSON.parse(text) : {} } catch { throw new Error(`Backend is not connected at ${API_URL}. Set VITE_API_URL to your backend URL.`) }
  if (!response.ok) throw new Error(payload.error || 'Request failed')
  return payload
}

export function getListings(filters = {}) {
  const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null))
  return request(`/listings${params.toString() ? `?${params}` : ''}`).then((result) => result.data)
}

export function submitProperty(property) { return request('/listings', { method: 'POST', body: JSON.stringify(property) }) }
export function sendBotMessage(message) { return request('/bot', { method: 'POST', body: JSON.stringify({ message }) }) }
export function saveFavorite(listingId, visitorId) { return request(`/favorites/${listingId}`, { method: 'POST', body: JSON.stringify({ visitorId }) }) }
export function removeFavorite(listingId, visitorId) { return request(`/favorites/${listingId}?visitorId=${encodeURIComponent(visitorId)}`, { method: 'DELETE' }) }
export function getFavorites(visitorId) { return request(`/favorites?visitorId=${encodeURIComponent(visitorId)}`).then((result) => result.data) }
export function registerAccount(account) { return request('/auth/register', { method: 'POST', body: JSON.stringify(account) }) }
export function loginAccount(account) { return request('/auth/login', { method: 'POST', body: JSON.stringify(account) }) }
export function getAdminListings(token) { return request('/admin/listings', { headers: { 'X-Admin-Token': token } }).then((result) => result.data) }
export function confirmListing(id, token) { return request(`/admin/listings/${id}/confirm`, { method: 'POST', headers: { 'X-Admin-Token': token } }) }
export function updateListing(id, changes, token) { return request(`/listings/${id}`, { method: 'PUT', headers: { 'X-Admin-Token': token }, body: JSON.stringify(changes) }) }
export function deleteListing(id, token) { return request(`/listings/${id}`, { method: 'DELETE', headers: { 'X-Admin-Token': token } }) }
