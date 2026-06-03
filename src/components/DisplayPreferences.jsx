import React from 'react'

export default function DisplayPreferences({
  columns,
  onColumnsChange,
  showEarlyAsOnTime,
  onShowEarlyAsOnTimeChange,
  tvMode,
  onTvModeChange,
  onClose,
}) {
  function toggle(col) {
    onColumnsChange({ ...columns, [col]: !columns[col] })
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
          { key: 'route', label: 'Route / Run Name' },
          { key: 'students', label: 'Student Count' },
        ].map(({ key, label }) => (
          <label key={key} className="prefs-toggle-row">
            <span className="toggle-label">{label}</span>
            <input
              type="checkbox"
              className="prefs-checkbox"
              checked={columns[key]}
              onChange={() => toggle(key)}
            />
            <span className="toggle-switch" />
          </label>
        ))}
      </div>

      <div className="prefs-section">
        <div className="prefs-section-label">Options</div>
        <label className="prefs-toggle-row">
          <span className="toggle-label">Show Early as On Time</span>
          <input
            type="checkbox"
            className="prefs-checkbox"
            checked={showEarlyAsOnTime}
            onChange={e => onShowEarlyAsOnTimeChange(e.target.checked)}
          />
          <span className="toggle-switch" />
        </label>
        <label className="prefs-toggle-row">
          <span className="toggle-label">TV Mode (1.5× zoom)</span>
          <input
            type="checkbox"
            className="prefs-checkbox"
            checked={tvMode}
            onChange={e => onTvModeChange(e.target.checked)}
          />
          <span className="toggle-switch" />
        </label>
      </div>

      <div className="prefs-footer">
        <button
          className="reset-btn"
          onClick={() => {
            onColumnsChange({ driver: true, route: true, students: false })
            onShowEarlyAsOnTimeChange(false)
            onTvModeChange(false)
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </aside>
  )
}
