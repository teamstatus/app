import { useState } from 'preact/hooks'
import { ProjectSync } from '../components/ProjectSync.js'
import { SyncSettings } from '../components/SyncSettings.js'
import { useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { LogoHeader } from './LogoHeader.js'

export const CreateSync = () => {
	const { projects } = useProjects()
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setendDate] = useState<Date>()
	const { visibleProjects } = useSettings()

	const visible = visibleProjects()
	const sortedProjects = Object.values(projects).sort((p1, p2) => {
		const i1 = visible.indexOf(p1.id)
		const i2 = visible.indexOf(p2.id)
		if (i1 === -1) return 1
		if (i2 === -1) return 1
		return i1 > i2 ? 1 : -1
	})

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
									setendDate(endDate)
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
								endDate={endDate}
							/>
						))}
					</div>
				</div>
			</main>
		</>
	)
}
