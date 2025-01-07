import { useSearchParams } from 'react-router-dom'
import { backendFetch } from '../utils/fetch'
import { useEffect, useRef, useState } from 'react'
import Item from '../components/Item'
import { SPOTIFY_ITEM_TYPES } from '../config'

export default function Search () {
  const [searchParams] = useSearchParams()
  const [displayItems, setDisplayItems] = useState([])

  const isInitialMount = useRef(true)

  const search = async (query, { type = 'track', limit = 20, offset = 0 } = {}) => {
    if (!query) return
    const response = await backendFetch('/spotify/search', { params: `${new URLSearchParams({ q: query, type, limit, offset }).toString()}` })
    const resItems = []

    Object.entries(response.data).forEach(([key, value]) => {
      if (Object.values(SPOTIFY_ITEM_TYPES).includes(key.slice(0, -1))) resItems.push(...value.items)
    })

    setDisplayItems(resItems)
  }

  useEffect(() => {
    if (!isInitialMount.current) return
    console.log(searchParams.get('query'))
    isInitialMount.current = false
    search(searchParams.get('query'), { type: searchParams.get('type') })
  }, [searchParams])

  const handleSearch = async (e) => {
    e.preventDefault()
    search(e.target.search.value, { type: e.target.type.value })
  }

  const handleUserLibrary = async (e) => {
    backendFetch('/spotify/debug')
  }

  const handleChange = (e) => {
    console.log(e)
    const newUrlParams = new URLSearchParams()
    if (e.target.form.search.value) newUrlParams.append('query', e.target.form.search.value)
    if (e.target.form.type.value !== SPOTIFY_ITEM_TYPES.track) newUrlParams.append('type', e.target.form.type.value)

    if (newUrlParams.toString() === '') return window.location.href.includes('?') && window.history.replaceState(null, '', window.location.href.split('?')[0])
    window.history.replaceState(null, '', `?${newUrlParams.toString()}`)
  }

  return (
    <>
      <form action='' onSubmit={handleSearch} onChange={handleChange} style={{ display: 'flex' }}>
        <button type='submit'>🔍</button>
        <input type='text' name='search' placeholder='Search' defaultValue={searchParams.get('query')} />
        <select name='type' defaultValue={searchParams.get('type') ?? SPOTIFY_ITEM_TYPES.track}>
          {Object.values(SPOTIFY_ITEM_TYPES).map(type => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}
        </select>
        <button type='button' onClick={handleUserLibrary}>📚</button>
      </form>
      <ul>
        {displayItems.length > 0 && displayItems.map(item => <Item key={item.id} {...item} />)}
      </ul>
    </>
  )
}
