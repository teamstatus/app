import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '#components/ProjectSync.js'
import { SyncSettings } from '#components/SyncSettings.js'
import { useProjects, type Project } from '#context/Projects.js'
import { useSettings } from '#context/Settings.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { useStatus, type Status } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'

export const CreateSync = () => {
	const { fetchProjectStatus } = useStatus()
	const { projects } = useProjects()
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const { visibleProjects } = useSettings()
	const [projectStatus, setProjectStatus] = useState<Record<string, Status[]>>(
		{},
	)

	useEffect(() => {
		Promise.all(
			visibleProjects.map(async ({ project: { id: projectId } }) =>
				fetchProjectStatus(projectId, startDate, endDate).ok(
					({ status: fetchedStatus }) => {
						setProjectStatus((status) => ({
							...status,
							[projectId]: fetchedStatus,
						}))
					},
				),
			),
		).catch(console.error)
	}, [selectedProjects, startDate, endDate])

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<header class="mt-3">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<h1>Teamstatus Sync</h1>
							<p>
								<small>
									<time dateTime={new Date().toISOString()}>
										{new Date().toLocaleString()}
									</time>
								</small>
							</p>
						</div>
					</div>
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<SyncSettings
								projects={visibleProjects.map(({ project }) => project)}
								onUpdate={(selectedProjects, startDate, endDate) => {
									setSelectedProjects(selectedProjects)
									setStartDate(startDate)
									setEndDate(endDate)
								}}
							/>
						</div>
					</div>
				</header>
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						{selectedProjects.map((id) => (
							<ProjectSync
								key={id}
								project={projects[id] as Project}
								startDate={startDate}
								status={projectStatus[id] ?? []}
							/>
						))}
					</div>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
