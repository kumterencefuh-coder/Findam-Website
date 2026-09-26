// Use the Vite/Docker same-origin proxy locally. Vercel does not proxy /api
// unless a rewrite is configured, so use the deployed API as the production
// fallback. VITE_API_URL can still override this for another environment.
const defaultApiUrl = import.meta.env.DEV ? '/api' : 'https://findam-backend.onrender.com/api'
const API_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try { response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options }) } catch { throw new Error(`Cannot reach Findam server at ${API_URL}. Check the deployed backend URL and internet connection.`) }
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

export function submitProperty(property, token) { return request('/listings', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(property) }) }
export function sendBotMessage(message) { return request('/bot', { method: 'POST', body: JSON.stringify({ message }) }) }
export function saveFavorite(listingId, visitorId) { return request(`/favorites/${listingId}`, { method: 'POST', body: JSON.stringify({ visitorId }) }) }
export function removeFavorite(listingId, visitorId) { return request(`/favorites/${listingId}?visitorId=${encodeURIComponent(visitorId)}`, { method: 'DELETE' }) }
export function getFavorites(visitorId) { return request(`/favorites?visitorId=${encodeURIComponent(visitorId)}`).then((result) => result.data) }
export function registerAccount(account) { return request('/auth/register', { method: 'POST', body: JSON.stringify(account) }) }
export function loginAccount(account) { return request('/auth/login', { method: 'POST', body: JSON.stringify(account) }) }
export function me(token) { return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
export function resetPassword(account) { return request('/auth/reset', { method: 'POST', body: JSON.stringify(account) }) }
export function getInquiries(token) { return request('/inquiries', { headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
export function sendInquiry(listingId, message, token) { return request('/inquiries', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ listingId, message }) }).then((result) => result.data) }
export function replyToInquiry(id, message, token) { return request(`/inquiries/${id}/reply`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) }).then((result) => result.data) }
export function getMyListings(token) { return request('/me/listings', { headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
function adminHeaders(token) { return { 'X-Admin-Token': token, Authorization: `Bearer ${token}` } }
export function getAdminListings(token) { return request('/admin/listings', { headers: adminHeaders(token) }).then((result) => result.data) }
export function getAdminUsers(token) { return request('/admin/users', { headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
export function promoteUser(id, token) { return request(`/admin/users/${id}/promote`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
export function verifyUser(id, token) { return request(`/admin/users/${id}/verify`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).then((result) => result.data) }
export function confirmListing(id, token) { return request(`/admin/listings/${id}/confirm`, { method: 'POST', headers: adminHeaders(token) }) }
export function rejectListing(id, reason, token) { return request(`/admin/listings/${id}/reject`, { method: 'POST', headers: adminHeaders(token), body: JSON.stringify({ reason }) }) }
export function requestListingInfo(id, reason, token) { return request(`/admin/listings/${id}/needs-info`, { method: 'POST', headers: adminHeaders(token), body: JSON.stringify({ reason }) }) }
export function updateListing(id, changes, token) { return request(`/listings/${id}`, { method: 'PUT', headers: { 'X-Admin-Token': token }, body: JSON.stringify(changes) }) }
export function deleteListing(id, token) { return request(`/listings/${id}`, { method: 'DELETE', headers: { 'X-Admin-Token': token } }) }
