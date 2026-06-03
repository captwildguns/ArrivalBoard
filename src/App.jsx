import React, { useState, useEffect, useCallback } from 'react'
import SchoolBoard from './components/SchoolBoard.jsx'
import UserPreferencesPage from './components/UserPreferencesPage.jsx'
import SchoolSelector from './components/SchoolSelector.jsx'
import { schools, generateInitialBuses, simulateUpdate } from './data/sampleData.js'

const NAV_LINKS = [
  { key: 'board',            label: 'Board',            icon: 'directions_bus' },
  { key: 'map',              label: 'Map',              icon: 'map' },
  { key: 'kpi',              label: 'KPI',              icon: 'donut_large' },
  { key: 'vehicle-search',   label: 'Vehicle Search',   icon: 'search' },
  { key: 'user-preferences', label: 'User Preferences', icon: 'settings' },
]

const DEFAULT_PREFS = {
  coloredKpiTiles: false,
  kpiOverlay: true,
  vehicleClustering: true,
  stopTimeBuffer: '30 min',
  showWeatherIcon: true,
  showTemperature: true,
  showClock: true,
  tempUnit: 'Fahrenheit',
  clockFormat: '12h',
}

function useCurrentTime() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function TylerLogo() {
  return (
    <svg className="tyler-logo" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Tyler Technologies">
      <circle cx="14" cy="4"  r="2.2" fill="white"/>
      <circle cx="14" cy="24" r="2.2" fill="white"/>
      <circle cx="4"  cy="14" r="2.2" fill="white"/>
      <circle cx="24" cy="14" r="2.2" fill="white"/>
      <circle cx="7"  cy="7"  r="2.2" fill="white"/>
      <circle cx="21" cy="21" r="2.2" fill="white"/>
      <circle cx="21" cy="7"  r="2.2" fill="white"/>
      <circle cx="7"  cy="21" r="2.2" fill="white"/>
    </svg>
  )
}

export default function App() {
  const [buses, setBuses] = useState(() => generateInitialBuses())
  const [selectedSchoolIds, setSelectedSchoolIds] = useState(schools.map(s => s.locationId))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState('board')
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const currentTime = useCurrentTime()

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => simulateUpdate(prev))
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

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: prefs.clockFormat === '12h',
  })

  const tempDisplay = prefs.tempUnit === 'Fahrenheit' ? '78°' : '26°'

  return (
    <div className="app-root">

      {/* ── Omnibar ── */}
      <header className="app-bar">
        <div className="app-bar-start">
          <button
            className="app-bar-icon-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <span className="material-icons">menu</span>
          </button>
          <TylerLogo />
          <span className="app-bar-title">Arrival Board</span>
        </div>

        <div className="app-bar-center">
          {prefs.showWeatherIcon && (
            <span className="material-icons omnibar-weather-icon">wb_sunny</span>
          )}
          {prefs.showTemperature && (
            <span className="omnibar-temp">{tempDisplay}</span>
          )}
          {prefs.showClock && (
            <span className="omnibar-time">{formattedTime}</span>
          )}
        </div>

        <div className="app-bar-end">
          <button className="app-bar-icon-btn" title="Help documentation" aria-label="Help">
            <span className="material-icons">help_outline</span>
          </button>
          <div className="user-avatar" title="Gabe Guzman">GG</div>
        </div>
      </header>

      <div className="app-body">

        {/* ── Sidebar ── */}
        <nav className={`sidebar${sidebarOpen ? '' : ' sidebar-collapsed'}`}>

          {/* School selector */}
          <div className="sidebar-school-selector">
            <SchoolSelector
              schools={schools}
              selectedIds={selectedSchoolIds}
              onChange={setSelectedSchoolIds}
              buses={buses}
            />
          </div>

          {/* Nav links */}
          <div className="sidebar-nav-divider" />
          <nav className="sidebar-nav">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                className={`sidebar-nav-item${activePage === link.key ? ' active' : ''}`}
                onClick={() => setActivePage(link.key)}
              >
                <span className="material-icons sidebar-nav-icon">{link.icon}</span>
                <span className="sidebar-nav-label">{link.label}</span>
              </button>
            ))}
          </nav>
        </nav>

        {/* ── Main Content ── */}
        <main className="main-content">
          {activePage === 'user-preferences' ? (
            <UserPreferencesPage prefs={prefs} onChange={setPrefs} />
          ) : activePage !== 'board' ? (
            <div className="placeholder-page">
              <span className="material-icons placeholder-icon">
                {NAV_LINKS.find(l => l.key === activePage)?.icon}
              </span>
              <h2>{NAV_LINKS.find(l => l.key === activePage)?.label}</h2>
              <p>This view is not implemented in the mockup.</p>
              <button className="apply-btn" onClick={() => setActivePage('board')}>
                Back to Board
              </button>
            </div>
          ) : visibleSchools.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons empty-state-icon">directions_bus</span>
              <p>Select one or more schools from the sidebar to view arrival boards.</p>
            </div>
          ) : (
            <div className={`boards-grid boards-grid-${Math.min(boardCount, 3)}`}>
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
