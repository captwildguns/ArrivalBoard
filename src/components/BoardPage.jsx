import React, { useState } from 'react'
import { EtaStatus, formatTime, getMinutesDiff } from '../data/sampleData.js'
import DisplayPreferences from './DisplayPreferences.jsx'

// ── Status badge ────────────────────────────────────────────────────────
function StatusBadge({ status, minutesDiff }) {
  let label, cls
  switch (status) {
    case EtaStatus.Early: {
      const m = minutesDiff != null ? Math.abs(Math.round(minutesDiff)) : null
      label = m != null ? `Early -${m}` : 'Early'
      cls = 'board-badge board-badge-early'
      break
    }
    case EtaStatus.Late: {
      const m = minutesDiff != null ? Math.abs(Math.round(minutesDiff)) : null
      label = m != null ? `Late +${m}` : 'Late'
      cls = 'board-badge board-badge-late'
      break
    }
    case EtaStatus.OnTime:
      label = 'On Time'; cls = 'board-badge board-badge-ontime'; break
    case EtaStatus.Arrived:
      label = 'Arrived'; cls = 'board-badge board-badge-yellow'; break
    case EtaStatus.Departed:
      label = 'Departed'; cls = 'board-badge board-badge-yellow'; break
    case EtaStatus.PendingDeparture:
      label = 'Pending'; cls = 'board-badge board-badge-yellow'; break
    default:
      label = 'Unavailable'; cls = 'board-badge board-badge-unavailable'
  }
  return <span className={cls}>{label}</span>
}

