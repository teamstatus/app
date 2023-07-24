import { type Project } from '#context/Projects.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { ProjectHeader } from '#components/ProjectHeader.js'

export const WithStatus = ({
	id,
	project,
	children,
}: {
	id: string
	project: Project
	children: (args: { status: TStatus }) => ComponentChildren
}) => {
	const { projectStatus, fetchProjectStatusById } = useStatus()
	const [status, setStatus] = useState<TStatus | undefined>(
		projectStatus[project.id]?.find(({ id }) => id === id),
	)

	useEffect(() => {
		if (status !== undefined) return
		fetchProjectStatusById(project.id, id).ok(({ status }) => setStatus(status))
	}, [status])

	if (status === undefined) {
		return (
			<>
				<ProjectHeader project={project} />
				<Main class="container">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<div class="alert alert-danger" role="alert">
								Status not found: {id}
							</div>
						</div>
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	return <>{children({ status })}</>
}
