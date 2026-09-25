import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home page-shell">
      <main className="home-content">
        <h1>Velocidade e eficiência no seu dia-a-dia</h1>
        <p>
          No Resolve Aí, você pode registrar problemas e pedir melhorias em seu bairro, condomínio ou empresa. Se inscreva e acompanhe as soluções implementadas!        </p>
        <button className="primary-button register-button" onClick={() => navigate('/register')}>
          Faça seu cadastro
        </button>
      </main>

      <footer className="site-footer"><span>Todos os direitos reservados a FIAP</span></footer>
    </div>
  )
}
