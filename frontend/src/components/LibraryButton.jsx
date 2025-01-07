import { backendFetch } from '../utils/fetch.js'

export default function LibraryButton () {
  return (
    <button onClick={async () => { console.log(await backendFetch('/spotify/debug')) }}>LibraryButton</button>
  )
}
