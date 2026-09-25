import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../styles/layout.css'
import './OpenIssue.css'
import { CurrentUser } from '../../auth'

const statuses = ['Aberta', 'Em análise', 'Em atendimento', 'Cancelada', 'Resolvida']
const priorities = ['Baixa', 'Média', 'Alta', 'Urgente']

type Comment = {
	id: string
	text: string
	createdAt: string
	authorEmail?: string
}

type StatusHistory = {
	previousStatus: string
	newStatus: string
	changedAt: string
	actorEmail?: string
	solution?: string
	previousResponsible?: string
	newResponsible?: string
}

type Occurrence = {
	id: string
	title: string
	description: string
	category: string
	address: string
	images?: string[]
	status?: string
	authorEmail?: string
	priority?: string
	responsible?: string
	solution?: string
	rating?: number
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

export default function OpenIssue({ currentUser }: { currentUser: CurrentUser }) {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [occurrence, setOccurrence] = useState<Occurrence | null>(null)
	const [comment, setComment] = useState('')
	const [editStatus, setEditStatus] = useState('Aberta')
	const [editPriority, setEditPriority] = useState('Média')
	const [editResponsible, setEditResponsible] = useState('')
	const [editSolution, setEditSolution] = useState('')
	const [rating, setRating] = useState('')
	const [savedMessage, setSavedMessage] = useState('')

	useEffect(() => {
		const savedOccurrence = getOccurrences().find(item => item.id === id) ?? null
		setOccurrence(savedOccurrence)
		setEditStatus(savedOccurrence?.status ?? 'Aberta')
		setEditPriority(savedOccurrence?.priority ?? 'Média')
		setEditResponsible(savedOccurrence?.responsible ?? '')
		setEditSolution(savedOccurrence?.solution ?? '')
	}, [id])

	function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!occurrence || !comment.trim()) return

		const newComment: Comment = {
			id: crypto.randomUUID(),
			text: comment.trim(),
			createdAt: new Date().toISOString(),
			authorEmail: currentUser.email,
		}
		const updatedOccurrence = { ...occurrence, comments: [...(occurrence.comments ?? []), newComment] }
		const updatedOccurrences = getOccurrences().map(item => item.id === occurrence.id ? updatedOccurrence : item)

		localStorage.setItem('occurrences', JSON.stringify(updatedOccurrences))
		setOccurrence(updatedOccurrence)
		setComment('')
	}

	function handleManagerUpdate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!occurrence || currentUser.role !== 'manager' || ['Resolvida', 'Cancelada'].includes(occurrence.status ?? '') || (editStatus === 'Resolvida' && !editSolution.trim())) return

		const statusChanged = editStatus !== (occurrence.status ?? 'Aberta')
		const updatedResponsible = editResponsible.trim()
		const responsibleChanged = updatedResponsible !== (occurrence.responsible ?? '')
		const historyChanged = statusChanged || responsibleChanged
		const updatedOccurrence: Occurrence = {
			...occurrence,
			status: editStatus,
			priority: editPriority,
			responsible: updatedResponsible,
			solution: editSolution.trim(),
			statusHistory: historyChanged
				? [...(occurrence.statusHistory ?? []), {
					previousStatus: occurrence.status ?? 'Aberta',
					newStatus: editStatus,
					changedAt: new Date().toISOString(),
					actorEmail: currentUser.email,
					solution: editStatus === 'Resolvida' ? editSolution.trim() : undefined,
					previousResponsible: responsibleChanged ? occurrence.responsible ?? '' : undefined,
					newResponsible: responsibleChanged ? updatedResponsible : undefined,
				}]
				: occurrence.statusHistory,
		}
		const updatedOccurrences = getOccurrences().map(item => item.id === occurrence.id ? updatedOccurrence : item)
		localStorage.setItem('occurrences', JSON.stringify(updatedOccurrences))
		setOccurrence(updatedOccurrence)
		setSavedMessage('Alterações salvas.')
	}

	function handleRatingSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!occurrence || !rating) return

		const updatedOccurrence = { ...occurrence, rating: Number(rating) }
		const updatedOccurrences = getOccurrences().map(item => item.id === occurrence.id ? updatedOccurrence : item)
		localStorage.setItem('occurrences', JSON.stringify(updatedOccurrences))
		setOccurrence(updatedOccurrence)
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

	const isOwner = occurrence.authorEmail?.toLowerCase() === currentUser.email.toLowerCase()
	if (currentUser.role === 'common' && !isOwner) {
		return (
			<main className="open-issue-page">
				<section className="open-issue-empty">
					<h1>Acesso não autorizado</h1>
					<p>Você só pode consultar as ocorrências que registrou.</p>
					<button className="open-secondary-button" type="button" onClick={() => navigate('/list-issue')}>Voltar para ocorrências</button>
				</section>
			</main>
		)
	}

	const history = occurrence.statusHistory ?? [{ previousStatus: 'Inicial', newStatus: occurrence.status ?? 'Aberta', changedAt: occurrence.createdAt }]
	const canManage = currentUser.role === 'manager' && !['Resolvida', 'Cancelada'].includes(occurrence.status ?? '')
	const canComment = currentUser.role === 'manager' || (isOwner && !['Resolvida', 'Cancelada'].includes(occurrence.status ?? 'Aberta'))
	const canRate = currentUser.role === 'common' && isOwner && occurrence.status === 'Resolvida' && occurrence.rating === undefined

	return (
		<main className="open-issue-page">
			<section className="open-issue-layout" aria-labelledby="open-issue-title">
				<button className="back-link" type="button" onClick={() => navigate('/list-issue')}>← Voltar para ocorrências</button>
				<header className="open-issue-header">
					<div>
						<h1 id="open-issue-title">{occurrence.title}</h1>
					</div>
					<span className={`open-status status-${(occurrence.status ?? 'Aberta').toLowerCase().replaceAll(' ', '-')}`}>{occurrence.status ?? 'Aberta'}</span>
				</header>

				<div className="open-issue-grid">
					<div className="open-issue-main">
						<section className="read-only-panel" aria-label="Informações da ocorrência">
							<div className="read-only-field"><span>Descrição</span><p>{occurrence.description}</p></div>
							<div className="read-only-field"><span>Categoria</span><p>{occurrence.category}</p></div>
							<div className="read-only-field"><span>Endereço</span><p>{occurrence.address}</p></div>
							<div className="read-only-field"><span>Imagens</span><p>{occurrence.images?.length ? occurrence.images.join(', ') : 'Nenhuma imagem anexada'}</p></div>
							<div className="read-only-field"><span>Prioridade</span><p>{occurrence.priority ?? 'Média'}</p></div>
							<div className="read-only-field"><span>Responsável</span><p>{occurrence.responsible || 'Ainda não atribuído'}</p></div>
						</section>

						{canManage && (
							<form className="issue-edit-panel" onSubmit={handleManagerUpdate}>
								<h2>Atualizar ocorrência</h2>
								<label><span>Status</span><select value={editStatus} onChange={event => { setEditStatus(event.target.value); setSavedMessage('') }}>{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select></label>
								<label><span>Prioridade</span><select value={editPriority} onChange={event => setEditPriority(event.target.value)}>{priorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}</select></label>
								<label><span>Responsável</span><input value={editResponsible} onChange={event => setEditResponsible(event.target.value)} placeholder="Nome ou email do responsável" /></label>
								<label><span>Solução aplicada{editStatus === 'Resolvida' && <b aria-hidden="true"> *</b>}</span><textarea value={editSolution} onChange={event => setEditSolution(event.target.value)} rows={4} required={editStatus === 'Resolvida'} placeholder="Descreva como a ocorrência foi resolvida" /></label>
								{savedMessage && <p className="save-message" role="status">{savedMessage}</p>}
								<button className="open-primary-button" type="submit">Salvar alterações</button>
							</form>
						)}

						<section className="comments-panel" aria-labelledby="comments-title">
							<h2 id="comments-title">Comentários</h2>
							{canComment && <form className="comment-form" onSubmit={handleCommentSubmit}>
								<textarea value={comment} onChange={event => setComment(event.target.value)} rows={3} placeholder="Adicione um comentário" aria-label="Novo comentário" />
								<button className="open-primary-button" type="submit" disabled={!comment.trim()}>Adicionar comentário</button>
							</form>}
							{occurrence.comments?.length ? <div className="comments-list">{occurrence.comments.map(item => <article className="comment-item" key={item.id}><p>{item.text}</p><time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}{item.authorEmail ? ` · ${item.authorEmail}` : ''}</time></article>)}</div> : <p className="no-comments">Ainda não há comentários.</p>}
						</section>

						{canRate && <form className="rating-panel" onSubmit={handleRatingSubmit}>
							<h2>Avalie a resolução</h2>
							<p>Como você avalia a solução aplicada?</p>
							<label><span>Nota</span><select value={rating} onChange={event => setRating(event.target.value)} required><option value="" disabled>Selecione de 1 a 5</option>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} {value === 1 ? 'estrela' : 'estrelas'}</option>)}</select></label>
							<button className="open-primary-button" type="submit">Enviar avaliação</button>
						</form>}
						{occurrence.rating !== undefined && <section className="rating-panel"><h2>Avaliação da resolução</h2><p>{occurrence.rating} de 5 estrelas</p></section>}
					</div>

					<section className="history-panel" aria-labelledby="history-title">
						<h2 id="history-title">Histórico da ocorrência</h2>
						<div className="history-list">
							{history.map((item, index) => <article className="history-item" key={`${item.changedAt}-${index}`}>
								<span className="history-dot" />
								<div>
									{item.previousStatus !== item.newStatus && <p><strong>{item.previousStatus}</strong><span>→</span><strong>{item.newStatus}</strong></p>}
									{item.previousResponsible !== undefined && <p><strong>Responsável:</strong> {item.previousResponsible || 'Não atribuído'}<span>→</span>{item.newResponsible || 'Não atribuído'}</p>}
									<time dateTime={item.changedAt}>{formatDateTime(item.changedAt)}{item.actorEmail ? ` · ${item.actorEmail}` : ''}</time>
									{item.solution && <p className="history-solution">Solução: {item.solution}</p>}
								</div>
							</article>)}
						</div>
					</section>
				</div>
			</section>
		</main>
	)
}
