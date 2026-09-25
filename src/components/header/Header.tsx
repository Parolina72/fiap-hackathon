'use client';

import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="site-header">
      <div className="logo">Resolve Aí</div>
      <button className="login-button home-login" onClick={() => navigate('/login')}>Login</button>
    </header>
  )
}