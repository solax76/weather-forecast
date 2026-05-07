import { useState, useEffect, useRef } from 'react'
import { Form, ListGroup, Spinner } from 'react-bootstrap'
import { searchLocation } from '../utils/api'

export default function LocationSearch({ onLocationSelect, clearSignal = 0 }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (clearSignal === 0) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery('')
    setResults([])
    setShowDropdown(false)
  }, [clearSignal])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchLocation(value)
        setResults(data)
        setShowDropdown(data.length > 0)
      } catch {
        setResults([])
        setShowDropdown(false)
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleSelect = (place) => {
    const label = [place.name, place.admin1, place.country].filter(Boolean).join(', ')
    setQuery(label)
    setShowDropdown(false)
    setResults([])
    onLocationSelect({
      name: place.name,
      admin1: place.admin1 ?? '',
      country: place.country ?? '',
      lat: place.latitude,
      lon: place.longitude,
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowDropdown(false)
  }

  return (
    <div ref={wrapperRef} className="location-search-wrapper flex-grow-1">
      <div style={{ position: 'relative' }}>
        <Form.Control
          type="text"
          placeholder="Cerca un luogo nel mondo..."
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: loading ? '2.5rem' : undefined }}
          autoComplete="off"
        />
        {loading && (
          <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            <Spinner size="sm" animation="border" variant="secondary" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <ListGroup className="location-dropdown">
          {results.map((place, idx) => (
            <ListGroup.Item
              key={`${place.latitude}-${place.longitude}-${idx}`}
              action
              onClick={() => handleSelect(place)}
            >
              <strong>{place.name}</strong>
              {place.admin1 && <span className="text-white-50"> — {place.admin1}</span>}
              {place.country && <span className="ms-1" style={{ fontSize: '0.82rem', opacity: 0.65 }}>({place.country})</span>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
