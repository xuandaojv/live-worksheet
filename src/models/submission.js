// Lightweight submission model and helpers
export function createId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

export function validateSubmission(obj) {
  if (!obj) return false
  if (typeof obj.id !== 'string') return false
  if (typeof obj.createdAt !== 'number') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.score !== 'number') return false
  if (typeof obj.details !== 'string') return false
  return true
}

export function createSubmission({ name = 'Anonymous', score = 0, details = '' } = {}) {
  const submission = {
    id: createId(),
    createdAt: nowSeconds(),
    name,
    score: Number(score),
    details: String(details)
  }
  return submission
}

export default createSubmission
