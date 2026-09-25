import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './Register.css'

export default function Register() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!nome || !cpf || !email || !senha) {
      alert('Preencha todos os campos')
      return
    }
    console.log({ nome, cpf, email, senha })
    navigate('/')
  }

  return (
    <div className="register-page">
      <main className="register-wrapper">
        <section className="register-card">
          <header className="register-header"><span>Faça seu cadastro</span></header>
          <form className="register-content" onSubmit={register}>
            <label><span>Nome</span><input value={nome} onChange={e => setNome(e.target.value)} autoComplete="name" /></label>
            <label><span>CPF</span><input value={cpf} onChange={e => setCpf(e.target.value)} inputMode="numeric" /></label>
            <label><span>Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
            <label><span>Senha</span><input type="password" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="new-password" /></label>
            <button className="register-submit" type="submit">Cadastrar</button>
            <button className="register-back" type="button" onClick={() => navigate(-1)}>Voltar</button>
          </form>
          <footer className="register-footer">Todos os direitos reservados à FIAP</footer>
        </section>
      </main>
    </div>
  )
}
