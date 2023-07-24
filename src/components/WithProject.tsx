import { useProjects, type Project } from '#context/Projects.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import type { ComponentChildren } from 'preact'

export const WithProject = ({
	id,
	children,
}: {
	id: string
	children: (args: { project: Project }) => ComponentChildren
}) => {
	const { projects } = useProjects()

	const project = projects[id]

	if (project === undefined) {
		return (
			<>
				<Main class="container">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<div class="alert alert-danger" role="alert">
								Project not found: {id}
							</div>
						</div>
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	return <>{children({ project })}</>
}
