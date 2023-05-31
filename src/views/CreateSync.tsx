import { decodeTime } from 'ulid'
import { QuestionIcon } from '../components/Icons.js'
import { Markdown } from '../components/Markdown.js'
import { useProjects, type Project } from '../context/Projects.js'
import {
	ReactionRole,
	useStatus,
	type Reaction,
	type Status,
} from '../context/Status.js'

export const CreateSync = ({ url }: { url: string }) => {
	const { projects } = useProjects()
	const projectsQuery =
		new URLSearchParams(new URL(url, document.baseURI).search)
			.get('projects')
			?.split(',') ?? []
	const selectedProjects = Object.keys(projects).filter((id) =>
		projectsQuery.includes(id),
	)

	return (
		<main class="container">
			<header class="row mt-3">
				<div class="col">
					<h1>Teamstatus Sync</h1>
					<p>
						<small>
							<time dateTime={new Date().toISOString()}>
								{new Date().toLocaleString()}
							</time>
						</small>
					</p>
					<hr />
				</div>
			</header>
			<div class="row mt-3">
				<div class="col">
					{selectedProjects.map((id) => (
						<ProjectSync project={projects[id] as Project} />
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

const ProjectSync = ({ project }: { project: Project }) => {
	const { projectStatus } = useStatus()
	const status = projectStatus(project.id)
	const significant = status.filter(filterByRole(ReactionRole.SIGNIFICANT))
	const normal = status.filter((status) => !significant.includes(status))
	const questions = status.filter(filterByRole(ReactionRole.QUESTION))
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
					<h3>Remaining updates</h3>
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
			<Markdown markdown={status.message} />
			<small class="text-muted">
				{status.author},{' '}
				<time dateTime={ts.toISOString()}>{ts.toLocaleDateString()}</time>
			</small>
		</div>
	)
}
