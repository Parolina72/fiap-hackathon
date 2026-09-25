'use client';

import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  isAuthenticated: boolean
  onLogout: () => void
}

export default function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="site-header">
      <div className="logo">Resolve Aí</div>
      <nav className="header-actions" aria-label="Navegação principal">
        {isAuthenticated && <>
          <button className="header-nav-button" type="button" onClick={() => navigate('/list-issue')}>Ocorrências</button>
        </>}
        <button
          className="login-button home-login"
          onClick={() => isAuthenticated ? onLogout() : navigate('/login')}
        >
          {isAuthenticated ? 'Sair' : 'Login'}
        </button>
      </nav>
    </header>
  )
}