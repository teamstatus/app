import { type Project } from '#context/Projects.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import { NotFound } from '#components/NotFound.js'
import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'

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
		return <NotFound>Status not found: {id}</NotFound>
	}

	return <>{children({ status })}</>
}
