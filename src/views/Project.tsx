import Color from 'color'
import { AddIcon } from '../components/Icons.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { Status } from '../components/Status.js'
import { useProjects } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { useStatus } from '../context/Status.js'

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
						<div class="row">
							<div class="col-md-8 offset-md-2">
								<Status status={status} />
								<hr />
							</div>
						</div>
					))}
					{status.length === 0 && (
						<div class="row">
							<div class="col-md-8 offset-md-2">
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
