import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import store from '../store.ts'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,

)
