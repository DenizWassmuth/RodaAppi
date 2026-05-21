import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider.tsx";
import {EventProvider} from "./context/EventProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <EventProvider>
                  <App />
              </EventProvider>
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
