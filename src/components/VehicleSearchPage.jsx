import React, { useState, useMemo } from 'react'
import { vehicleSearchData } from '../data/vehicleSearchData.js'

export default function VehicleSearchPage({ selectedSchoolIds }) {
  const [query, setQuery] = useState('')

  const vehicles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = vehicleSearchData.filter(v => selectedSchoolIds.includes(v.schoolId))

    if (q) {
      list = list.filter(v =>
        v.vehicleNumber.toLowerCase().includes(q) ||
        v.runs.some(r => r.name.toLowerCase().includes(q))
      )
    }

    return list.sort((a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber))
  }, [query, selectedSchoolIds])

  return (
    <div className="vs-page">
      <h1 className="vs-heading">Vehicle Search</h1>

      {/* Search input */}
      <div className="vs-search-wrapper">
        <span className="vs-search-label">Vehicle Locator</span>
        <input
          className="vs-search-input"
          type="text"
          placeholder="Vehicle #, Driver, or Run name"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search vehicles"
        />
        {query ? (
          <button className="vs-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            <span className="material-icons">close</span>
          </button>
        ) : (
          <span className="material-icons vs-search-icon">search</span>
        )}
      </div>

      {/* Table */}
      <div className="vs-table">
        {/* Column headers */}
        <div className="vs-header-row">
          <div className="vs-col-vehicle">
            Vehicle #
            <span className="material-icons vs-sort-icon">arrow_upward</span>
          </div>
          <div className="vs-col-runs">Runs</div>
          <div className="vs-col-status">Status</div>
        </div>

        <div className="vs-divider" />

        {/* Vehicle groups */}
        {vehicles.length === 0 ? (
          <div className="vs-empty">No vehicles found</div>
        ) : (
          vehicles.map(vehicle => (
            <VehicleGroup key={`${vehicle.schoolId}-${vehicle.vehicleNumber}`} vehicle={vehicle} />
          ))
        )}
      </div>
    </div>
  )
}

function VehicleGroup({ vehicle }) {
  return (
    <>
      <div className="vs-vehicle-group">
        {/* Vehicle number — vertically centered */}
        <div className="vs-col-vehicle vs-vehicle-number">
          {vehicle.vehicleNumber}
        </div>

        {/* Run list */}
        <div className="vs-col-runs vs-run-list">
          {vehicle.runs.map((run, i) => (
            <div key={i} className="vs-run-row">
              <span className="vs-run-name">{run.name}</span>
              {run.isActive && (
                <span className="vs-active-badge">Active</span>
              )}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="vs-col-status vs-status-cell">
          {vehicle.isActive ? (
            <button className="vs-view-btn">View</button>
          ) : (
            <span className="vs-unavailable">Unavailable</span>
          )}
        </div>
      </div>
      <div className="vs-divider" />
    </>
  )
}
