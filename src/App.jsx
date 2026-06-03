import React, { useState, useEffect, useCallback } from 'react'
import SchoolBoard from './components/SchoolBoard.jsx'
import { schools, generateInitialBuses, simulateUpdate } from './data/sampleData.js'

export default function App() {
  const [buses, setBuses] = useState(() => generateInitialBuses())
  const [selectedSchoolIds, setSelectedSchoolIds] = useState(schools.map(s => s.locationId))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = e => setDarkMode(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => simulateUpdate(prev))
      setLastUpdated(new Date())
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const toggleSchool = useCallback(id => {
    setSelectedSchoolIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }, [])

  const visibleSchools = schools.filter(s => selectedSchoolIds.includes(s.locationId))
  const boardCount = visibleSchools.length

  return (
    <div className="app-root">
      {/* App Bar */}
      <header className="app-bar">
        <div className="app-bar-start">
          <button
            className="icon-btn app-bar-menu-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <span className="material-icons">menu</span>
          </button>
          <div className="app-bar-brand">
            <svg className="tyler-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Tyler Technologies">
              <rect width="32" height="32" rx="4" fill="white" fillOpacity="0.15" />
              <text x="5" y="22" fontSize="16" fontWeight="700" fill="white" fontFamily="Roboto, sans-serif">T</text>
            </svg>
            <span className="app-bar-title">Arrival Board</span>
          </div>
        </div>
        <div className="app-bar-end">
          <span className="app-bar-update-time">
            Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
          <button
            className="icon-btn app-bar-icon"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="user-avatar" title="Demo User">DU</div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar / Navigation Drawer */}
        <nav className={`sidebar${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
          <div className="sidebar-section-label">Schools</div>
          <ul className="school-list">
            {schools.map(school => {
              const isSelected = selectedSchoolIds.includes(school.locationId)
              const schoolBuses = buses[school.locationId] ?? []
              return (
                <li
                  key={school.locationId}
                  className={`school-list-item${isSelected ? ' selected' : ''}`}
                  onClick={() => toggleSchool(school.locationId)}
                >
                  <label className="school-list-label">
                    <input
                      type="checkbox"
                      className="school-checkbox"
                      checked={isSelected}
                      onChange={() => toggleSchool(school.locationId)}
                      onClick={e => e.stopPropagation()}
                    />
                    <div className="school-info">
                      <span className="school-item-name">{school.schoolName}</span>
                      <span className="school-item-meta">
                        {school.activeVehicleCount} active · {schoolBuses.length} buses
                      </span>
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>

          <div className="sidebar-footer">
            <button
              className="sidebar-action-btn"
              onClick={() => setSelectedSchoolIds(schools.map(s => s.locationId))}
            >
              Select All
            </button>
            <button
              className="sidebar-action-btn"
              onClick={() => setSelectedSchoolIds([])}
            >
              Clear All
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`main-content boards-col-${Math.min(boardCount, 3)}`}>
          {visibleSchools.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons empty-state-icon">directions_bus</span>
              <p>Select one or more schools from the sidebar to view arrival boards.</p>
            </div>
          ) : (
            <div className={`boards-grid boards-grid-${boardCount}`}>
              {visibleSchools.map(school => (
                <SchoolBoard
                  key={school.locationId}
                  school={school}
                  buses={buses[school.locationId] ?? []}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
