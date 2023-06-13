import { useEffect, useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { QuestionIcon } from '../components/Icons.js'
import { Markdown } from '../components/Markdown.js'
import { SyncSettings } from '../components/SyncSettings.js'
import { useProjects, type Project } from '../context/Projects.js'
import {
	ReactionRole,
	useStatus,
	type Reaction,
	type Status,
} from '../context/Status.js'

export const CreateSync = () => {
	const { projects } = useProjects()
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const [startDate, setStartDate] = useState<Date>()

	return (
		<main class="container">
			<header class="mt-3">
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3">
						<h1>Teamstatus Sync</h1>
						<p>
							<small>
								<time dateTime={new Date().toISOString()}>
									{new Date().toLocaleString()}
								</time>
							</small>
						</p>
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3">
						<SyncSettings
							projects={Object.values(projects)}
							onUpdate={(selectedProjects, startDate) => {
								setSelectedProjects(selectedProjects)
								setStartDate(startDate)
							}}
						/>
					</div>
				</div>
			</header>
			<div class="row mt-3">
				<div class="col-12 col-md-6 offset-md-3">
					{selectedProjects.map((id) => (
						<ProjectSync
							key={id}
							project={projects[id] as Project}
							startDate={startDate}
						/>
					))}
				</div>
			</div>
		</main>
	)
}

const isRole = (role: ReactionRole) => (reaction: Reaction) =>
	'role' in reaction && reaction.role === role

const filterByRole = (role: ReactionRole) => (status: Status) =>
	status.reactions.find(isRole(role)) !== undefined

const ProjectSync = ({
	project,
	startDate,
}: {
	project: Project
	startDate?: Date
}) => {
	const { fetchProjectStatus } = useStatus()
	const [status, setStatus] = useState<Status[]>([])

	const significant = status.filter(filterByRole(ReactionRole.SIGNIFICANT))
	const normal = status.filter((status) => !significant.includes(status))
	const questions = status.filter(filterByRole(ReactionRole.QUESTION))

	useEffect(() => {
		fetchProjectStatus(project.id, startDate)
			.then((res) => {
				if ('status' in res) {
					setStatus(res.status)
				}
				if ('error' in res) {
					console.error(res.error)
				}
			})
			.catch(console.error)
	}, [project, startDate])

	return (
		<section>
			<h2 class="mt-4">{project.name ?? project.id}</h2>
			{questions.length > 0 && (
				<>
					<div class={'card'}>
						<div class={'card-header'}>
							<h3>Questions ({questions.length})</h3>
						</div>
						<div class="list-group list-group-flush">
							{questions.map((status) => {
								const users = status.reactions
									.filter(isRole(ReactionRole.QUESTION))
									.map(({ author }) => author)
								return (
									<div class="list-group-item">
										<div>
											<QuestionIcon />{' '}
											{users.map((user) => (
												<span>{user}</span>
											))}
										</div>
										<StatusSync status={status} />
									</div>
								)
							})}
						</div>
					</div>
				</>
			)}
			{significant.length > 0 && (
				<>
					<div class="card mt-3 mb-3">
						<div class="card-header">
							<h3>Significant updates</h3>
						</div>
						<div class="list-group list-group-flush">
							{significant.map((status) => (
								<div class="list-group-item">
									<StatusSync status={status} />
								</div>
							))}
						</div>
					</div>
					{normal.length > 0 && <h3>Remaining updates</h3>}
				</>
			)}
			{normal.map((status) => (
				<StatusSync status={status} />
			))}
		</section>
	)
}

const StatusSync = ({ status }: { status: Status }) => {
	const ts = new Date(decodeTime(status.id))
	const signficantReactionsByAuthor = status.reactions.filter(
		(reaction) =>
			'role' in reaction &&
			reaction.role === ReactionRole.SIGNIFICANT &&
			reaction.author === status.author,
	)
	return (
		<div class="mb-1 mt-2">
			{signficantReactionsByAuthor.map((reaction) => (
				<div>
					{reaction.emoji}{' '}
					<em>{reaction.description ?? 'No description available.'}</em>
				</div>
			))}
			<div class="d-flex align-items-center justify-content-start">
				<div class="d-flex align-items-center justify-content-start me-2">
					<small class="float-start me-1 text-muted mt-1 text-nowrap">
						(
						<time dateTime={ts.toISOString()}>
							{ts.toISOString().slice(0, 10)}
						</time>
						)
					</small>
				</div>
				<Markdown markdown={status.message} />
			</div>
		</div>
	)
}
