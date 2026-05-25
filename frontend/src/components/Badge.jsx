import React from 'react'

const styles = {
  easy:      'bg-emerald-50 text-emerald-700',
  medium:    'bg-amber-50 text-amber-700',
  hard:      'bg-red-50 text-red-700',
  pending:   'bg-gray-100 text-gray-600',
  completed: 'bg-emerald-50 text-emerald-700',
  admin:     'bg-brand-50 text-brand-700',
  user:      'bg-gray-100 text-gray-600',
  inactive:  'bg-red-50 text-red-600',
}

export default function Badge({ label }) {
  const cls = styles[label?.toLowerCase()] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  )
}
