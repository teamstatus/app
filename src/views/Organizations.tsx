import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'
import { useProjects } from '../context/Projects.js'
import { OrganizationIcon } from '../components/Icons.js'

export const Organizations = () => {
	const { organizations } = useProjects()

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<div class="card">
							<div class="card-header  d-flex justify-content-between align-items-center">
								<h1>Organizations</h1>
								<OrganizationIcon />
							</div>
							{organizations.length === 0 && (
								<div class="card-body">
									<p>You have no organizations, yet.</p>
									<p>
										Why don't you{' '}
										<a href="/organization/create">create a new organization</a>{' '}
										right now?
									</p>
								</div>
							)}
							{organizations.length > 0 && (
								<ul class="list-group list-group-flush">
									{organizations.map((organization) => (
										<li class="list-group-item d-flex justify-content-between">
											<a
												href={`/organization/${encodeURIComponent(
													organization.id,
												)}`}
											>
												{organization.name ?? organization.id}
											</a>
											<span style={{ opacity: 0.75 }}>{organization.id}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</Main>
			<ProjectMenu action={{ href: '/organization/create' }} />
		</>
	)
}
