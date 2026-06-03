import React, { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { EtaStatus, formatTime } from '../data/sampleData.js'

// School center coords (Springfield, IL area)
const SCHOOL_COORDS = {
  1: [39.7950, -89.6540],
  2: [39.7870, -89.6480],
  3: [39.7820, -89.6600],
}

// Pre-placed bus offsets so markers look naturally scattered
const BUS_OFFSETS = {
  '101-1': [ 0.012, -0.018], '203-1': [-0.008,  0.014], '305-1': [ 0.018,  0.006],
  '412-1': [-0.014, -0.010], '518-1': [ 0.006, -0.022], '624-1': [-0.020,  0.016],
  '102-2': [ 0.010,  0.020], '207-2': [-0.016,  0.004], '314-2': [ 0.004, -0.018],
  '421-2': [-0.010,  0.012], '556-2': [ 0.014, -0.008],
  '103-3': [-0.006,  0.018], '215-3': [ 0.016,  0.002], '332-3': [-0.012, -0.016],
  '440-3': [ 0.008,  0.010],
}

function busCoords(bus) {
  const base = SCHOOL_COORDS[bus.schoolId] ?? [39.791, -89.654]
  const off = BUS_OFFSETS[bus.id] ?? [0, 0]
  return [base[0] + off[0], base[1] + off[1]]
}

function statusColor(status) {
  switch (status) {
    case EtaStatus.Early:   return '#90caf9'
    case EtaStatus.OnTime:  return '#a5d6a7'
    case EtaStatus.Late:    return '#ef9a9a'
    case EtaStatus.Arrived: return '#ffc100'
    default:                return '#ffc100'
  }
}

function makeBusIcon(color) {
  return L.divIcon({
    html: `<div style="
      width:26px;height:14px;
      background:${color};
      border-radius:3px 3px 2px 2px;
      border:1.5px solid rgba(0,0,0,0.5);
      box-shadow:0 1px 4px rgba(0,0,0,0.6);
      position:relative;
    ">
      <div style="
        position:absolute;top:2px;left:2px;right:2px;
        height:5px;background:rgba(0,0,0,0.25);
        border-radius:1px;
      "></div>
    </div>`,
    className: '',
    iconSize: [26, 14],
    iconAnchor: [13, 7],
  })
}

const SCHOOL_ICON = L.divIcon({
  html: `<span class="material-icons" style="font-size:32px;color:#7986cb;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6))">school</span>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

function getStatusBadgeClass(status) {
  switch (status) {
    case EtaStatus.Early:            return 'badge-early'
    case EtaStatus.OnTime:           return 'badge-ontime'
    case EtaStatus.Late:             return 'badge-late'
    case EtaStatus.Arrived:          return 'badge-yellow'
    case EtaStatus.Departed:         return 'badge-yellow'
    case EtaStatus.PendingDeparture: return 'badge-yellow'
    default:                         return 'badge-unavailable'
  }
}

function statusLabel(status) {
  switch (status) {
    case EtaStatus.Early:            return 'Early'
    case EtaStatus.OnTime:           return 'On Time'
    case EtaStatus.Late:             return 'Late'
    case EtaStatus.Arrived:          return 'Arrived'
    case EtaStatus.Departed:         return 'Departed'
    case EtaStatus.PendingDeparture: return 'Pending Departure'
    default:                         return 'Unavailable'
  }
}

function VehicleCard({ bus }) {
  const isDeparting = bus.arrivalStatus === EtaStatus.Arrived ||
                      bus.arrivalStatus === EtaStatus.PendingDeparture ||
                      bus.arrivalStatus === EtaStatus.Departed
  const timeLabel = isDeparting ? 'Departing' : 'Arriving'
  const displayTime = isDeparting
    ? (bus.departedTime ?? bus.plannedTime)
    : (bus.eta ?? bus.plannedTime)

  return (
    <div className="mvc-card">
      <div className="mvc-header">
        <span className="mvc-run-name">{bus.runName}</span>
        <span className={`mvc-badge ${getStatusBadgeClass(bus.arrivalStatus)}`}>
          {statusLabel(bus.arrivalStatus)}
        </span>
      </div>
      <div className="mvc-details">
        <div className="mvc-row">
          <span className="mvc-key">{timeLabel}:</span>
          <span className="mvc-val">{formatTime(displayTime)}</span>
        </div>
        <div className="mvc-row">
          <span className="mvc-key">Vehicle:</span>
          <span className="mvc-val">{bus.busNumber}</span>
        </div>
        <div className="mvc-row">
          <span className="mvc-key">Driver:</span>
          <span className="mvc-val">{bus.driver || '—'}</span>
        </div>
        <div className="mvc-row">
          <span className="mvc-key">Student Count:</span>
          <span className="mvc-val">{bus.studentCount}</span>
        </div>
      </div>
    </div>
  )
}

export default function MapPage({ buses, selectedSchoolIds, schools }) {
  const mapRef     = useRef(null)
  const mapObj     = useRef(null)
  const markers    = useRef({})
  const schoolMrks = useRef([])
  const [query, setQuery]         = useState('')
  const [lastCheck, setLastCheck] = useState(new Date())

  // Tick the "last check" every 10 seconds to match live-update feel
  useEffect(() => {
    const id = setInterval(() => setLastCheck(new Date()), 10000)
    return () => clearInterval(id)
  }, [])

  // Init map once
  useEffect(() => {
    if (mapObj.current) return
    const map = L.map(mapRef.current, {
      center: [39.7900, -89.6540],
      zoom: 13,
      zoomControl: false,
    })
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>', subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map)
    L.control.zoom({ position: 'topright' }).addTo(map)
    mapObj.current = map

    return () => { map.remove(); mapObj.current = null }
  }, [])

  // Add/update school markers
  useEffect(() => {
    if (!mapObj.current) return
    schoolMrks.current.forEach(m => m.remove())
    schoolMrks.current = []
    selectedSchoolIds.forEach(id => {
      const coords = SCHOOL_COORDS[id]
      if (!coords) return
      const m = L.marker(coords, { icon: SCHOOL_ICON }).addTo(mapObj.current)
      schoolMrks.current.push(m)
    })
  }, [selectedSchoolIds])

  // Add/update bus markers
  const allBuses = useMemo(
    () => selectedSchoolIds.flatMap(id => buses[id] ?? []),
    [buses, selectedSchoolIds]
  )

  useEffect(() => {
    if (!mapObj.current) return
    const seen = new Set()
    allBuses.forEach(bus => {
      seen.add(bus.id)
      if (bus.arrivalStatus === EtaStatus.Unavailable) {
        markers.current[bus.id]?.remove()
        delete markers.current[bus.id]
        return
      }
      const coords = busCoords(bus)
      const icon   = makeBusIcon(statusColor(bus.arrivalStatus))
      if (markers.current[bus.id]) {
        markers.current[bus.id].setLatLng(coords).setIcon(icon)
      } else {
        const m = L.marker(coords, { icon })
          .addTo(mapObj.current)
          .bindPopup(`<b>${bus.busNumber}</b><br>${bus.runName}<br>Driver: ${bus.driver}`)
        markers.current[bus.id] = m
      }
    })
    // Remove stale markers
    Object.keys(markers.current).forEach(id => {
      if (!seen.has(id)) { markers.current[id].remove(); delete markers.current[id] }
    })
  }, [allBuses])

  // Filter for sidebar
  const filteredBuses = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q
      ? allBuses.filter(b =>
          b.busNumber.toLowerCase().includes(q) ||
          b.runName.toLowerCase().includes(q) ||
          (b.driver ?? '').toLowerCase().includes(q)
        )
      : allBuses
  }, [allBuses, query])

  const checkTimeStr = lastCheck.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  })

  return (
    <div className="map-page">

      {/* Page header */}
      <div className="map-page-header">
        <h1 className="map-heading">Map</h1>
        <button className="app-bar-icon-btn map-filter-btn" aria-label="Filter">
          <span className="material-icons">filter_alt</span>
        </button>
      </div>

      {/* Connection banner */}
      <div className="map-connection-banner">
        <span className="material-icons map-banner-icon">directions_bus</span>
        You are connected and getting live updates (Last Check: {checkTimeStr})
      </div>

      {/* Map + sidebar */}
      <div className="map-content">
        {/* Leaflet map */}
        <div className="map-canvas" ref={mapRef} />

        {/* Vehicle locator sidebar */}
        <div className="map-sidebar">
          <div className="map-vehicle-locator">
            <span className="map-locator-label">Vehicle Locator</span>
            <div className="map-locator-input-wrap">
              <input
                className="map-locator-input"
                type="text"
                placeholder="Vehicle #, Driver, or Run name"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query
                ? <button className="map-locator-clear" onClick={() => setQuery('')}>
                    <span className="material-icons">close</span>
                  </button>
                : <span className="material-icons map-locator-icon">search</span>
              }
            </div>
          </div>

          <div className="map-vehicle-list">
            {filteredBuses.map(bus => (
              <VehicleCard key={bus.id} bus={bus} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
