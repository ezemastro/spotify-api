import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/auth.jsx'
import App from './App.jsx'
import { OverlaysProvider } from './context/overlays.jsx'
import Providers from './components/Providers.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers contextProviders={[AuthProvider, OverlaysProvider]}>
      <App />
    </Providers>
  </StrictMode>
)
