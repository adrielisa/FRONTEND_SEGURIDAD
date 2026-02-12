'use client'

interface AlertProps {
  message: string
  type: 'success' | 'error'
}

export default function Alert({ message, type }: AlertProps) {
  return (
    <div
      className={`p-4 mb-6 rounded-lg border-2 ${
        type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      } animate-slideDown`}
    >
      <p className="font-medium">{message}</p>
    </div>
  )
}
