import React, { useState, useRef, useEffect } from 'react'

const BOARD_TYPES = [
  { value: 'arrivals',        label: 'Arrivals' },
  { value: 'departures',      label: 'Departures' },
  { value: 'both-horizontal', label: 'Both Horizontal' },
  { value: 'both-vertical',   label: 'Both Vertical' },
]

const DEFAULTS = {
  viewMode:               'both-horizontal',
  showDriverName:         true,
  showRunName:            true,
  sortByPlannedTime:      false,
  groupUnavailableAtBottom: false,
  showEarlyAsOnTime:      false,
  showLateArrivalsOnly:   false,
  hideUnavailableVehicles: false,
}

function PrefCheckbox({ checked, onChange, label }) {
  return (
    <label className="dp-check-row">
      <input
        type="checkbox"
        className="dp-checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="dp-check-label">{label}</span>
    </label>
  )
}

function BoardTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = BOARD_TYPES.find(t => t.value === value) ?? BOARD_TYPES[2]

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="dp-dropdown-root" ref={ref}>
      <div
        className={`dp-dropdown-input${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o) }}
      >
        <span className="dp-dropdown-label">Board Type</span>
        <span className="dp-dropdown-value">{selected.label}</span>
        <span className={`material-icons dp-dropdown-arrow${open ? ' rotated' : ''}`}>
          arrow_drop_down
        </span>
      </div>
      {open && (
        <ul className="dp-dropdown-list">
          {BOARD_TYPES.map(t => (
            <li
              key={t.value}
              className={`dp-dropdown-item${value === t.value ? ' selected' : ''}`}
              onClick={() => { onChange(t.value); setOpen(false) }}
            >
              {t.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
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
  viewMode,
  onViewModeChange,
  onClose,
}) {
  const [p, setP] = useState({
    viewMode:                viewMode ?? DEFAULTS.viewMode,
    showDriverName:          columns?.driver  ?? DEFAULTS.showDriverName,
    showRunName:             columns?.route   ?? DEFAULTS.showRunName,
    sortByPlannedTime:       sortByPlanned    ?? DEFAULTS.sortByPlannedTime,
    groupUnavailableAtBottom: groupUnavailableAtBottom ?? DEFAULTS.groupUnavailableAtBottom,
    showEarlyAsOnTime:       showEarlyAsOnTime ?? DEFAULTS.showEarlyAsOnTime,
    showLateArrivalsOnly:    false,
    hideUnavailableVehicles: false,
  })

  function set(key, val) { setP(prev => ({ ...prev, [key]: val })) }

  function handleApply() {
    onColumnsChange?.({ driver: p.showDriverName, route: p.showRunName, students: false })
    onShowEarlyAsOnTimeChange?.(p.showEarlyAsOnTime)
    onGroupUnavailableChange?.(p.groupUnavailableAtBottom)
    onSortByPlannedChange?.(p.sortByPlannedTime)
    onViewModeChange?.(p.viewMode)
    onClose()
  }

  function handleReset() { setP({ ...DEFAULTS }) }

  return (
    <aside className="dp-drawer">
      <div className="dp-header">
        <span className="dp-title">Display Preferences</span>
        <button className="dp-close-btn" onClick={onClose} aria-label="Close">
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="dp-divider" />

      {/* Board Type dropdown */}
      <div className="dp-section dp-section-top">
        <BoardTypeDropdown value={p.viewMode} onChange={v => set('viewMode', v)} />
      </div>

      {/* Display Options */}
      <div className="dp-section">
        <div className="dp-section-heading">Display Options</div>
        <PrefCheckbox checked={p.showDriverName}          onChange={v => set('showDriverName', v)}          label="Show Driver Name" />
        <PrefCheckbox checked={p.showRunName}             onChange={v => set('showRunName', v)}             label="Show Run Name" />
        <PrefCheckbox checked={p.sortByPlannedTime}       onChange={v => set('sortByPlannedTime', v)}       label="Sort by Planned Time" />
        <PrefCheckbox checked={p.groupUnavailableAtBottom} onChange={v => set('groupUnavailableAtBottom', v)} label="Group Unavailable at Bottom" />
      </div>

      {/* Other Options */}
      <div className="dp-section">
        <div className="dp-section-heading">Other Options</div>
        <PrefCheckbox checked={p.showEarlyAsOnTime}      onChange={v => set('showEarlyAsOnTime', v)}      label="Show Early Vehicles as On Time" />
        <PrefCheckbox checked={p.showLateArrivalsOnly}   onChange={v => set('showLateArrivalsOnly', v)}   label="Show Late Arrivals Only" />
        <PrefCheckbox checked={p.hideUnavailableVehicles} onChange={v => set('hideUnavailableVehicles', v)} label="Hide Unavailable Vehicles" />
      </div>

      {/* Buttons */}
      <div className="dp-buttons">
        <button className="dp-apply-btn" onClick={handleApply}>Apply</button>
        <button className="dp-reset-btn" onClick={handleReset}>Reset</button>
      </div>
    </aside>
  )
}
