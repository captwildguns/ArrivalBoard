import React from 'react'
import { EtaStatus } from '../data/sampleData.js'

const STATUS_CONFIG = {
  [EtaStatus.Early]: { label: 'Early', className: 'status-early' },
  [EtaStatus.OnTime]: { label: 'On Time', className: 'status-on-time' },
  [EtaStatus.Late]: { label: 'Late', className: 'status-late' },
  [EtaStatus.Unavailable]: { label: 'N/A', className: 'status-unavailable' },
  [EtaStatus.Arrived]: { label: 'Arrived', className: 'status-arrived' },
  [EtaStatus.PendingDeparture]: { label: 'Pending', className: 'status-pending' },
  [EtaStatus.Departed]: { label: 'Departed', className: 'status-departed' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[EtaStatus.Unavailable]
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}
