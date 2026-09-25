import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './ListIssue.css'

const categories = [
	'Limpeza',
	'Reparo de Equipamentos',
	'Segurança',
	'Vazamento',
	'Sugestão',
	'Outro',
]

const statuses = ['Aberta', 'Em andamento', 'Resolvida']

type Occurrence = {
	id: string
	title: string
	description: string
	category: string
	address: string
	images?: string[]
	status?: string
	createdAt: string
}

function getOccurrences(): Occurrence[] {
	try {
		const savedOccurrences = JSON.parse(localStorage.getItem('occurrences') ?? '[]')
		return Array.isArray(savedOccurrences) ? savedOccurrences : []
	} catch {
		return []
	}
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(date))
}

export default function ListIssue() {
	const navigate = useNavigate()
	const [occurrences, setOccurrences] = useState<Occurrence[]>([])
	const [titleFilter, setTitleFilter] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('')
	const [statusFilter, setStatusFilter] = useState('')

	useEffect(() => {
		setOccurrences(getOccurrences())
	}, [])

	const filteredOccurrences = occurrences.filter(occurrence => {
		const matchesTitle = occurrence.title.toLowerCase().includes(titleFilter.toLowerCase().trim())
		const matchesCategory = !categoryFilter || occurrence.category === categoryFilter
		const matchesStatus = !statusFilter || (occurrence.status ?? 'Aberta') === statusFilter

		return matchesTitle && matchesCategory && matchesStatus
	})

	return (
		<main className="list-issue-page">
			<section className="list-issue-content" aria-labelledby="list-issue-title">
				<header className="list-issue-heading">
					<div>
						<h1 id="list-issue-title">Dashboard do Usuário</h1>
						<p>Acompanhe todas as ocorrências registradas por você.</p>
					</div>
					<button className="list-create-button" type="button" onClick={() => navigate('/create-issue')}>+ Nova ocorrência</button>
				</header>

				<section className="issue-filters" aria-label="Filtros de ocorrências">
					<label className="title-filter">
						<span>Buscar por título</span>
						<input type="search" value={titleFilter} onChange={event => setTitleFilter(event.target.value)} placeholder="Digite um título" />
					</label>
					<label>
						<span>Categoria</span>
						<select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
							<option value="">Todas</option>
							{categories.map(category => <option key={category} value={category}>{category}</option>)}
						</select>
					</label>
					<label>
						<span>Status</span>
						<select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
							<option value="">Todos</option>
							{statuses.map(status => <option key={status} value={status}>{status}</option>)}
						</select>
					</label>
				</section>

				<p className="results-count">{filteredOccurrences.length} {filteredOccurrences.length === 1 ? 'ocorrência encontrada' : 'ocorrências encontradas'}</p>

				{filteredOccurrences.length > 0 ? (
					<section className="issue-list" aria-label="Lista de ocorrências">
						{filteredOccurrences.map(occurrence => (
							<button className="issue-item" key={occurrence.id} type="button" onClick={() => navigate(`/open-issue/${occurrence.id}`)}>
								<div className="issue-item-main">
									<div className="issue-item-topline">
										<h2>{occurrence.title}</h2>
										<span className={`status status-${(occurrence.status ?? 'Aberta').toLowerCase().replaceAll(' ', '-')}`}>{occurrence.status ?? 'Aberta'}</span>
									</div>
									<p>{occurrence.description}</p>
									<div className="issue-meta">
										<span>{occurrence.category}</span>
										<span>{occurrence.address}</span>
										<span>{formatDate(occurrence.createdAt)}</span>
									</div>
								</div>
								{(occurrence.images?.length ?? 0) > 0 && <span className="image-count">{occurrence.images?.length} imagem(ns)</span>}
							</button>
						))}
					</section>
				) : (
					<section className="empty-issues">
						<h2>{occurrences.length === 0 ? 'Você ainda não criou ocorrências' : 'Nenhuma ocorrência encontrada'}</h2>
						<p>{occurrences.length === 0 ? 'Registre um problema ou sugestão para acompanhar sua resolução.' : 'Tente ajustar os filtros para encontrar o que procura.'}</p>
						{occurrences.length === 0 && <button className="submit-button" type="button" onClick={() => navigate('/create-issue')}>Criar primeira ocorrência</button>}
					</section>
				)}
			</section>
		</main>
	)
}
