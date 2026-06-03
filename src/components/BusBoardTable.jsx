import React, { useEffect, useRef, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import EtaDisplay from './EtaDisplay.jsx'
import { EtaStatus } from '../data/sampleData.js'

export default function BusBoardTable({ buses, columns, viewMode }) {
  const [flashedIds, setFlashedIds] = useState(new Set())
  const prevStatusRef = useRef({})

  useEffect(() => {
    const newFlashes = new Set()
    buses.forEach(bus => {
      const prev = prevStatusRef.current[bus.id]
      if (prev && prev !== bus.arrivalStatus) {
        newFlashes.add(bus.id)
      }
      prevStatusRef.current[bus.id] = bus.arrivalStatus
    })
    if (newFlashes.size > 0) {
      setFlashedIds(prev => new Set([...prev, ...newFlashes]))
      setTimeout(() => {
        setFlashedIds(prev => {
          const next = new Set(prev)
          newFlashes.forEach(id => next.delete(id))
          return next
        })
      }, 1100)
    }
  }, [buses])

  const arrivals = buses.filter(
    b => b.arrivalStatus !== EtaStatus.Unavailable || b.plannedTime
  )
  const departures = buses.filter(
    b => b.arrivalStatus === EtaStatus.Arrived && !b.inbound
  )

  const renderTable = (rows, title) => (
    <div className="board-table-wrapper">
      {title && <div className="board-section-label">{title}</div>}
      <table className="board-table">
        <thead>
          <tr>
            <th className="col-bus-num">Bus #</th>
            <th className="col-status">Status</th>
            <th className="col-eta">ETA</th>
            {columns.driver && <th className="col-driver">Driver</th>}
            {columns.route && <th className="col-route">Route</th>}
            {columns.students && <th className="col-students">Students</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3 + Object.values(columns).filter(Boolean).length} className="empty-row">
                No buses to display
              </td>
            </tr>
          ) : (
            rows.map(bus => (
              <tr
                key={bus.id}
                className={[
                  'board-row',
                  `row-status-${bus.arrivalStatus.toLowerCase()}`,
                  flashedIds.has(bus.id) ? 'row-highlight' : '',
                ].filter(Boolean).join(' ')}
              >
                <td className="col-bus-num">
                  <span className="bus-number">{bus.busNumber}</span>
                </td>
                <td className="col-status">
                  <StatusBadge status={bus.arrivalStatus} />
                </td>
                <td className="col-eta">
                  <EtaDisplay bus={bus} />
                </td>
                {columns.driver && (
                  <td className="col-driver">
                    <span className="driver-name">{bus.driver || '—'}</span>
                  </td>
                )}
                {columns.route && (
                  <td className="col-route">
                    <span className="route-name" title={bus.runName}>{bus.runName}</span>
                  </td>
                )}
                {columns.students && (
                  <td className="col-students">{bus.studentCount}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  if (viewMode === 'arrivals') return renderTable(arrivals)
  if (viewMode === 'departures') return renderTable(departures)

  if (viewMode === 'both-horizontal') {
    return (
      <div className="board-both board-horizontal">
        <div className="board-pane">{renderTable(arrivals, 'Arrivals')}</div>
        <div className="board-divider" />
        <div className="board-pane">{renderTable(departures, 'Departures')}</div>
      </div>
    )
  }

  return (
    <div className="board-both board-vertical">
      {renderTable(arrivals, 'Arrivals')}
      {renderTable(departures, 'Departures')}
    </div>
  )
}
