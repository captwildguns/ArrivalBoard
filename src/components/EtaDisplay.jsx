import React from 'react'
import { EtaStatus, formatTime, getMinutesDiff } from '../data/sampleData.js'

export default function EtaDisplay({ bus }) {
  const { eta, plannedTime, arrivalStatus, departedTime, departureStatus } = bus
  const isDeparted = departureStatus === EtaStatus.Departed && departedTime
  const displayTime = isDeparted ? departedTime : eta

  if (!displayTime && arrivalStatus === EtaStatus.Unavailable) {
    return <span className="eta-time eta-unavailable">--:--</span>
  }

  const diff = getMinutesDiff(displayTime, plannedTime)
  const showPlanned = Math.abs(diff) > 1.5 && plannedTime && !isDeparted

  return (
    <span className="eta-cell">
      <span className="eta-time">{formatTime(displayTime)}</span>
      {showPlanned && (
        <span className="eta-planned" title="Scheduled time">
          {formatTime(plannedTime)}
        </span>
      )}
    </span>
  )
}
