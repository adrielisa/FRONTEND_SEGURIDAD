export interface Entry {
  id: string
  contenido: string
  createdAt: string
  updatedAt: string
}

export interface CooldownStatus {
  active: boolean
  type?: 'cooldown' | 'blocked'
  remainingSeconds: number
  reason?: string
}
