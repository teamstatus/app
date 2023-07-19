import { ProjectHeader } from '../components/ProjectHeader.js'
import { Status } from '../components/Status.js'
import { canCreateStatus, useProjects } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { useStatus } from '../context/Status.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'

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
			<>
				<Main class="container">
					<div class="alert alert-danger" role="alert">
						Project not found: {id}
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}
	const status = projectStatus(project.id)
	return (
		<>
			<ProjectHeader project={project} />
			<Main class="container" key={project.id}>
				<section>
					{status.map((status) => (
						<div class="row">
							<div class="col-12 col-md-6 offset-md-3">
								<Status status={status} />
								<hr class="mt-1 mb-2" />
							</div>
						</div>
					))}
					{status.length === 0 && (
						<div class="row">
							<div class="col-12 col-md-6 offset-md-3">
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
			</Main>
			<ProjectMenu
				action={{
					href: `/project/${encodeURIComponent(id)}/compose`,
					color,
					disabled: !canCreateStatus(project.role),
				}}
			/>
		</>
	)
}
