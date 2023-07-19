import { parseProjectId } from '../proto/ids.js'

export const ProjectId = ({ id }: { id: string }) => {
	const { organization, project: projectId } = parseProjectId(id)
	return (
		<span>
			<span style={{ opacity: 0.75 }}>{organization}</span>&#8203;
			<strong class="text-nowrap">{projectId}</strong>
		</span>
	)
}
