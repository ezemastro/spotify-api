import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Callback from './pages/auth/Callback.jsx'
import Nav from './components/Nav.jsx'
import Search from './pages/Search.jsx'
import Games from './pages/Games.jsx'

const Layout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexDirection: 'column' }}>
        <Outlet />
        {/* TODO - overlays */}
      </main>
    </>
  )
}

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/callback' element={<Callback />} />
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/search' element={<Search />} />
            <Route path='/games' element={<Games />} />
            <Route path='*' element={<div>404</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
