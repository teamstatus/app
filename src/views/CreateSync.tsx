import { useEffect, useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { QuestionIcon } from '../components/Icons.js'
import { Markdown } from '../components/Markdown.js'
import { SyncSettings } from '../components/SyncSettings.js'
import { useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
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
	const [endDate, setendDate] = useState<Date>()
	const { visibleProjects } = useSettings()

	const visible = visibleProjects()
	const sortedProjects = Object.values(projects).sort((p1, p2) => {
		const i1 = visible.indexOf(p1.id)
		const i2 = visible.indexOf(p2.id)
		if (i1 === -1) return 1
		if (i2 === -1) return 1
		return i1 > i2 ? 1 : -1
	})

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
							projects={sortedProjects}
							onUpdate={(selectedProjects, startDate, endDate) => {
								setSelectedProjects(selectedProjects)
								setStartDate(startDate)
								setendDate(endDate)
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
							endDate={endDate}
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

const byTimeAsc = (s1: Status, s2: Status): number =>
	decodeTime(s1.id) - decodeTime(s2.id)

const ProjectSync = ({
	project,
	startDate,
	endDate,
}: {
	project: Project
	startDate?: Date
	endDate?: Date
}) => {
	const { fetchProjectStatus } = useStatus()
	const [status, setStatus] = useState<Status[]>([])

	const significant = status
		.sort(byTimeAsc)
		.filter(filterByRole(ReactionRole.SIGNIFICANT))
	const normal = status
		.sort(byTimeAsc)
		.filter((status) => !significant.includes(status))
	const questions = status
		.sort(byTimeAsc)
		.filter(filterByRole(ReactionRole.QUESTION))

	useEffect(() => {
		fetchProjectStatus(project.id, startDate, endDate)
			.then((res) => {
				if ('status' in res) {
					setStatus(res.status)
				}
				if ('error' in res) {
					console.error(res.error)
				}
			})
			.catch(console.error)
	}, [project, startDate, endDate])

	return (
		<section>
			<h2 class="mt-4">{project.name ?? project.id}</h2>
			{status.length === 0 && (
				<p>
					{startDate === undefined && <em>No updates.</em>}
					{startDate !== undefined && (
						<em>
							No updates since{' '}
							<time dateTime={startDate.toISOString()}>
								{startDate.toLocaleDateString()}
							</time>
							.
						</em>
					)}
				</p>
			)}
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
				<div class="d-flex align-items-center justify-content-start me-2 flex-column">
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
