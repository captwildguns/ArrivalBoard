import React, { useMemo, useState } from 'react'
import { EtaStatus } from '../data/sampleData.js'
import { vehicleSearchData } from '../data/vehicleSearchData.js'

const COLORS = {
  early:   '#7986cb',
  onTime:  '#8bc34a',
  late:    '#ef5350',
  pink:    '#f06292',
  olive:   '#9e9d24',
}

function computeKpis(buses, selectedSchoolIds) {
  // Flatten all buses for selected schools
  const allBuses = selectedSchoolIds.flatMap(id => buses[id] ?? [])
  const active = allBuses.filter(b => b.arrivalStatus !== EtaStatus.Unavailable)
  const total  = active.length

  const earlyCount  = active.filter(b => b.arrivalStatus === EtaStatus.Early).length
  const onTimeCount = active.filter(b => b.arrivalStatus === EtaStatus.OnTime).length
  const lateCount   = active.filter(b => b.arrivalStatus === EtaStatus.Late).length
  const arrivedCount = allBuses.filter(b => b.arrivalStatus === EtaStatus.Arrived).length

  const earlyPct  = total ? Math.round((earlyCount  / total) * 100) : 0
  const onTimePct = total ? Math.round((onTimeCount / total) * 100) : 0
  const latePct   = total ? Math.round((lateCount   / total) * 100) : 0

  const numSchools = selectedSchoolIds.length

  const totalVehicles = vehicleSearchData.filter(v => selectedSchoolIds.includes(v.schoolId)).length
  const vehiclesPerSchool = numSchools ? Math.round(totalVehicles / numSchools) : 0
  const totalRuns = vehicleSearchData
    .filter(v => selectedSchoolIds.includes(v.schoolId))
    .reduce((sum, v) => sum + v.runs.length, 0)

  const completionRate = total ? Math.round((arrivedCount / total) * 100) : 0

  // Average delay for late buses (minutes)
  const lateDelays = active
    .filter(b => b.arrivalStatus === EtaStatus.Late && b.eta && b.plannedTime)
    .map(b => Math.round((b.eta - b.plannedTime) / 60000))
  const avgDelay = lateDelays.length
    ? Math.round(lateDelays.reduce((s, v) => s + v, 0) / lateDelays.length)
    : 0

  return [
    { label: 'Early Vehicles',            value: earlyCount,      color: COLORS.early  },
    { label: 'On Time Vehicles',           value: onTimeCount,     color: COLORS.onTime },
    { label: 'Late Vehicles',              value: lateCount,       color: COLORS.late   },
    { label: 'Number Of Schools',          value: numSchools,      color: COLORS.pink   },

    { label: 'Early Vehicles %',           value: earlyPct,        color: COLORS.early  },
    { label: 'On Time Vehicles %',         value: onTimePct,       color: COLORS.onTime },
    { label: 'Late Vehicles %',            value: latePct,         color: COLORS.late   },
    { label: 'Total Vehicles',             value: totalVehicles,   color: COLORS.pink   },

    { label: 'Vehicles Per School',        value: vehiclesPerSchool, color: COLORS.olive },
    { label: 'Total Runs',                 value: totalRuns,       color: COLORS.olive  },
    { label: 'Run Completion Rate %',      value: completionRate,  color: COLORS.late   },
    { label: 'Average Delay Time (minutes)', value: avgDelay,      color: COLORS.olive  },
  ]
}

function KpiTile({ label, value, color }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="kpi-tile">
      <div className="kpi-tile-top">
        <button
          className="kpi-more-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="More options"
        >
          <span className="material-icons">more_vert</span>
        </button>
        {menuOpen && (
          <div className="kpi-menu">
            <button className="kpi-menu-item" onClick={() => setMenuOpen(false)}>
              Change KPI
            </button>
            <button className="kpi-menu-item" onClick={() => setMenuOpen(false)}>
              Remove Tile
            </button>
          </div>
        )}
      </div>
      <div className="kpi-value" style={{ color }}>
        {value}
      </div>
      <div className="kpi-label">{label}</div>
    </div>
  )
}

export default function KpiPage({ buses, selectedSchoolIds }) {
  const kpis = useMemo(
    () => computeKpis(buses, selectedSchoolIds),
    [buses, selectedSchoolIds]
  )

  return (
    <div className="kpi-page">
      <h1 className="kpi-heading">Key Performance Indicators</h1>

      <div className="kpi-grid">
        {kpis.map(kpi => (
          <KpiTile key={kpi.label} {...kpi} />
        ))}
      </div>

      <footer className="app-footer">
        © 2026 - Tyler Technologies. All rights reserved. - Designed with Tyler Forge
        <svg className="forge-logo-mark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 2L14 5.5V12.5L8 16L2 12.5V5.5L8 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M8 5L11.5 7V11L8 13L4.5 11V7L8 5Z" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </footer>
    </div>
  )
}
