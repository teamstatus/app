import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'
import { useProjects } from '../context/Projects.js'
import { OrganizationIcon } from '../components/Icons.js'
import { parseProjectId } from '../proto/ids.js'

export const Organization = ({ id }: { id: string }) => {
	const { organizations, projects } = useProjects()

	const organization = organizations.find(({ id: i }) => id === i)

	const organizationProjects = Object.values(projects).filter(
		({ id: projectId }) => parseProjectId(projectId).organization === id,
	)

	if (organization === undefined) {
		return (
			<>
				<Main class="container">
					<div class="alert alert-danger" role="alert">
						Organization not found: {id}
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<div class="card">
							<div class="card-header">
								<div class="  d-flex justify-content-between align-items-center">
									<h1>{organization.name ?? organization.id}</h1>

									<OrganizationIcon />
								</div>
								{organization.name !== undefined && (
									<small class="text-muted">{organization.id}</small>
								)}
							</div>
							{organizationProjects.length === 0 && (
								<div class="card-body">
									<p>This organization does not have projects, yet.</p>
									<p>
										Why don't you{' '}
										<a
											href={`/project/create?${new URLSearchParams({
												organization: id,
											})}`}
										>
											create a new project
										</a>{' '}
										right now?
									</p>
								</div>
							)}
							{organizationProjects.length > 0 && (
								<ul class="list-group list-group-flush">
									{organizationProjects.map((project) => (
										<li class="list-group-item d-flex justify-content-between align-items-center">
											<a href={`/project/${encodeURIComponent(project.id)}`}>
												{project.name ?? project.id}
											</a>
											<span
												style={{ opacity: 0.75 }}
												class="text-nowrap flex-shrink-0"
											>
												{project.id}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</Main>
			<ProjectMenu
				action={{
					href: `/project/create?${new URLSearchParams({
						organization: id,
					})}`,
				}}
			/>
		</>
	)
}
