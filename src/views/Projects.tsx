import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AcceptProjectInvitation } from '../components/AcceptProjectInvitation.js'
import { Colorpicker } from '../components/Colorpicker.js'
import {
	ColorsIcon,
	DownIcon,
	HiddenIcon,
	MembersIcon,
	PersistencePendingIcon,
	ProjectsIcon,
	UpIcon,
	VisibleIcon,
} from '../components/Icons.js'
import { Role, useProjects, type Project } from '../context/Projects.js'
import {
	useSettings,
	type ProjectPersonalization,
} from '../context/Settings.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Invitations } from '../components/Invitations.js'
import { ProjectId } from '../components/ProjectId.js'
import { RolePill } from './RolePill.js'
import { Main } from '../components/Main.js'

export const Projects = () => {
	const { projects } = useProjects()
	const { orderedProjects } = useSettings()

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>Projects</h1>
								<ProjectsIcon />
							</div>
							<div>
								{orderedProjects.map(
									({ project, personalization }, index, arr) => (
										<ProjectInfo
											key={project.id}
											personalization={personalization}
											project={project}
											first={index === 0}
											last={index === arr.length - 1}
										/>
									),
								)}
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
						</section>
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<AcceptProjectInvitation />
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
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
	personalization: { alias, icon, color, hidden },
	first,
	last,
}: {
	personalization: ProjectPersonalization
	project: Project
	first: boolean
	last: boolean
}) => {
	const { toggleProject, personalizeProject, bumpProject } = useSettings()

	const [colorsVisible, setColorsVisible] = useState(false)
	const visible = (hidden ?? false) === false

	return (
		<div class="mb-3 mb-md-4 mt-md-4">
			<div class="d-flex align-items-center justify-content-between">
				<ProjectId id={id} />
				<div>
					{persisted === false && <PersistencePendingIcon />}
					<RolePill role={role} />
				</div>
			</div>
			{name !== undefined && (
				<div>
					<small class="text-muted">{name}</small>
				</div>
			)}
			<div class="d-flex align-items-center justify-content-between mt-1">
				<div class="flex-row d-flex">
					<input
						type="text"
						class="form-control me-1"
						value={icon ?? ''}
						onInput={(e) => {
							const icon = (e.target as HTMLInputElement).value
							personalizeProject(id, {
								icon: icon.length > 0 ? icon : undefined,
							})
						}}
						size={1}
						style={{ width: '50px' }}
						disabled={!visible}
					/>
					<button
						type="button"
						class="btn btn-sm btn-outline-secondary"
						onClick={() => setColorsVisible((v) => !v)}
						disabled={!visible}
					>
						<ColorsIcon />
					</button>
				</div>
				<div>
					<button
						type="button"
						class={cx('btn btn-sm btn-outline-secondary')}
						onClick={() => toggleProject(id)}
					>
						{visible ? <VisibleIcon /> : <HiddenIcon />}
					</button>
					<button
						type="button"
						class="btn btn-sm btn-outline-secondary ms-2"
						disabled={!visible || first}
						onClick={() => {
							bumpProject(id, 'up')
						}}
					>
						<UpIcon />
					</button>
					<button
						type="button"
						class="btn btn-sm btn-outline-secondary ms-1"
						disabled={!visible || last}
						onClick={() => {
							bumpProject(id, 'down')
						}}
					>
						<DownIcon />
					</button>
					{role === Role.OWNER && (
						<a
							href={`/project/${encodeURIComponent(id)}/invite`}
							title={'Invite a user'}
							class={'btn btn-sm btn-outline-secondary ms-2'}
						>
							<MembersIcon />
						</a>
					)}
				</div>
			</div>
			{!colorsVisible && (
				<input
					type="text"
					class="form-control mt-1"
					value={alias ?? ''}
					onInput={(e) => {
						const alias = (e.target as HTMLInputElement).value
						personalizeProject(id, {
							alias: alias.length > 0 ? alias : undefined,
						})
					}}
					disabled={!visible}
				/>
			)}
			{colorsVisible && (
				<Colorpicker
					onColor={(color) => {
						setColorsVisible(false)
						return personalizeProject(id, {
							color,
						})
					}}
					color={color ?? '#212529'}
				/>
			)}
		</div>
	)
}
