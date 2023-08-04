import { ComposeStatusForm } from '#components/ComposeStatusForm.js'
import { useProjects } from '#context/Projects.js'
import { useStatus } from '#context/Status.js'
import { parseProjectId } from '#proto/ids.js'
import { useEffect, useState } from 'preact/hooks'

export const Onbaording = () => {
	const { organizations, projects } = useProjects()
	const { observe, projectStatus } = useStatus()

	const [projectId, setProjectId] = useState<string | undefined>(
		Object.keys(projects)[0],
	)

	useEffect(() => {
		if (projectId === undefined) return
		observe(projectId)
	}, [projectId])

	const hasStatus =
		projectId !== undefined && (projectStatus[projectId] ?? []).length > 0

	const organizationId =
		projectId !== undefined
			? parseProjectId(projectId).organization ?? undefined
			: organizations[0]?.id

	return (
		<section>
			<header class="row">
				<div class="col-6 offset-3">
					<h2>Getting started</h2>
					<p>
						Let's familiarize yourself with how{' '}
						<span
							style={{
								fontFamily: 'var(--headline-font)',
								fontWeight: 700,
							}}
						>
							teamstatus.space
						</span>{' '}
						works.
					</p>
					<hr />
				</div>
			</header>
			{organizationId !== undefined && (
				<div class="row">
					<div class="col-6 offset-3 text-body-tertiary">
						<h3>
							<del>1. Create an organization</del>
						</h3>
						<div class="alert alert-success" role="alert">
							<a href={`/organization/${encodeURIComponent(organizationId)}`}>
								{organizationId}{' '}
							</a>
							created.
						</div>
					</div>
				</div>
			)}
			{projectId !== undefined && (
				<div class="row">
					<div class="col-6 offset-3 text-body-tertiary">
						<h3>
							<del>2. Create a project</del>
						</h3>
						<div class="alert alert-success" role="alert">
							<a href={`/project/${encodeURIComponent(projectId)}`}>
								{projectId}{' '}
							</a>
							created.
						</div>
					</div>
				</div>
			)}
			{hasStatus && (
				<div class="row">
					<div class="col-6 offset-3 text-body-tertiary">
						<h3>
							<del>3. Create status</del>
						</h3>
					</div>
				</div>
			)}
			{!hasStatus && (
				<div class="row">
					<div class="col-6 offset-3">
						<h3>3. Create a status</h3>

						{Object.keys(projects).length > 1 && (
							<div class="mb-2">
								<label class="form-label" htmlFor="projectSelect">
									Select a project
								</label>
								<select
									id="projectSelect"
									class="form-select"
									aria-label="Select a project"
									value={projectId}
									onChange={(e) =>
										setProjectId((e.target as HTMLSelectElement).value)
									}
								>
									{Object.values(projects)
										.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
										.map(({ id, name }) => (
											<option value={id}>{name ?? id}</option>
										))}
								</select>
							</div>
						)}
						<ComposeStatusForm onMessage={() => {}} />
					</div>
				</div>
			)}
			<div class="row">
				<div class="col-6 offset-3 text-body-tertiary">
					<h3>4. Create a sync</h3>
				</div>
			</div>
		</section>
	)
}
