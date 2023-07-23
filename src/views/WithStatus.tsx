import { useProjects, type Project } from '../context/Projects.js'
import { useStatus, type Status as TStatus } from '../context/Status.js'
import { Main } from '../components/Main.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'

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
	const { projectStatus } = useStatus()
	const [status] = useState<TStatus | undefined>(
		projectStatus[projectId]?.find(({ id }) => id === statusId),
	)

	/**
	 * TODO: Implement
	useEffect(() => {
		if (status !== undefined) return
		fetchProjectStatusById(projectId, statusId).then((res) => {
			if ('status' in res) setStatus(status)
		})
	}, [status])

	 */

	if (status === undefined) {
		return (
			<>
				<Main class="container">
					<div class="alert alert-danger" role="alert">
						Status not found: {statusId}
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	const project = projects[status.project]

	if (project === undefined) {
		return (
			<>
				<Main class="container">
					<div class="alert alert-danger" role="alert">
						Project not found: {status.project}
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	return <>{children({ status, project })}</>
}
