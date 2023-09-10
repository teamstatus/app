import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { Role, useProjects } from '#context/Projects.js'
import {
	DeleteIcon,
	EditIcon,
	MembersIcon,
	OrganizationIcon,
} from '#components/Icons.js'
import { parseProjectId } from '#proto/ids.js'
import { NotFound } from '#components/NotFound.js'
import { EditMenu } from '#components/EditMenu.js'
import { RolePill } from '#components/RolePill.js'
import { ProjectOnboarding } from '#components/onboarding/Project.js'
import { linkUrl } from '#util/link.js'

export const Organization = ({
	id,
	onboarding,
}: {
	id: string
	onboarding?: string
}) => {
	const showOnboardingInfo = onboarding !== undefined
	const { organizations, projects, deleteProject } = useProjects()

	const organization = organizations.find(({ id: i }) => id === i)

	const organizationProjects = Object.values(projects).filter(
		({ id: projectId }) => parseProjectId(projectId).organization === id,
	)

	if (organization === undefined) {
		return <NotFound>Organization not found: {id}</NotFound>
	}

	return (
		<>
			<LogoHeader />
			{showOnboardingInfo && <ProjectOnboarding organization={organization} />}
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-lg-8 offset-lg-2">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>{organization.name ?? organization.id}</h1>

								<OrganizationIcon />
							</div>
							{organization.name !== undefined && (
								<small class="text-muted">{organization.id}</small>
							)}
							{organizationProjects.length === 0 && (
								<>
									<p>This organization does not have projects, yet.</p>
									<p>
										Why don't you{' '}
										<a
											href={linkUrl(['project', 'create'], {
												onboarding,
												organization: id,
											})}
										>
											create a new project
										</a>{' '}
										right now?
									</p>
								</>
							)}
							{organizationProjects.length > 0 && (
								<section class="mt-4">
									<h2>Projects</h2>
									{organizationProjects.map((project) => (
										<>
											<div
												class="my-2 d-flex justify-content-between align-items-center"
												key={project.id}
											>
												<div>
													<small class="text-muted text-nowrap">
														{project.id}
													</small>
													<br />
													<a
														href={linkUrl(['project', project.id], {
															onboarding,
															organization: id,
														})}
													>
														{project.name ?? project.id}
													</a>
												</div>
												<div class="d-flex flex-column  align-items-end">
													<RolePill role={project.role} class="mb-1" />
													{project.role === Role.OWNER && (
														<EditMenu>
															<button
																type="button"
																title={'Delete'}
																class={'btn btn-sm btn-outline-danger ms-2'}
																onClick={() => {
																	if (
																		confirm(
																			`Really delete project ${
																				project.name ?? project.id
																			}? This cannot be undone.`,
																		)
																	) {
																		deleteProject(project)
																	}
																}}
															>
																<DeleteIcon size={18} />
															</button>
															<a
																href={`/project/${encodeURIComponent(
																	project.id,
																)}/settings`}
																title={'Settings'}
																class={'btn btn-sm btn-outline-secondary ms-2'}
															>
																<EditIcon size={18} />
															</a>
															<a
																href={`/project/${encodeURIComponent(
																	project.id,
																)}/invite`}
																title={'Invite a user'}
																class={'btn btn-sm btn-outline-secondary ms-2'}
															>
																<MembersIcon size={18} />
															</a>
														</EditMenu>
													)}
												</div>
											</div>
											<hr />
										</>
									))}
								</section>
							)}
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu
				actions={[
					{
						href: linkUrl(['project', 'create'], {
							onboarding,
							organization: id,
						}),
						testId: 'create-project',
					},
				]}
			/>
		</>
	)
}
