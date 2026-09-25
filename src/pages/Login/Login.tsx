import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './Login.css'
import { CurrentUser, UserRole } from '../../auth'

interface LoginProps {
  onLogin: (user: CurrentUser) => void
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<UserRole>('common')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin({ email: email.trim().toLowerCase(), role })
  }

  return (
    <div className="login-page">
      <main className="login-wrapper">
        <section className="login-card">
          <header className="login-header"><span>Faça seu login</span></header>
          <form className="login-content" onSubmit={handleSubmit}>
            <label><span>Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
            <label><span>Senha</span><input type="password" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" required /></label>
            <label><span>Tipo de usuário</span><select value={role} onChange={event => setRole(event.target.value as UserRole)}><option value="common">Usuário comum</option><option value="manager">Gestor</option></select></label>
            <button className="login-submit" type="submit">Entrar</button>
            <button className="login-back" type="button" onClick={() => navigate('/')}>Voltar</button>
          </form>
          <footer className="login-footer">Todos os direitos reservados à FIAP</footer>
        </section>
      </main>
    </div>
  )
}
