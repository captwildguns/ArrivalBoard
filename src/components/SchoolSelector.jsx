import React, { useState, useRef, useEffect } from 'react'

export default function SchoolSelector({ schools, selectedIds, onChange, buses }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function toggle(id) {
    if (selectedIds.includes(id)) {
      // don't allow deselecting all
      if (selectedIds.length > 1) onChange(selectedIds.filter(s => s !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  // Label shown in the collapsed input
  const displayText = (() => {
    if (selectedIds.length === 0) return 'None selected'
    if (selectedIds.length === schools.length) return 'All Schools'
    if (selectedIds.length === 1) {
      return schools.find(s => s.locationId === selectedIds[0])?.schoolName ?? ''
    }
    return `${selectedIds.length} Schools`
  })()

  return (
    <div className="school-selector-root" ref={wrapperRef}>
      {/* Input trigger */}
      <div
        className={`school-selector-input${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o) }}
      >
        <span className="school-selector-floating-label">School</span>
        <span className="school-selector-value">{displayText}</span>
        <span className={`material-icons school-selector-arrow${open ? ' rotated' : ''}`}>
          arrow_drop_down
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <ul className="school-selector-dropdown" role="listbox">
          {schools.map(school => {
            const isSelected = selectedIds.includes(school.locationId)
            // Get live active count from buses prop
            const activeCount = (buses[school.locationId] ?? []).filter(
              b => b.arrivalStatus !== 'Unavailable'
            ).length
            const hasActive = activeCount > 0

            return (
              <li
                key={school.locationId}
                className={`school-selector-item${isSelected ? ' selected' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => toggle(school.locationId)}
              >
                <span className="school-selector-item-name">{school.schoolName}</span>
                <span className="school-selector-item-right">
                  <span className="school-selector-count">{activeCount}</span>
                  <span className={`school-selector-circle${hasActive ? ' active' : ''}`} />
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
