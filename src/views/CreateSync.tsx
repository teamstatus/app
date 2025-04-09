import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '#components/ProjectSync.tsx'
import { SyncSettings } from '#components/SyncSettings.tsx'
import { useProjects, type Project } from '#context/Projects.tsx'
import { LogoHeader } from '#components/LogoHeader.tsx'
import type { Status } from '#context/Status.tsx'
import { Main } from '#components/Main.tsx'
import { fetchProjectStatus } from '#api/status.ts'
import { FormContainer } from '#components/FormContainer.tsx'
import { SyncOnboarding } from '#components/onboarding/Sync.tsx'
import { linkUrl } from '#util/link.ts'

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
					<div class="row mt-sm-4">
						<div class="col-12 col-lg-8 offset-lg-2">
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
						<header class="mt-sm-4">
							<div class="row">
								<div class="col-12 col-lg-8 offset-lg-2">
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
							<div class="col-12 col-lg-8 offset-lg-2">
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
		</>
	)
}
