import { Main } from '#components/Main.js'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Status as StatusView } from '#components/Status.js'
import { WithProject } from '#components/WithProject.js'
import { WithStatus } from '#components/WithStatus.js'

export const Status = ({
	statusId,
	projectId,
}: {
	statusId: string // e.g. '01H1XVCVQXR8619Z4NVVCFD20F'
	projectId: string // e.g. '$acme#project'
}) => (
	<WithProject id={projectId}>
		{({ project }) => (
			<WithStatus project={project} id={statusId}>
				{({ status }) => (
					<>
						<ProjectHeader project={project} />
						<Main class="container mt-3">
							<div class="row">
								<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
									<StatusView status={status} />
								</div>
							</div>
						</Main>
						<ProjectMenu />
					</>
				)}
			</WithStatus>
		)}
	</WithProject>
)
