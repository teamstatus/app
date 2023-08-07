import { CreateStatus as CreateForm } from '#components/CreateStatus.js'
import { Main } from '#components/Main.js'
import { NotFound } from '#components/NotFound.js'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { useProjects } from '#context/Projects.js'
import { route } from 'preact-router'

export const ComposeStatus = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => {
	const { projects } = useProjects()

	const project = projects[id]
	if (project === undefined) {
		return <NotFound>Project not found: {id}</NotFound>
	}

	return (
		<>
			<ProjectHeader project={project} />
			<Main class="container">
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-3">
					<section>
						<h1>Compose a new status</h1>
						<CreateForm
							project={project}
							onStatus={(status) => {
								route(
									`/project/${encodeURIComponent(id)}?${new URLSearchParams({
										newStatus: status.id,
									}).toString()}`,
								)
							}}
						/>
					</section>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