// ── Single school table ─────────────────────────────────────────────────
function SchoolTable({ buses, columns, isDepartures }) {
  const timeHeader = isDepartures ? 'Departing' : 'Arriving'

  const rows = isDepartures
    ? buses.filter(b =>
        b.arrivalStatus === EtaStatus.Arrived ||
        b.arrivalStatus === EtaStatus.Departed ||
        b.arrivalStatus === EtaStatus.PendingDeparture
      )
    : buses

  return (
    <table className="flat-board-table">
      <thead>
        <tr className="flat-board-header-row">
          <th className="fbt-col-vehicle">Vehicle #</th>
          <th className="fbt-col-status">Status</th>
          <th className="fbt-col-time">{timeHeader}</th>
          {columns.driver  && <th className="fbt-col-driver">Driver</th>}
          {columns.route   && <th className="fbt-col-run">Run Name</th>}
          {columns.students && <th className="fbt-col-students">Student Count</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={3 + [columns.driver, columns.route, columns.students].filter(Boolean).length}
              className="fbt-empty"
            >
              No vehicles found.
            </td>
          </tr>
        ) : (
          rows.map(bus => {
            const diff = getMinutesDiff(bus.eta, bus.plannedTime)
            const time = isDepartures
              ? (bus.departedTime ?? bus.plannedTime)
              : (bus.eta ?? bus.plannedTime)
            return (
              <tr key={bus.id} className="flat-board-row">
                <td className="fbt-col-vehicle fbt-vehicle-num">{bus.busNumber}</td>
                <td className="fbt-col-status">
                  <StatusBadge status={bus.arrivalStatus} minutesDiff={diff} />
                </td>
                <td className="fbt-col-time fbt-time">{formatTime(time)}</td>
                {columns.driver   && <td className="fbt-col-driver fbt-text">{bus.driver || '—'}</td>}
                {columns.route    && <td className="fbt-col-run fbt-text">{bus.runName}</td>}
                {columns.students && <td className="fbt-col-students fbt-text">{bus.studentCount}</td>}
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}

// ── Per-school section (used in both single and multi layouts) ──────────
function SchoolSection({ school, buses, columns, viewMode }) {
  const showArrivals  = viewMode !== 'departures'
  const showDepartures = viewMode !== 'arrivals'

  // Apply groupUnavailable sorting if needed
  return (
    <div className="board-school-section">
      {showArrivals && (
        <div className="board-sub-section">
          <div className="board-section-heading">Arrivals</div>
          <div className="board-section-divider" />
          <SchoolTable buses={buses} columns={columns} isDepartures={false} />
        </div>
      )}
      {showDepartures && (
        <div className="board-sub-section">
          <div className="board-section-heading">Departures</div>
          <div className="board-section-divider" />
          <SchoolTable buses={buses} columns={columns} isDepartures={true} />
        </div>
      )}
    </div>
  )
}

const DEFAULT_COLUMNS = { driver: true, route: true, students: false }
const DEFAULT_PREFS = {
  driver: true, route: true, students: false,
  showEarlyAsOnTime: false, tvMode: false,
  groupUnavailableAtBottom: false, sortByPlanned: false,
  viewMode: 'both-horizontal',
  showLateArrivalsOnly: false,
  hideUnavailableVehicles: false,
}

// ── Main BoardPage ──────────────────────────────────────────────────────
export default function BoardPage({ schools, buses, selectedSchoolIds }) {
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)

  const visibleSchools = schools.filter(s => selectedSchoolIds.includes(s.locationId))
  const singleSchool   = visibleSchools.length === 1

  const pageTitle = singleSchool
    ? `${visibleSchools[0].schoolName} - Board`
    : 'Board'

  function getBuses(schoolId) {
    let list = buses[schoolId] ?? []

    if (prefs.hideUnavailableVehicles) {
      list = list.filter(b => b.arrivalStatus !== EtaStatus.Unavailable)
    }
    if (prefs.showLateArrivalsOnly) {
      list = list.filter(b => b.arrivalStatus === EtaStatus.Late)
    }
    if (prefs.showEarlyAsOnTime) {
      list = list.map(b =>
        b.arrivalStatus === EtaStatus.Early ? { ...b, arrivalStatus: EtaStatus.OnTime } : b
      )
    }
    if (prefs.groupUnavailableAtBottom) {
      list = [
        ...list.filter(b => b.arrivalStatus !== EtaStatus.Unavailable),
        ...list.filter(b => b.arrivalStatus === EtaStatus.Unavailable),
      ]
    }
    if (prefs.sortByPlanned) {
      list = [...list].sort((a, b) => (a.plannedTime?.getTime() ?? Infinity) - (b.plannedTime?.getTime() ?? Infinity))
    }
    return list
  }

  const columns = { driver: prefs.driver, route: prefs.route, students: prefs.students }

  return (
    <div className={`board-page${prefs.tvMode ? ' tv-mode' : ''}`}>

      {/* Page header */}
      <div className="board-page-header">
        <h1 className="board-page-title">{pageTitle}</h1>
        <button
          className={`app-bar-icon-btn board-filter-btn${prefsOpen ? ' active-filter' : ''}`}
          onClick={() => setPrefsOpen(o => !o)}
          aria-label="Display preferences"
        >
          <span className="material-icons">filter_alt</span>
        </button>
      </div>

      <div className="board-page-body">
        {/* Main content — schools */}
        <div className="board-page-content">
          {visibleSchools.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons empty-state-icon">directions_bus</span>
              <p>Select one or more schools from the sidebar to view arrival boards.</p>
            </div>
          ) : (
            visibleSchools.map(school => (
              <div key={school.locationId}>
                {/* Multi-school: show school name above each section */}
                {!singleSchool && (
                  <div className="board-multi-school-label">{school.schoolName}</div>
                )}
                <SchoolSection
                  school={school}
                  buses={getBuses(school.locationId)}
                  columns={columns}
                  viewMode={prefs.viewMode}
                />
              </div>
            ))
          )}

          <footer className="app-footer board-footer-push">
            © 2026 - Tyler Technologies. All rights reserved. - Designed with Tyler Forge
            <svg className="forge-logo-mark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 2L14 5.5V12.5L8 16L2 12.5V5.5L8 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <path d="M8 5L11.5 7V11L8 13L4.5 11V7L8 5Z" fill="currentColor" fillOpacity="0.4"/>
            </svg>
          </footer>
        </div>

        {/* Display prefs drawer */}
        {prefsOpen && (
          <DisplayPreferences
            columns={columns}
            onColumnsChange={cols => setPrefs(p => ({ ...p, driver: cols.driver, route: cols.route }))}
            showEarlyAsOnTime={prefs.showEarlyAsOnTime}
            onShowEarlyAsOnTimeChange={v => setPrefs(p => ({ ...p, showEarlyAsOnTime: v }))}
            tvMode={prefs.tvMode}
            onTvModeChange={v => setPrefs(p => ({ ...p, tvMode: v }))}
            groupUnavailableAtBottom={prefs.groupUnavailableAtBottom}
            onGroupUnavailableChange={v => setPrefs(p => ({ ...p, groupUnavailableAtBottom: v }))}
            sortByPlanned={prefs.sortByPlanned}
            onSortByPlannedChange={v => setPrefs(p => ({ ...p, sortByPlanned: v }))}
            viewMode={prefs.viewMode}
            onViewModeChange={v => setPrefs(p => ({ ...p, viewMode: v }))}
            onClose={() => setPrefsOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
