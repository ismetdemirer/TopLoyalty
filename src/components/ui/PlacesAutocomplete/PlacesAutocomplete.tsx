'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi'
import {
  Wrapper,
  Label,
  InputRow,
  IconLeft,
  StyledInput,
  Spinner,
  ClearBtn,
  Dropdown,
  DropdownItem,
  ItemContent,
  ItemMain,
  ItemSub,
} from './PlacesAutocomplete.styles'

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlacesResult {
  placeId: string
  name: string
  address: string
  mapsUrl: string
}

interface Props {
  onSelect: (result: PlacesResult) => void
  placeholder?: string
  label?: string
}

export default function PlacesAutocomplete({
  onSelect,
  placeholder = 'Mekan adı yazın...',
  label,
}: Props) {
  const [query, setQuery] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (selected) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setPredictions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.predictions) {
          setPredictions(data.predictions.slice(0, 5))
          setOpen(true)
        }
      } catch {
        /* sessiz hata */
      }
      setLoading(false)
    }, 300)
  }, [query, selected])

  const handleSelect = async (prediction: Prediction) => {
    setOpen(false)
    setSelected(prediction.place_id)
    setQuery(prediction.structured_formatting.main_text)
    setPredictions([])

    try {
      const res = await fetch(`/api/places/details?place_id=${prediction.place_id}`)
      const data = await res.json()
      const result = data.result
      onSelect({
        placeId: prediction.place_id,
        name: result?.name ?? prediction.structured_formatting.main_text,
        address: prediction.structured_formatting.secondary_text,
        mapsUrl: result?.url ?? `https://www.google.com/maps/place/?q=place_id:${prediction.place_id}`,
      })
    } catch {
      onSelect({
        placeId: prediction.place_id,
        name: prediction.structured_formatting.main_text,
        address: prediction.structured_formatting.secondary_text,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${prediction.place_id}`,
      })
    }
  }

  const handleClear = () => {
    setQuery('')
    setSelected(null)
    setPredictions([])
    setOpen(false)
  }

  return (
    <Wrapper ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <InputRow $active={open}>
        <IconLeft><FiSearch /></IconLeft>
        <StyledInput
          type="text"
          value={query}
          onChange={(e) => { setSelected(null); setQuery(e.target.value) }}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => predictions.length > 0 && setOpen(true)}
        />
        {loading && <Spinner />}
        {query && !loading && <ClearBtn type="button" onClick={handleClear}><FiX /></ClearBtn>}
      </InputRow>
      {open && predictions.length > 0 && (
        <Dropdown>
          {predictions.map((p) => (
            <DropdownItem key={p.place_id} onMouseDown={() => handleSelect(p)}>
              <FiMapPin />
              <ItemContent>
                <ItemMain>{p.structured_formatting.main_text}</ItemMain>
                <ItemSub>{p.structured_formatting.secondary_text}</ItemSub>
              </ItemContent>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  )
}
