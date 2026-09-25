import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/layout.css'
import './OpenIssue.css'

type Comment = {
	id: string
	text: string
	createdAt: string
}

type StatusHistory = {
	previousStatus: string
	newStatus: string
	changedAt: string
}

type Occurrence = {
	id: string
	title: string
	description: string
	category: string
	address: string
	images?: string[]
	status?: string
	statusHistory?: StatusHistory[]
	comments?: Comment[]
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

function formatDateTime(date: string) {
	return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export default function OpenIssue() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [occurrence, setOccurrence] = useState<Occurrence | null>(null)
	const [comment, setComment] = useState('')

	useEffect(() => {
		setOccurrence(getOccurrences().find(item => item.id === id) ?? null)
	}, [id])

	function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!occurrence || !comment.trim()) return

		const newComment: Comment = { id: crypto.randomUUID(), text: comment.trim(), createdAt: new Date().toISOString() }
		const updatedOccurrence = { ...occurrence, comments: [...(occurrence.comments ?? []), newComment] }
		const updatedOccurrences = getOccurrences().map(item => item.id === occurrence.id ? updatedOccurrence : item)

		localStorage.setItem('occurrences', JSON.stringify(updatedOccurrences))
		setOccurrence(updatedOccurrence)
		setComment('')
	}

	if (!occurrence) {
		return (
			<main className="open-issue-page">
				<section className="open-issue-empty">
					<h1>Ocorrência não encontrada</h1>
					<p>Essa ocorrência pode ter sido removida ou o endereço é inválido.</p>
					<button className="open-secondary-button" type="button" onClick={() => navigate('/list-issue')}>Voltar para ocorrências</button>
				</section>
			</main>
		)
	}

	const history = occurrence.statusHistory ?? [{ previousStatus: 'Inicial', newStatus: occurrence.status ?? 'Aberta', changedAt: occurrence.createdAt }]

	return (
		<main className="open-issue-page">
			<section className="open-issue-layout" aria-labelledby="open-issue-title">
				<button className="back-link" type="button" onClick={() => navigate('/list-issue')}>← Voltar para ocorrências</button>
				<header className="open-issue-header">
					<div>
						<h1 id="open-issue-title">{occurrence.title}</h1>
					</div>
					<span className="open-status">{occurrence.status ?? 'Aberta'}</span>
				</header>

				<div className="open-issue-grid">
					<div className="open-issue-main">
						<section className="read-only-panel" aria-label="Informações da ocorrência">
							<div className="read-only-field"><span>Descrição</span><p>{occurrence.description}</p></div>
							<div className="read-only-field"><span>Categoria</span><p>{occurrence.category}</p></div>
							<div className="read-only-field"><span>Endereço</span><p>{occurrence.address}</p></div>
							<div className="read-only-field"><span>Imagens</span><p>{occurrence.images?.length ? occurrence.images.join(', ') : 'Nenhuma imagem anexada'}</p></div>
						</section>

						<section className="comments-panel" aria-labelledby="comments-title">
							<h2 id="comments-title">Comentários</h2>
							<form className="comment-form" onSubmit={handleCommentSubmit}>
								<textarea value={comment} onChange={event => setComment(event.target.value)} rows={3} placeholder="Adicione um comentário" aria-label="Novo comentário" />
								<button className="open-primary-button" type="submit" disabled={!comment.trim()}>Adicionar comentário</button>
							</form>
							{occurrence.comments?.length ? <div className="comments-list">{occurrence.comments.map(item => <article className="comment-item" key={item.id}><p>{item.text}</p><time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time></article>)}</div> : <p className="no-comments">Ainda não há comentários.</p>}
						</section>
					</div>

					<section className="history-panel" aria-labelledby="history-title">
						<h2 id="history-title">Histórico da ocorrência</h2>
						<div className="history-list">
							{history.map((item, index) => <article className="history-item" key={`${item.changedAt}-${index}`}><span className="history-dot" /><div><p><strong>{item.previousStatus}</strong><span>→</span><strong>{item.newStatus}</strong></p><time dateTime={item.changedAt}>{formatDateTime(item.changedAt)}</time></div></article>)}
						</div>
					</section>
				</div>
			</section>
		</main>
	)
}
