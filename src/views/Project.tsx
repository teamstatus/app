import { ProjectHeader } from '#components/ProjectHeader.js'
import { Status } from '#components/Status.js'
import { Role, canCreateStatus, useProjects } from '#context/Projects.js'
import { useSettings } from '#context/Settings.js'
import { useStatus } from '#context/Status.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { NotFound } from '#components/NotFound.js'
import { useEffect } from 'preact/hooks'
import { EditIcon, MembersIcon } from '#components/Icons.js'
import { StatusOnboarding } from '#components/onboarding/Status.js'
import { linkUrl } from '#util/link.js'

export const Project = ({
	id,
	onboarding,
}: {
	path: string // e.g. '/project/:id'
	url: string // e.g. '/project/%24teamstatus%23development'
	matches: {
		id: string // e.g. '$teamstatus#development'
	}
	id: string // e.g. '$teamstatus#development'
	onboarding?: string
}) => {
	const { projects } = useProjects()
	const { projectStatus, observe, hasMore, fetchMore } = useStatus()
	const { getProjectPersonalization } = useSettings()
	const { color } = getProjectPersonalization(id)
	const showOnboardingInfo = onboarding !== undefined

	useEffect(() => {
		observe(id)
	}, [id])

	const project = projects[id]
	if (project === undefined) {
		return <NotFound>Project not found: {id}</NotFound>
	}
	const status = projectStatus[project.id] ?? []
	return (
		<>
			<ProjectHeader project={project} />
			{showOnboardingInfo && <StatusOnboarding project={project} />}
			<Main class="container mt-3" key={project.id}>
				<section>
					{status.map((status) => (
						<div class="row">
							<div class="col-12 col-lg-8 offset-lg-2">
								<Status status={status} key={status.id} />
								<hr class="mt-1 mb-2" />
							</div>
						</div>
					))}
					{hasMore(project.id) && (
						<div class="d-flex justify-content-center mt-2">
							<button
								type="button"
								class="btn btn-outline-secondary"
								onClick={() => {
									fetchMore(project.id)
								}}
							>
								load more
							</button>
						</div>
					)}
					{status.length === 0 && (
						<div class="row">
							<div class="col-12 col-lg-8 offset-lg-2">
								<p>No status updates, yet.</p>
								<p>
									<a
										href={linkUrl([`project`, id, 'status', 'create'], {
											onboarding,
										})}
									>
										Create
									</a>{' '}
									the first one!
								</p>
							</div>
						</div>
					)}
				</section>
			</Main>
			<ProjectMenu
				actions={[
					{
						href: `/project/${encodeURIComponent(id)}/invite`,
						icon: <MembersIcon />,
						disabled: project.role !== Role.OWNER,
						secondary: true,
					},
					{
						href: `/project/${encodeURIComponent(id)}/settings`,
						icon: <EditIcon />,
						disabled: project.role !== Role.OWNER,
						secondary: true,
					},
					{
						href: linkUrl([`project`, id, 'status', 'create'], {
							onboarding,
						}),
						color,
						disabled: !canCreateStatus(project.role),
						testId: 'create-status',
					},
				]}
			/>
		</>
	)
}
