import React from 'react'
import { EtaStatus } from '../data/sampleData.js'

export default function StatusBadge({ status, minutesDiff }) {
  let label, className

  switch (status) {
    case EtaStatus.Early: {
      const mins = minutesDiff != null ? Math.abs(Math.round(minutesDiff)) : null
      label = mins != null ? `Early -${mins}` : 'Early'
      className = 'status-early'
      break
    }
    case EtaStatus.Late: {
      const mins = minutesDiff != null ? Math.abs(Math.round(minutesDiff)) : null
      label = mins != null ? `Late +${mins}` : 'Late'
      className = 'status-late'
      break
    }
    case EtaStatus.OnTime:
      label = 'On Time'
      className = 'status-on-time'
      break
    case EtaStatus.Arrived:
      label = 'Arrived'
      className = 'status-yellow'
      break
    case EtaStatus.Departed:
      label = 'Departed'
      className = 'status-yellow'
      break
    case EtaStatus.PendingDeparture:
      label = 'Pending'
      className = 'status-yellow'
      break
    default:
      label = 'Unavailable'
      className = 'status-unavailable'
  }

  return (
    <span className={`status-badge ${className}`}>
      {label}
    </span>
  )
}
