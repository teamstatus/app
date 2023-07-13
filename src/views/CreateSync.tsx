import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '../components/ProjectSync.js'
import { SyncSettings } from '../components/SyncSettings.js'
import { useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { LogoHeader } from './LogoHeader.js'
import { useStatus, type Status } from '../context/Status.js'

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

	const visible = visibleProjects()
	const sortedProjects = Object.values(projects).sort((p1, p2) => {
		const i1 = visible.indexOf(p1.id)
		const i2 = visible.indexOf(p2.id)
		if (i1 === -1) return 1
		if (i2 === -1) return 1
		return i1 > i2 ? 1 : -1
	})

	useEffect(() => {
		Promise.all(
			selectedProjects.map(async (projectId) =>
				fetchProjectStatus(projectId, startDate, endDate).then((res) => {
					if ('error' in res) {
						console.error(res.error)
					} else {
						setProjectStatus((status) => ({
							...status,
							[projectId]: res.status,
						}))
					}
				}),
			),
		).catch(console.error)
	}, [selectedProjects, startDate, endDate])

	return (
		<>
			<LogoHeader />
			<main class="container">
				<header class="mt-3">
					<div class="row">
						<div class="col-md-8 offset-md-2">
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
						<div class="col-md-8 offset-md-2">
							<SyncSettings
								projects={sortedProjects}
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
					<div class="col-md-8 offset-md-2">
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
			</main>
		</>
	)
}
