import { CreateOrganization } from '#components/CreateOrganization.js'
import {
	useProjects,
	type Organization,
	type Project,
} from '#context/Projects.js'
import { useState } from 'preact/hooks'
import { FormContainer } from '#components/FormContainer.js'
import { CreateProject } from '#components/CreateProject.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import { CreateStatus as CreateStatusForm } from '#components/CreateStatus.js'
import { ProjectName } from '#components/ProjectName.js'
import { Status } from '#components/Status.js'
import { ReactionsHelp } from '#components/ReactionsHelp.js'
import { logoColors } from '#components/Colorpicker.js'
import Color from 'color'
import { AddIcon, AddReactionIcon } from '#components/Icons.js'
import { OpenmojiIcon } from '#components/OpenmojiIcon.js'

export const Onbaording = () => {
	const [organization, setOrganization] = useState<Organization>()
	const [project, setProject] = useState<Project>()
	const [statusId, setStatusId] = useState<string>()
	const { projectStatus } = useStatus()
	const status =
		project === undefined
			? undefined
			: projectStatus[project.id]?.find(({ id }) => id === statusId)
	const hasReactions = (status?.reactions.length ?? 0) > 0

	return (
		<aside>
			<div
				style={{
					backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
				}}
				class={'pt-4'}
			>
				<div class="container">
					<header class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
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
						</div>
					</header>
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
							<CreateOrSelectOrganization
								organization={organization}
								onOrganization={setOrganization}
							/>
							{organization !== undefined && (
								<CreateOrSelectProject
									organization={organization}
									project={project}
									onProject={setProject}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			{organization !== undefined && project !== undefined && (
				<CreateOrReactToStatus
					status={status}
					project={project}
					onStatus={setStatusId}
				/>
			)}
			{organization !== undefined && project !== undefined && hasReactions && (
				<div
					style={{
						backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
					}}
				>
					<div class="container">
						<div class="row">
							<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
								<CreateSync />
							</div>
						</div>
					</div>
				</div>
			)}
		</aside>
	)
}

const CreateOrSelectOrganization = ({
	organization,
	onOrganization,
}: {
	organization?: Organization
	onOrganization: (organization: Organization | undefined) => void
}) => {
	const { organizations } = useProjects()

	if (organization !== undefined)
		return (
			<p>
				<span>
					We are creating a status for the organization{' '}
					<a
						href={`/organization/${encodeURIComponent(organization.id)}`}
						target="_blank"
					>
						{organization.name ?? organization.id}
					</a>
					.
				</span>
				<button
					type="button"
					class="btn btn-link text-nowrap"
					onClick={() => onOrganization(undefined)}
				>
					(clear)
				</button>
			</p>
		)

	return (
		<>
			<p>
				Before you can share your first status, we need a project that this
				status belongs to. And projects belong to organizations.
			</p>
			<p>So let's start with creating an organization.</p>
			<FormContainer header={<h3>Create an organization</h3>}>
				<CreateOrganization onOrganization={onOrganization} />
			</FormContainer>
			{organizations.length > 0 && (
				<>
					<p>
						or, because you already have organizations, you can select an
						existing one:
					</p>
					<FormContainer header={<h3>Select an existing organization</h3>}>
						{organizations
							.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
							.map((organization) => (
								<p class="mb-1 d-flex justify-content-between align-items-center">
									{organization.name ?? organization.id}
									<button
										type="button"
										class={'btn btn-outline-secondary'}
										onClick={() => onOrganization(organization)}
									>
										select
									</button>
								</p>
							))}
					</FormContainer>
				</>
			)}
		</>
	)
}

const CreateOrSelectProject = ({
	project,
	onProject,
	organization,
}: {
	organization: Organization
	project?: Project
	onProject: (project: Project | undefined) => void
}) => {
	const { projects } = useProjects()

	if (project !== undefined) {
		return (
			<p>
				<span>
					And{' '}
					<a
						href={`/project/${encodeURIComponent(project.id)}`}
						target="_blank"
					>
						{project.name ?? project.id}
					</a>{' '}
					is the project we are creating a status for.
				</span>
				<button
					type="button"
					class="btn btn-link text-nowrap"
					onClick={() => onProject(undefined)}
				>
					(clear)
				</button>
			</p>
		)
	}

	const orgProjects = Object.values(projects)
		.filter((project) => project.organizationId === organization.id)
		.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))

	return (
		<>
			<p>Within an organization, there can be multiple projects.</p>
			<p>For now we need one, so let's create it:</p>
			<FormContainer header={<h3>Create a project</h3>}>
				<CreateProject organization={organization} onProject={onProject} />
			</FormContainer>
			{orgProjects.length > 0 && (
				<>
					<p>
						or, because you already have projects you can also pick an existing
						one:
					</p>
					<FormContainer header={<h3>Select an existing project</h3>}>
						{orgProjects.map((project) => (
							<p class="mb-1 d-flex justify-content-between align-items-center">
								{project.name ?? project.id}
								<button
									type="button"
									class={'btn btn-outline-secondary'}
									onClick={() => onProject(project)}
								>
									select
								</button>
							</p>
						))}
					</FormContainer>
				</>
			)}
		</>
	)
}

const CreateOrReactToStatus = ({
	onStatus,
	project,
	status,
}: {
	onStatus: (id: string) => void
	project: Project
	status?: TStatus
}) => {
	const [reactionsVisible, setReactionsVisible] = useState<boolean>(false)
	const hasReactions = (status?.reactions.length ?? 0) > 0
	if (status !== undefined)
		return (
			<>
				{!hasReactions && (
					<div
						style={{
							backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
						}}
						class={'pb-4'}
					>
						<div class="container">
							<div class="row">
								<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
									<div class="alert alert-success" role="alert">
										Fantastic, below is{' '}
										<a
											href={`/project/${encodeURIComponent(
												project.id,
											)}/status/${encodeURIComponent(status.id)}`}
											target="_blank"
										>
											the status
										</a>{' '}
										you've just created!
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div class="container my-4">
					<div class="row">
						<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
							<Status
								status={status}
								onReactionsVisible={setReactionsVisible}
							/>
						</div>
					</div>
				</div>
				<div
					style={{
						backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
					}}
					class={'pt-4'}
				>
					<div class="container">
						<div class="row">
							<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
								{!hasReactions && (
									<>
										<p>
											Now, try adding reactions to the status by selecting them
											from the reactions menu below each status. Click the{' '}
											<AddReactionIcon size={20} class="mx-1" /> icon!
										</p>
										{reactionsVisible && (
											<>
												<p>
													Click the
													<AddIcon size={20} class="mx-1" /> icon to create a
													custom reaction.
												</p>
												<ReactionsHelp />
											</>
										)}
									</>
								)}
								{hasReactions && (
									<div class="alert alert-success" role="alert">
										<OpenmojiIcon emoji="🤩" />
										Amazing, you are now ready to create your first sync!
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</>
		)

	return (
		<div
			style={{
				backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
			}}
		>
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
						<p>
							Now it's time to create a status. A status an update for your
							coworkers, stakeholders or any party that is interested in what
							just happened in the <ProjectName project={project} /> project:
						</p>
						<FormContainer header={<h3>Create a status</h3>}>
							<CreateStatusForm project={project} onStatus={onStatus} />
						</FormContainer>
					</div>
				</div>
			</div>
		</div>
	)
}

const CreateSync = () => {
	return (
		<FormContainer header={<h3>Create sync</h3>}>
			<p>
				<a href={'/sync/create'}>Form</a> goes here.
			</p>
		</FormContainer>
	)
}
