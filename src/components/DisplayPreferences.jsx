import React, { useState } from 'react'

const DEFAULTS = {
  driver: true,
  route: true,
  students: false,
  showEarlyAsOnTime: false,
  tvMode: false,
  groupUnavailableAtBottom: false,
  sortByPlanned: false,
}

export default function DisplayPreferences({
  columns,
  onColumnsChange,
  showEarlyAsOnTime,
  onShowEarlyAsOnTimeChange,
  tvMode,
  onTvModeChange,
  groupUnavailableAtBottom,
  onGroupUnavailableChange,
  sortByPlanned,
  onSortByPlannedChange,
  onClose,
}) {
  const [pending, setPending] = useState({
    ...columns,
    showEarlyAsOnTime,
    tvMode,
    groupUnavailableAtBottom,
    sortByPlanned,
  })

  function togglePending(key) {
    setPending(p => ({ ...p, [key]: !p[key] }))
  }

  function handleApply() {
    onColumnsChange({ driver: pending.driver, route: pending.route, students: pending.students })
    onShowEarlyAsOnTimeChange(pending.showEarlyAsOnTime)
    onTvModeChange(pending.tvMode)
    onGroupUnavailableChange(pending.groupUnavailableAtBottom)
    onSortByPlannedChange(pending.sortByPlanned)
    onClose()
  }

  function handleReset() {
    setPending({ ...DEFAULTS })
  }

  return (
    <aside className="prefs-drawer">
      <div className="prefs-header">
        <span className="prefs-title">Display Preferences</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close preferences">
          <span className="material-icons">close</span>
        </button>
      </div>

      <div className="prefs-section">
        <div className="prefs-section-label">Columns</div>
        {[
          { key: 'driver', label: 'Driver' },
          { key: 'route', label: 'Run Name' },
          { key: 'students', label: 'Student Count' },
        ].map(({ key, label }) => (
          <label key={key} className="prefs-toggle-row">
            <span className="toggle-label">{label}</span>
            <input
              type="checkbox"
              className="prefs-checkbox"
              checked={pending[key]}
              onChange={() => togglePending(key)}
            />
            <span className="toggle-switch" />
          </label>
        ))}
      </div>

      <div className="prefs-section">
        <div className="prefs-section-label">Options</div>
        {[
          { key: 'showEarlyAsOnTime', label: 'Show Early as On Time' },
          { key: 'groupUnavailableAtBottom', label: 'Group Unavailable at Bottom' },
          { key: 'sortByPlanned', label: 'Sort by Planned Time' },
          { key: 'tvMode', label: 'TV Mode (1.5× zoom)' },
        ].map(({ key, label }) => (
          <label key={key} className="prefs-toggle-row">
            <span className="toggle-label">{label}</span>
            <input
              type="checkbox"
              className="prefs-checkbox"
              checked={pending[key]}
              onChange={() => togglePending(key)}
            />
            <span className="toggle-switch" />
          </label>
        ))}
      </div>

      <div className="prefs-footer prefs-footer-row">
        <button className="reset-btn" onClick={handleReset}>Reset</button>
        <button className="apply-btn" onClick={handleApply}>Apply</button>
      </div>
    </aside>
  )
}
