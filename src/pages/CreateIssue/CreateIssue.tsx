import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout.css'
import './CreateIssue.css'
import { CurrentUser } from '../../auth'

const categories = [
	'Limpeza',
	'Reparo de Equipamentos',
	'Segurança',
	'Vazamento',
	'Sugestão',
	'Outro',
]

type Occurrence = {
	id: string
	title: string
	description: string
	category: string
	address: string
	images: string[]
	status: 'Aberta'
	authorEmail: string
	priority: string
	responsible: string
	statusHistory: StatusHistory[]
	createdAt: string
}

type StatusHistory = {
	previousStatus: string
	newStatus: string
	changedAt: string
}

export default function CreateIssue({ currentUser }: { currentUser: CurrentUser }) {
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [address, setAddress] = useState('')
	const [images, setImages] = useState<File[]>([])
	const [submitted, setSubmitted] = useState(false)

	function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
		setImages(Array.from(event.target.files ?? []))
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const occurrence: Occurrence = {
			id: crypto.randomUUID(),
			title: title.trim(),
			description: description.trim(),
			category,
			address: address.trim(),
			images: images.map(image => image.name),
			status: 'Aberta',
			authorEmail: currentUser.email,
			priority: 'Média',
			responsible: '',
			statusHistory: [{ previousStatus: 'Inicial', newStatus: 'Aberta', changedAt: new Date().toISOString() }],
			createdAt: new Date().toISOString(),
		}
		const savedOccurrences = JSON.parse(localStorage.getItem('occurrences') ?? '[]') as Occurrence[]

		localStorage.setItem('occurrences', JSON.stringify([...savedOccurrences, occurrence]))
		setSubmitted(true)
		setTitle('')
		setDescription('')
		setCategory('')
		setAddress('')
		setImages([])
		event.currentTarget.reset()
	}

	return (
		<main className="create-issue-page">
			<section className="create-issue-card" aria-labelledby="create-issue-title">
				<header className="create-issue-header">
					<div>
						<h1 id="create-issue-title">Criar ocorrência</h1>
						<p>Conte para a gente o que precisa ser resolvido.</p>
					</div>
				</header>

				<form className="create-issue-form" onSubmit={handleSubmit}>
					<label>
						<span>Título <b aria-hidden="true">*</b></span>
						<input type="text" value={title} onChange={event => setTitle(event.target.value)} required maxLength={120} placeholder="Ex.: Lâmpada queimada na entrada" />
					</label>

					<label>
						<span>Descrição <b aria-hidden="true">*</b></span>
						<textarea value={description} onChange={event => setDescription(event.target.value)} required rows={6} placeholder="Descreva o problema ou a sugestão com o máximo de detalhes possível" />
					</label>

					<div className="form-row">
						<label>
							<span>Categoria <b aria-hidden="true">*</b></span>
							<select value={category} onChange={event => setCategory(event.target.value)} required>
								<option value="" disabled>Selecione uma categoria</option>
								{categories.map(option => <option key={option} value={option}>{option}</option>)}
							</select>
						</label>

						<label>
							<span>Endereço <b aria-hidden="true">*</b></span>
							<input type="text" value={address} onChange={event => setAddress(event.target.value)} required maxLength={180} placeholder="Ex.: Rua das Flores, 100" />
						</label>
					</div>

					<label>
						<span>Imagens <small>(opcional)</small></span>
						<input className="file-input" type="file" accept="image/*" multiple onChange={handleImagesChange} />
						<small className="field-hint">Você pode anexar uma ou mais imagens para ajudar na identificação.</small>
					</label>

					{submitted && <p className="success-message" role="status">Ocorrência criada com sucesso.</p>}

					<div className="form-actions">
						<button className="secondary-button" type="button" onClick={() => navigate(-1)}>Voltar</button>
						<button className="submit-button" type="submit">Criar ocorrência</button>
					</div>
				</form>
			</section>
		</main>
	)
}
