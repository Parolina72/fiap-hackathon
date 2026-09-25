import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import CreateIssue from './pages/CreateIssue/CreateIssue'
import ListIssue from './pages/ListIssue/ListIssue'
import OpenIssue from './pages/OpenIssue/OpenIssue'
import Header from './components/header/Header'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-issue" element={<CreateIssue />} />
        <Route path="/list-issue" element={<ListIssue />} />
        <Route path="/open-issue/:id" element={<OpenIssue />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
