import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import Notification from './components/Shared/Notification'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <BrowserRouter>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <AuthPage 
              setIsAuthenticated={setIsAuthenticated}
              showNotification={showNotification}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <DashboardPage 
              setIsAuthenticated={setIsAuthenticated}
              showNotification={showNotification}
            /> : 
            <Navigate to="/" />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App