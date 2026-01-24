const BASE_URL = 'https://686295e396f0cc4e34ba4b71.mockapi.io/api/v2'
const RESOURCE = 'submitted'
const API_URL = `${BASE_URL}/${RESOURCE}`

async function safeFetch(input, init) {
  const res = await fetch(input, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`)
    err.status = res.status
    err.body = text
    throw err
  }
  // Some endpoints may return empty body
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export async function listSubmissions(params = {}) {
  const url = new URL(API_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  return safeFetch(url.toString())
}

export async function getSubmission(id) {
  if (!id) throw new Error('id required')
  return safeFetch(`${API_URL}/${encodeURIComponent(id)}`)
}

export async function createSubmission(data) {
  return safeFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export async function updateSubmission(id, data) {
  if (!id) throw new Error('id required')
  return safeFetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export async function deleteSubmission(id) {
  if (!id) throw new Error('id required')
  return safeFetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
}

export default {
  list: listSubmissions,
  get: getSubmission,
  create: createSubmission,
  update: updateSubmission,
  del: deleteSubmission,
}
