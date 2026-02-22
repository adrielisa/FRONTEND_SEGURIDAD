export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const API_ENDPOINTS = {
  entries: `${API_URL}/entries`,
  cooldownStatus: `${API_URL}/entries/cooldown/status`,
  reportAttack: `${API_URL}/entries/report-attack`,
} as const
