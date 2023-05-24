import cx from 'classnames'
import Color from 'color'
import {
	ChevronRight,
	MoreHorizontal,
	Plus,
	SmilePlus,
	Trash,
	UploadCloud,
} from 'lucide-preact'
import { useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { Ago } from '../components/Ago.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { useAuth } from '../context/Auth.js'
import { useProjects } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import {
	ReactionRole,
	useStatus,
	type Reaction,
	type Status,
} from '../context/Status.js'

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
					<Plus />
				</a>
			</main>
		</>
	)
}

const Status = ({ status }: { status: Status }) => (
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
						{status.reactions.map((reaction) => (
							<Reaction reaction={reaction} />
						))}
					</div>
				)}
			</div>
			<div class="d-flex flex-row align-items-center">
				{status.persisted === false && <UploadCloud />}
				<DeleteStatus status={status} key={status.id} />
				<button type="button" class="btn btn-sm btn-light">
					<SmilePlus />
				</button>
			</div>
		</div>
	</div>
)

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
					class="btn btn-sm btn-outline-danger"
					onClick={() => {
						deleteStatus(status)
					}}
				>
					<Trash />
				</button>
			)}
			<button
				type="button"
				class="btn btn-sm btn-light me-1"
				onClick={() => setExpanded((e) => !e)}
			>
				{expanded ? <ChevronRight /> : <MoreHorizontal />}
			</button>
		</>
	)
}

const Reaction = ({ reaction }: { reaction: Reaction }) => (
	<button
		class={cx('btn btn-sm', {
			'btn-light': !('role' in reaction),
			'btn-warning':
				'role' in reaction && reaction.role === ReactionRole.SIGNIFICANT,
			'btn-danger':
				'role' in reaction && reaction.role === ReactionRole.QUESTION,
		})}
		title={reaction.description}
	>
		{reaction.emoji}
	</button>
)
