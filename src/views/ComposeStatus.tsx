import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { useProjects } from '#context/Projects.js'
import { useStatus } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { NotFound } from '#components/NotFound.js'
import { ComposeStatusForm } from '#components/ComposeStatusForm.js'

export const ComposeStatus = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => {
	const { projects } = useProjects()
	const { addProjectStatus } = useStatus()
	const [error, setError] = useState<string | undefined>()

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
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<ComposeStatusForm
							onMessage={(message) => {
								const res = addProjectStatus(id, message)
								if ('error' in res) {
									setError(res.error)
								} else {
									route(
										`/project/${encodeURIComponent(id)}?${new URLSearchParams({
											newStatus: res.id,
										}).toString()}`,
									)
								}
							}}
						/>
					</section>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
