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

  const displayBuses = showEarlyAsOnTime
    ? buses.map(b => b.arrivalStatus === EtaStatus.Early
        ? { ...b, arrivalStatus: EtaStatus.OnTime }
        : b)
    : buses

  const arrivals = displayBuses.filter(b => b.arrivalStatus !== EtaStatus.Unavailable || b.plannedTime).length
  const activeCount = school.activeVehicleCount ?? buses.length

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
            {['arrivals', 'departures', 'both-horizontal', 'both-vertical'].map(mode => {
              const labels = {
                'arrivals': 'Arrivals',
                'departures': 'Departures',
                'both-horizontal': 'Side by Side',
                'both-vertical': 'Stacked',
              }
              return (
                <button
                  key={mode}
                  className={`view-toggle-btn${viewMode === mode ? ' active' : ''}`}
                  onClick={() => setViewMode(mode)}
                  title={labels[mode]}
                >
                  {labels[mode]}
                </button>
              )
            })}
          </div>
          <button
            className={`icon-btn${prefsOpen ? ' active' : ''}`}
            onClick={() => setPrefsOpen(o => !o)}
            title="Display preferences"
            aria-label="Display preferences"
          >
            <span className="material-icons">tune</span>
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
          {arrivals} {arrivals === 1 ? 'bus' : 'buses'}
        </span>
      </div>
    </div>
  )
}
