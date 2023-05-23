import cx from 'classnames'
import { Building, Plus, SmilePlus, Sprout, UploadCloud } from 'lucide-preact'
import { decodeTime } from 'ulid'
import { Ago } from '../components/Ago.js'
import { useProjects } from '../context/Projects.js'
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
		<main class="container">
			<h1>
				<Sprout /> <abbr id={id}>{project.name ?? project.id}</abbr>
				<br />
				<small>
					<Building /> {project.organization.name ?? project.organization.id}
				</small>
			</h1>
			<section>
				{projectStatus(project.id).map((status) => (
					<>
						<hr />
						<Status status={status} />
					</>
				))}
			</section>
			<a
				href={`/project/${encodeURIComponent(id)}/compose`}
				style={{
					borderRadius: '100%',
					backgroundColor: '#35ca35',
					color: '#ffffff',
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
	)
}

const Status = ({ status }: { status: Status }) => (
	<div>
		<div class="d-flex align-items-center justify-content-between">
			<div>{status.author}</div>
			<div>
				<Ago date={new Date(decodeTime(status.id))} />
			</div>
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
				<button type="button" class="btn btn-sm btn-light">
					<SmilePlus />
				</button>
			</div>
		</div>
	</div>
)

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
