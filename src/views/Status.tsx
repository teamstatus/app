import { ProjectHeader } from '../components/ProjectHeader.js'
import { Status as StatusView } from '../components/Status.js'
import { WithStatus } from './WithStatus.js'

export const Status = ({
	statusId,
	projectId,
}: {
	statusId: string // e.g. '01H1XVCVQXR8619Z4NVVCFD20F'
	projectId: string // e.g. '$acme#project'
}) => (
	<WithStatus projectId={projectId} statusId={statusId}>
		{({ status, project }) => (
			<>
				<ProjectHeader project={project} />
				<StatusView status={status} />
			</>
		)}
	</WithStatus>
)
