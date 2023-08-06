import { ComposeStatusForm } from '#components/ComposeStatusForm.js'
import { useProjects } from '#context/Projects.js'
import { useStatus } from '#context/Status.js'
import { parseProjectId } from '#proto/ids.js'
import { useEffect, useState } from 'preact/hooks'

export const Onbaording = () => {
	const { organizations, projects } = useProjects()
	const { observe, projectStatus, addProjectStatus } = useStatus()
	const [projectId, setProjectId] = useState<string | undefined>(
		Object.keys(projects)[0],
	)
	const [organizationId, setOrganizationId] = useState<string | undefined>(
		projectId !== undefined
			? parseProjectId(projectId).organization ?? undefined
			: organizations[0]?.id,
	)
	const [error, setError] = useState<string>()

	useEffect(() => {
		if (projectId === undefined) return
		observe(projectId)
	}, [projectId])

	useEffect(() => {
		if (organizationId !== undefined) return
		setOrganizationId(organizations[0]?.id)
	}, [organizations])

	useEffect(() => {
		if (projectId !== undefined) return
		setProjectId(
			Object.values(projects).filter(
				({ organizationId: orgId }) => orgId === organizationId,
			)?.[0]?.id,
		)
	}, [organizationId, projects])

	const status =
		projectId !== undefined ? projectStatus[projectId]?.[0] : undefined
	const hasStatus = status !== undefined

	return (
		<section>
			<header class="row">
				<div class="col-12 col-md-6 offset-md-3 ">
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
					<div class="col-12 col-md-6 offset-md-3  text-body-tertiary">
						<h3>
							<del>1. Create an organization</del>
						</h3>
						<div class="alert alert-success" role="alert">
							<a href={`/organization/${encodeURIComponent(organizationId)}`}>
								{organizationId}
							</a>{' '}
							created.
						</div>
					</div>
				</div>
			)}
			{organizations.length > 1 && (
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3  mb-4">
						<label class="form-label" htmlFor="organizationSelect">
							Change organization
						</label>
						<select
							id="organizationSelect"
							class="form-select"
							aria-label="Change organization"
							value={organizationId}
							onChange={(e) =>
								setOrganizationId((e.target as HTMLSelectElement).value)
							}
						>
							{organizations
								.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
								.map(({ id, name }) => (
									<option value={id}>{name ?? id}</option>
								))}
						</select>
					</div>
				</div>
			)}
			{projectId !== undefined && (
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3  text-body-tertiary">
						<h3>
							<del>2. Create a project</del>
						</h3>
						<div class="alert alert-success" role="alert">
							<a href={`/project/${encodeURIComponent(projectId)}`}>
								{projectId}
							</a>{' '}
							created.
						</div>
					</div>
				</div>
			)}
			{Object.keys(projects).length > 1 && (
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3  mb-4">
						<label class="form-label" htmlFor="projectSelect">
							Change project
						</label>
						<select
							id="projectSelect"
							class="form-select"
							aria-label="Change project"
							value={projectId}
							onChange={(e) =>
								setProjectId((e.target as HTMLSelectElement).value)
							}
						>
							{Object.values(projects)
								.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
								.filter(({ organizationId: id }) => id === organizationId)
								.map(({ id, name }) => (
									<option value={id}>{name ?? id}</option>
								))}
						</select>
					</div>
				</div>
			)}
			{projectId !== undefined && status !== undefined && (
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3  text-body-tertiary">
						<h3>
							<del>3. Create status</del>
						</h3>
						<div class="alert alert-success" role="alert">
							<a
								href={`/project/${encodeURIComponent(
									projectId,
								)}/status/${encodeURIComponent(status.id)}`}
							>
								Status
							</a>{' '}
							created.
						</div>
					</div>
				</div>
			)}
			{!hasStatus && projectId !== undefined && (
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3 ">
						<h3>3. Create a status</h3>
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<ComposeStatusForm
							onMessage={(message) => {
								const res = addProjectStatus(projectId, message)
								if ('error' in res) {
									setError(res.error)
								}
							}}
						/>
					</div>
				</div>
			)}
			<div class="row">
				<div class="col-12 col-md-6 offset-md-3">
					<h3>4. Create a sync</h3>
				</div>
			</div>
		</section>
	)
}
