import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('Entrar', { email, senha })
  }

  return (
    <div className="login-page">
      <main className="login-wrapper">
        <section className="login-card">
          <header className="login-header"><span>Faça seu login</span></header>
          <form className="login-content" onSubmit={handleSubmit}>
            <label><span>Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
            <label><span>Senha</span><input type="password" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" /></label>
            <button className="login-submit" type="submit">Entrar</button>
            <button className="login-back" type="button" onClick={() => navigate('/')}>Voltar</button>
          </form>
          <footer className="login-footer">Todos os direitos reservados à FIAP</footer>
        </section>
      </main>
    </div>
  )
}
