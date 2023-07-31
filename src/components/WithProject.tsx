import { NotFound } from '#components/NotFound.js'
import { useProjects, type Project } from '#context/Projects.js'
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
		return <NotFound>Project not found: {id}</NotFound>
	}

	return <>{children({ project })}</>
}
