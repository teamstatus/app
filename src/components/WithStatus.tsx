import type { Project } from '#context/Projects.tsx'
import { useStatus, type Status as tStatus } from '#context/Status.tsx'
import { NotFound } from '#components/NotFound.tsx'
import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { fetchProjectStatusById } from '#api/status.ts'

export const WithStatus = ({
	id,
	project,
	children,
}: {
	id: string
	project: Project
	children: (args: { status: tStatus }) => ComponentChildren
}) => {
	const { projectStatus } = useStatus()
	const [status, setStatus] = useState<tStatus | undefined>(
		projectStatus[project.id]?.find(({ id: statusId }) => statusId === id),
	)

	useEffect(() => {
		if (status !== undefined) return
		fetchProjectStatusById(project.id, id).ok(({ status }) => setStatus(status))
	}, [status, id, project])

	if (status === undefined) {
		return <NotFound>Status not found: {id}</NotFound>
	}

	return <>{children({ status })}</>
}
