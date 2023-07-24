import { useProjects, type Project } from '#context/Projects.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { ProjectHeader } from '#components/ProjectHeader.js'

export const WithStatus = ({
	statusId,
	projectId,
	children,
}: {
	statusId: string
	projectId: string
	children: (args: { status: TStatus; project: Project }) => ComponentChildren
}) => {
	const { projects } = useProjects()
	const { projectStatus, fetchProjectStatusById } = useStatus()
	const [status, setStatus] = useState<TStatus | undefined>(
		projectStatus[projectId]?.find(({ id }) => id === statusId),
	)

	useEffect(() => {
		if (status !== undefined) return
		fetchProjectStatusById(projectId, statusId).ok(({ status }) =>
			setStatus(status),
		)
	}, [status])

	const project = projects[projectId]

	if (project === undefined) {
		return (
			<>
				<Main class="container">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<div class="alert alert-danger" role="alert">
								Project not found: {projectId}
							</div>
						</div>
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	if (status === undefined) {
		return (
			<>
				<ProjectHeader project={project} />
				<Main class="container">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<div class="alert alert-danger" role="alert">
								Status not found: {statusId}
							</div>
						</div>
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	return <>{children({ status, project })}</>
}
