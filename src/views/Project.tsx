import Color from 'color'
import { useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { Ago } from '../components/Ago.js'
import {
	AddIcon,
	AddReactionIcon,
	CalendarIcon,
	CollapseRightIcon,
	DeleteIcon,
	PersistencePendingIcon,
	SubMenuIcon,
	UserIcon,
} from '../components/Icons.js'
import { Markdown } from '../components/Markdown.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { Reaction, SelectReaction } from '../components/Reactions.js'
import { useAuth } from '../context/Auth.js'
import { useProjects } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { useStatus, type Status } from '../context/Status.js'

export const Project = ({
	id,
}: {
	path: string // e.g. '/project/:id'
	url: string // e.g. '/project/%24teamstatus%23development'
	matches: {
		id: string // e.g. '$teamstatus#development'
	}
	id: string // e.g. '$teamstatus#development'
}) => {
	const { projects } = useProjects()
	const { projectStatus } = useStatus()
	const { getProjectPersonalization } = useSettings()
	const { color } = getProjectPersonalization(id)

	const project = projects[id]
	if (project === undefined) {
		return (
			<main class="container">
				<div class="alert alert-danger" role="alert">
					Project not found: {id}
				</div>
			</main>
		)
	}
	const status = projectStatus(project.id)
	return (
		<>
			<ProjectHeader project={project} />
			<main class="container" key={project.id}>
				<section>
					{status.map((status) => (
						<>
							<Status status={status} />
							<hr />
						</>
					))}
					{status.length === 0 && (
						<div class="row">
							<div class="col">
								<p>No status updates, yet.</p>
								<p>
									<a href={`/project/${encodeURIComponent(id)}/compose`}>
										Create
									</a>{' '}
									the first one!
								</p>
							</div>
						</div>
					)}
				</section>
				<a
					href={`/project/${encodeURIComponent(id)}/compose`}
					style={{
						borderRadius: '100%',
						color: new Color(color).luminosity() > 0.5 ? 'black' : 'white',
						backgroundColor: color,
						display: 'block',
						height: '48px',
						width: '48px',
						boxShadow: '0 0 8px 0 #00000075',
						position: 'fixed',
						right: '10px',
						bottom: '70px',
					}}
					class="d-flex align-items-center justify-content-center"
				>
					<AddIcon />
				</a>
			</main>
		</>
	)
}

const Status = ({ status }: { status: Status }) => {
	const [reactionsVisible, showReactions] = useState(false)
	const [operationsVisible, showOperations] = useState(false)
	const { user } = useAuth()
	const userId = user?.id
	const { addReaction, deleteReaction, deleteStatus } = useStatus()
	const actionsVisible = reactionsVisible || operationsVisible
	const canDelete = userId === status.author
	const hasOperations = canDelete
	return (
		<div>
			<div class="mt-2">
				<Markdown markdown={status.message} />
			</div>
			<div class="clearfix">
				{status.reactions.length > 0 && (
					<div class="float-start mb-2">
						{status.reactions.map((reaction) => {
							const isAuthor = reaction.author === userId
							return (
								<Reaction
									reaction={reaction}
									onClick={() => {
										if (isAuthor) {
											deleteReaction(status, reaction)
										}
									}}
								/>
							)
						})}
					</div>
				)}
			</div>
			{!actionsVisible && (
				<div class="d-flex align-items-center justify-content-between">
					<small class="text-muted">
						<UserIcon size={20} /> {status.author}{' '}
						<CalendarIcon size={20} class="ms-2" />{' '}
						<Ago date={new Date(decodeTime(status.id))} />
					</small>
					<span>
						{status.persisted === false && (
							<PersistencePendingIcon class="me-1" />
						)}
						{hasOperations && (
							<button
								type="button"
								class="btn btn-sm btn-light me-1"
								onClick={() => showOperations(true)}
							>
								<SubMenuIcon />
							</button>
						)}
						<button
							type="button"
							class="btn btn-sm btn-light"
							onClick={() => showReactions(true)}
						>
							<AddReactionIcon />
						</button>
					</span>
				</div>
			)}
			{reactionsVisible && (
				<div class="d-flex align-items-center justify-content-end">
					<SelectReaction
						onReaction={(reaction) => {
							addReaction(status, reaction)
						}}
					/>
					<button
						type="button"
						class="btn btn-sm btn-light"
						onClick={() => showReactions(false)}
					>
						<CollapseRightIcon />
					</button>
				</div>
			)}
			{operationsVisible && (
				<div class="d-flex align-items-center justify-content-end">
					{canDelete && (
						<button
							type="button"
							class="btn btn-sm btn-outline-danger me-1"
							onClick={() => {
								deleteStatus(status)
							}}
						>
							<DeleteIcon />
						</button>
					)}
					<button
						type="button"
						class="btn btn-sm btn-light"
						onClick={() => showOperations(false)}
					>
						<CollapseRightIcon />
					</button>
				</div>
			)}
		</div>
	)
}
