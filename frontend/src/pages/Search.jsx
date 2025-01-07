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
      if (Object.values(SPOTIFY_ITEM_TYPES).includes(key)) resItems.push(...value.items)
    })

    setDisplayItems(resItems)
  }

  useEffect(() => {
    if (!isInitialMount.current) return
    console.log(searchParams.get('query'))
    isInitialMount.current = false
    search(searchParams.get('query'))
  }, [searchParams])

  const handleSearch = async (e) => {
    e.preventDefault()
    search(e.target.search.value)
  }

  const handleUserLibrary = async (e) => {
    backendFetch('/spotify/debug')
  }

  const handleInputChange = (e) => {
    if (!e.target.value) return window.location.href.includes('?') && window.history.replaceState(null, '', window.location.href.split('?')[0])
    window.history.replaceState(null, '', `?query=${e.target.value}`)
  }

  console.log(displayItems)
  return (
    <>
      <form action='' onSubmit={handleSearch}>
        <button type='submit'>🔍</button>
        <input type='text' name='search' placeholder='Search' defaultValue={searchParams.get('query')} onChange={handleInputChange} />
        <button type='button' onClick={handleUserLibrary}>📚</button>
      </form>
      <ul>
        {displayItems.length ? displayItems.map(item => <Item key={item.id} {...item} />) : null}
      </ul>
    </>
  )
}
