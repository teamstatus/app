import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AcceptProjectInvitation } from '../components/AcceptProjectInvitation.js'
import { Colorpicker } from '../components/Colorpicker.js'
import {
	ColorsIcon,
	HiddenIcon,
	MembersIcon,
	PersistencePendingIcon,
	UpIcon,
	VisibleIcon,
} from '../components/Icons.js'
import { Role, useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Invitations } from '../components/Invitations.js'
import { ProjectId } from '../components/ProjectId.js'
import { RolePill } from './RolePill.js'
import { Main } from '../components/Main.js'

export const Projects = () => {
	const { projects } = useProjects()
	const { visibleProjects } = useSettings()
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-md-8 offset-md-2">
						<div class="card">
							<div class="card-header">
								<h1>Projects</h1>
							</div>
							<div class="card-body">
								{Object.values(projects)
									.sort(
										(p1, p2) =>
											(visibleProjects().indexOf(p1.id) ??
												Number.MAX_SAFE_INTEGER) -
											(visibleProjects().indexOf(p2.id) ??
												Number.MAX_SAFE_INTEGER),
									)
									.sort((_, { id: p2 }) =>
										visibleProjects().includes(p2) ? 1 : -1,
									)
									.map((project) => (
										<ProjectInfo key={project.id} project={project} />
									))}
								{Object.values(projects).length === 0 && (
									<>
										<p>You have no projects,yet.</p>
										<p>
											<a href="/project/create">Create a new project</a>, or ask
											to be invited to an existing one.
										</p>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-md-8 offset-md-2">
						<AcceptProjectInvitation />
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-md-8 offset-md-2">
						<Invitations />
					</div>
				</div>
			</Main>
			<ProjectMenu
				action={{
					href: '/project/create',
				}}
			/>
		</>
	)
}

const ProjectInfo = ({
	project: { id, name, persisted, role },
}: {
	project: Project
}) => {
	const {
		toggleProject,
		isVisible,
		personalizeProject,
		getProjectPersonalization,
		visibleProjects,
		bumpProject,
	} = useSettings()

	const [colorsVisible, setColorsVisible] = useState(false)
	const visible = isVisible(id)
	const pos = visibleProjects().indexOf(id) ?? Number.MAX_SAFE_INTEGER
	const { alias, icon, color } = getProjectPersonalization(id)

	return (
		<div class="mb-3">
			<div class="d-flex align-items-center justify-content-between mb-1">
				<div>
					<ProjectId id={id} />

					{name !== undefined && (
						<>
							<br />
							<small class="text-muted">{name}</small>
						</>
					)}
				</div>
				<div class={'flex-shrink-0'}>
					<RolePill role={role} class="me-2" />
					<button
						type="button"
						class={cx('btn btn-sm me-2', {
							'btn-outline-danger': !visible,
							'btn-outline-success': visible,
						})}
						onClick={() => toggleProject(id)}
					>
						{visible ? <VisibleIcon /> : <HiddenIcon />}
					</button>
					{visible && (
						<button
							type="button"
							class="btn btn-sm btn-outline-secondary"
							disabled={pos === 0}
							onClick={() => {
								bumpProject(id)
							}}
						>
							<UpIcon />
						</button>
					)}
					{role === Role.OWNER && (
						<a
							href={`/project/${encodeURIComponent(id)}/invite`}
							title={'Invite a user'}
							class={'ms-2 btn btn-outline-secondary btn-sm'}
						>
							<MembersIcon />
						</a>
					)}
				</div>
			</div>
			<div class="d-flex align-items-center justify-content-between">
				{!colorsVisible && (
					<>
						<input
							type="text"
							class="form-control me-1"
							value={icon ?? ''}
							onInput={(e) => {
								const icon = (e.target as HTMLInputElement).value
								personalizeProject(id, {
									alias: (alias?.length ?? 0) > 0 ? alias : undefined,
									color: (color?.length ?? 0) > 0 ? color : undefined,
									icon: icon.length > 0 ? icon : undefined,
								})
							}}
							size={1}
							style={{ width: '50px' }}
						/>
						<input
							type="text"
							class="form-control"
							value={alias ?? ''}
							onInput={(e) => {
								const alias = (e.target as HTMLInputElement).value
								personalizeProject(id, {
									alias: alias.length > 0 ? alias : undefined,
									color: (color?.length ?? 0) > 0 ? color : undefined,
									icon: (icon?.length ?? 0) > 0 ? icon : undefined,
								})
							}}
						/>
						{persisted === false && <PersistencePendingIcon />}
						<button
							type="button"
							class="btn"
							onClick={() => setColorsVisible(true)}
						>
							<ColorsIcon />
						</button>
					</>
				)}
				{colorsVisible && (
					<Colorpicker
						onColor={(color) => {
							setColorsVisible(false)
							return personalizeProject(id, {
								color,
								icon: (icon?.length ?? 0) > 0 ? icon : undefined,
								alias: (alias?.length ?? 0) > 0 ? alias : undefined,
							})
						}}
						color={getProjectPersonalization(id).color ?? '#212529'}
					/>
				)}
			</div>
		</div>
	)
}
