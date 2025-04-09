import { ProjectHeader } from '#components/ProjectHeader.tsx'
import { Status } from '#components/Status.tsx'
import { Role, canCreateStatus, useProjects } from '#context/Projects.tsx'
import { useSettings } from '#context/Settings.tsx'
import { useStatus } from '#context/Status.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { Main } from '#components/Main.tsx'
import { NotFound } from '#components/NotFound.tsx'
import { EditIcon, MembersIcon } from '#components/Icons.tsx'
import { StatusOnboarding } from '#components/onboarding/Status.tsx'
import { linkUrl } from '#util/link.ts'
import { useEffect } from 'preact/hooks'

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
		console.log('observe', id)
		observe(id)
	}, [id, observe])

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
						<div key={status.id} class="row">
							<div class="col-12 col-lg-8 offset-lg-2">
								<Status status={status} />
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
