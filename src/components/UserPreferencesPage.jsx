import React, { useState } from 'react'

function Toggle({ checked, onChange, label }) {
  return (
    <label className="pref-toggle-row">
      <button
        role="switch"
        aria-checked={checked}
        className={`pref-toggle${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className="pref-toggle-thumb" />
      </button>
      <span className="pref-toggle-label">{label}</span>
    </label>
  )
}

function SegmentedGroup({ options, value, onChange }) {
  return (
    <div className="seg-group">
      {options.map(opt => (
        <button
          key={opt}
          className={`seg-btn${value === opt ? ' active' : ''}`}
          onClick={() => onChange(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function UserPreferencesPage({ prefs, onChange }) {
  function set(key, val) { onChange({ ...prefs, [key]: val }) }

  return (
    <div className="user-prefs-page">
      <div className="user-prefs-content">
        <h1 className="user-prefs-heading">User Preferences</h1>
        <div className="user-prefs-divider" />

        {/* KPI Preferences */}
        <section className="prefs-section-block">
          <h2 className="prefs-section-heading">KPI Preferences</h2>
          <Toggle
            checked={prefs.coloredKpiTiles}
            onChange={v => set('coloredKpiTiles', v)}
            label="Enable Colored KPI Tiles"
          />
          <Toggle
            checked={prefs.kpiOverlay}
            onChange={v => set('kpiOverlay', v)}
            label="Enable KPI Overlay (Maps Only)"
          />
        </section>

        {/* Map */}
        <section className="prefs-section-block">
          <h2 className="prefs-section-heading">Map</h2>
          <Toggle
            checked={prefs.vehicleClustering}
            onChange={v => set('vehicleClustering', v)}
            label="Enable Vehicle Clustering"
          />
        </section>

        {/* School Stop Time Buffer */}
        <section className="prefs-section-block">
          <h2 className="prefs-section-heading">
            School Stop Time Buffer
            <button className="info-icon-btn" title="Controls how long before and after a stop vehicles remain visible" type="button">
              <span className="material-icons">info</span>
            </button>
          </h2>
          <SegmentedGroup
            options={['15 min', '30 min', '45 min', '60 min']}
            value={prefs.stopTimeBuffer}
            onChange={v => set('stopTimeBuffer', v)}
          />
        </section>

        {/* Weather / Time */}
        <section className="prefs-section-block">
          <h2 className="prefs-section-heading">Weather / Time</h2>
          <div className="weather-time-grid">
            <div className="weather-time-col">
              <label className="pref-check-row">
                <input
                  type="checkbox"
                  className="pref-checkbox"
                  checked={prefs.showWeatherIcon}
                  onChange={e => set('showWeatherIcon', e.target.checked)}
                />
                <span className="pref-check-label">Show weather icon</span>
              </label>
              <label className="pref-check-row">
                <input
                  type="checkbox"
                  className="pref-checkbox"
                  checked={prefs.showTemperature}
                  onChange={e => set('showTemperature', e.target.checked)}
                />
                <span className="pref-check-label">Show temperature</span>
              </label>
              <SegmentedGroup
                options={['Fahrenheit', 'Celsius']}
                value={prefs.tempUnit}
                onChange={v => set('tempUnit', v)}
              />
            </div>
            <div className="weather-time-col">
              <label className="pref-check-row">
                <input
                  type="checkbox"
                  className="pref-checkbox"
                  checked={prefs.showClock}
                  onChange={e => set('showClock', e.target.checked)}
                />
                <span className="pref-check-label">Show clock</span>
              </label>
              <SegmentedGroup
                options={['12h', '24h']}
                value={prefs.clockFormat}
                onChange={v => set('clockFormat', v)}
              />
            </div>
          </div>
        </section>
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
