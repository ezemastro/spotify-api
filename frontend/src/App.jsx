import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Callback from './pages/Callback.jsx'
import Nav from './components/Nav.jsx'

const Layout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <Outlet />
      </main>
    </>
  )
}

function App () {
  const router = createBrowserRouter([
    {
      path: '/callback',
      element: <Callback />
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '*',
          element: <div>404</div>
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
