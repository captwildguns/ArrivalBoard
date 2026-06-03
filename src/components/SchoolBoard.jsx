import React, { useState } from 'react'
import BusBoardTable from './BusBoardTable.jsx'
import DisplayPreferences from './DisplayPreferences.jsx'
import { EtaStatus } from '../data/sampleData.js'

const DEFAULT_COLUMNS = { driver: true, route: true, students: false }

export default function SchoolBoard({ school, buses }) {
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [viewMode, setViewMode] = useState('arrivals')
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [showEarlyAsOnTime, setShowEarlyAsOnTime] = useState(false)
  const [tvMode, setTvMode] = useState(false)
  const [groupUnavailableAtBottom, setGroupUnavailableAtBottom] = useState(false)
  const [sortByPlanned, setSortByPlanned] = useState(false)

  let displayBuses = showEarlyAsOnTime
    ? buses.map(b => b.arrivalStatus === EtaStatus.Early
        ? { ...b, arrivalStatus: EtaStatus.OnTime }
        : b)
    : [...buses]

  if (groupUnavailableAtBottom) {
    displayBuses = [
      ...displayBuses.filter(b => b.arrivalStatus !== EtaStatus.Unavailable),
      ...displayBuses.filter(b => b.arrivalStatus === EtaStatus.Unavailable),
    ]
  }

  if (sortByPlanned) {
    displayBuses = [...displayBuses].sort((a, b) => {
      const ta = a.plannedTime?.getTime() ?? Infinity
      const tb = b.plannedTime?.getTime() ?? Infinity
      return ta - tb
    })
  }

  const visibleCount = displayBuses.filter(
    b => b.arrivalStatus !== EtaStatus.Unavailable || b.plannedTime
  ).length
  const activeCount = school.activeVehicleCount ?? buses.length

  const VIEW_MODES = [
    { key: 'arrivals', label: 'Arrivals' },
    { key: 'departures', label: 'Departures' },
    { key: 'both-horizontal', label: 'Side by Side' },
    { key: 'both-vertical', label: 'Stacked' },
  ]

  return (
    <div className={`school-board-card${tvMode ? ' tv-mode' : ''}`}>
      <div className="board-toolbar">
        <div className="board-toolbar-title">
          <span className="board-school-name">{school.schoolName}</span>
          <span className="board-section-divider"> – </span>
          <span className="board-page-label">Board</span>
          <span className="board-active-badge" title="Active vehicles">{activeCount} active</span>
        </div>
        <div className="board-toolbar-actions">
          <div className="view-toggle">
            {VIEW_MODES.map(({ key, label }) => (
              <button
                key={key}
                className={`view-toggle-btn${viewMode === key ? ' active' : ''}`}
                onClick={() => setViewMode(key)}
                title={label}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className={`icon-btn${prefsOpen ? ' active' : ''}`}
            onClick={() => setPrefsOpen(o => !o)}
            title="Display preferences"
            aria-label="Display preferences"
          >
            <span className="material-icons">filter_alt</span>
          </button>
        </div>
      </div>

      <div className="board-body">
        <div className="board-content">
          <BusBoardTable buses={displayBuses} columns={columns} viewMode={viewMode} />
        </div>

        {prefsOpen && (
          <DisplayPreferences
            columns={columns}
            onColumnsChange={setColumns}
            showEarlyAsOnTime={showEarlyAsOnTime}
            onShowEarlyAsOnTimeChange={setShowEarlyAsOnTime}
            tvMode={tvMode}
            onTvModeChange={setTvMode}
            groupUnavailableAtBottom={groupUnavailableAtBottom}
            onGroupUnavailableChange={setGroupUnavailableAtBottom}
            sortByPlanned={sortByPlanned}
            onSortByPlannedChange={setSortByPlanned}
            onClose={() => setPrefsOpen(false)}
          />
        )}
      </div>

      <div className="board-footer">
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
        <span className="bus-count">
          {visibleCount} {visibleCount === 1 ? 'vehicle' : 'vehicles'}
        </span>
      </div>
    </div>
  )
}
