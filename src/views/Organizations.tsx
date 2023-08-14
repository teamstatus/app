import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { useProjects } from '#context/Projects.js'
import { OrganizationIcon } from '#components/Icons.js'
import { OrganizationOnboarding } from '#components/onboarding/Organization.js'
import { withParams } from '#util/withParams.js'

export const Organizations = ({ onboarding }: { onboarding?: string }) => {
	const { organizations } = useProjects()
	const showOnboardingInfo = onboarding !== undefined
	return (
		<>
			<LogoHeader />
			{showOnboardingInfo && <OrganizationOnboarding />}
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>Organizations</h1>
								<OrganizationIcon />
							</div>
							{organizations.length === 0 && (
								<>
									<p>You have no organizations, yet.</p>
									<p>
										Why don't you{' '}
										<a
											href={`/organization/create${withParams({ onboarding })}`}
										>
											create a new organization
										</a>{' '}
										right now?
									</p>
								</>
							)}
							{organizations.length > 0 &&
								organizations.map((organization) => (
									<>
										<div class="my-2 d-flex justify-content-between">
											<div>
												<small class="text-muted text-nowrap">
													{organization.id}
												</small>
												<br />
												<a
													href={`/organization/${encodeURIComponent(
														organization.id,
													)}${withParams({ onboarding })}`}
												>
													{organization.name ?? organization.id}
												</a>
											</div>
											<div></div>
										</div>
										<hr />
									</>
								))}
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu actions={[{ href: '/organization/create' }]} />
		</>
	)
}
