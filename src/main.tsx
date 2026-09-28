import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import { store } from './store/store'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif"
  }
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
