import Color from 'color'
import { useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { Ago } from '../components/Ago.js'
import {
	AddIcon,
	AddReactionIcon,
	CollapseRightIcon,
	DeleteIcon,
	PersistencePendingIcon,
	SubMenuIcon,
} from '../components/Icons.js'
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
	return (
		<>
			<ProjectHeader project={project} />
			<main class="container">
				<section>
					{projectStatus(project.id).map((status) => (
						<>
							<Status status={status} />
							<hr />
						</>
					))}
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
	const [reactionActionsVisible, showReactionsActions] = useState(false)
	const { user } = useAuth()
	const userId = user?.id
	const { deleteReaction } = useStatus()
	return (
		<div>
			<div class="d-flex align-items-center justify-content-between fw-light">
				<small>{status.author}</small>
				<small>
					<Ago date={new Date(decodeTime(status.id))} />
				</small>
			</div>
			<div>{status.message}</div>
			<div class="d-flex align-items-center justify-content-between">
				<div>
					{status.reactions.length > 0 && (
						<div>
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
										byUser={isAuthor}
									/>
								)
							})}
						</div>
					)}
				</div>
				<div class="d-flex flex-row align-items-center">
					{!reactionActionsVisible && (
						<>
							{status.persisted === false && (
								<PersistencePendingIcon class="me-1" />
							)}
							<DeleteStatus status={status} key={status.id} />
							<button
								type="button"
								class="btn btn-sm btn-light"
								onClick={() => showReactionsActions(true)}
							>
								<AddReactionIcon />
							</button>
						</>
					)}
					{reactionActionsVisible && (
						<>
							<ReactToStatus status={status} />
							<button
								type="button"
								class="btn btn-sm btn-light"
								onClick={() => showReactionsActions(false)}
							>
								<CollapseRightIcon />
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

const ReactToStatus = ({ status }: { status: Status }) => {
	const { addReaction } = useStatus()
	return (
		<SelectReaction
			onReaction={(reaction) => {
				addReaction(status, reaction)
			}}
		/>
	)
}

const DeleteStatus = ({ status }: { status: Status }) => {
	const [expanded, setExpanded] = useState(false)
	const { deleteStatus } = useStatus()
	const { user } = useAuth()
	const userId = user?.id

	if (userId === undefined || userId !== status.author) return null
	return (
		<>
			{expanded && (
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
				class="btn btn-sm btn-light me-1"
				onClick={() => setExpanded((e) => !e)}
			>
				{expanded ? <CollapseRightIcon /> : <SubMenuIcon />}
			</button>
		</>
	)
}
