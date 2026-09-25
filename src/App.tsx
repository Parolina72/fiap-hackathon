import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import CreateIssue from './pages/CreateIssue/CreateIssue'
import ListIssue from './pages/ListIssue/ListIssue'
import OpenIssue from './pages/OpenIssue/OpenIssue'
import Header from './components/header/Header'
import { CurrentUser, getCurrentUser } from './auth'

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getCurrentUser())
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <>
      <Header isAuthenticated={Boolean(currentUser)} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLogin={user => {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('currentUser', JSON.stringify(user))
            setCurrentUser(user)
            navigate('/')
          }} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/create-issue" element={currentUser ? <CreateIssue currentUser={currentUser} /> : <Navigate to="/login" replace />} />
        <Route path="/list-issue" element={currentUser ? <ListIssue currentUser={currentUser} /> : <Navigate to="/login" replace />} />
        <Route path="/open-issue/:id" element={currentUser ? <OpenIssue currentUser={currentUser} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
