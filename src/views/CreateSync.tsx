import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '#components/ProjectSync.js'
import { SyncSettings } from '#components/SyncSettings.js'
import { useProjects, type Project } from '#context/Projects.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { type Status } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { fetchProjectStatus } from '#api/status.js'
import { FormContainer } from '#components/FormContainer.js'
import { SyncOnboarding } from '#components/onboarding/Sync.js'
import { linkUrl } from '#util/link.js'

export const CreateSync = ({ onboarding }: { onboarding?: string }) => {
	const { projects } = useProjects()
	const [selectedProjects, setSelectedProjects] = useState<string[]>([])
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [projectStatus, setProjectStatus] = useState<Record<string, Status[]>>(
		{},
	)
	const showOnboardingInfo = onboarding !== undefined
	const [createdSyncId, setCreatedSyncId] = useState<string>()

	useEffect(() => {
		Promise.all(
			selectedProjects.map(async (projectId) =>
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
			{showOnboardingInfo && (
				<SyncOnboarding
					step={createdSyncId === undefined ? 'create_sync' : 'sync_created'}
				/>
			)}
			<Main class="container">
				{createdSyncId !== undefined && (
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
							<div class="alert alert-success" role="alert">
								<a href={linkUrl(['sync', createdSyncId], { onboarding })}>
									Sync created!
								</a>
							</div>
						</div>
					</div>
				)}
				{createdSyncId === undefined && (
					<>
						<header class="mt-3">
							<div class="row">
								<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
									<FormContainer header={<h1>Create a new sync</h1>}>
										<SyncSettings
											projects={Object.values(projects)}
											onUpdate={(selectedProjects, startDate, endDate) => {
												setSelectedProjects(selectedProjects)
												setStartDate(startDate)
												setEndDate(endDate)
											}}
											onCreated={setCreatedSyncId}
										/>
									</FormContainer>
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
					</>
				)}
			</Main>
			<ProjectMenu />
		</>
	)
}
