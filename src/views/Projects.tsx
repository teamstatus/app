import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AcceptProjectInvitation } from '../components/AcceptProjectInvitation.js'
import { Colorpicker } from '../components/Colorpicker.js'
import {
	AddIcon,
	ColorsIcon,
	HiddenIcon,
	MembersIcon,
	PersistencePendingIcon,
	UpIcon,
	VisibleIcon,
} from '../components/Icons.js'
import { Role, useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { LogoHeader } from './LogoHeader.js'

export const Projects = () => {
	const { projects } = useProjects()
	const { visibleProjects } = useSettings()
	return (
		<>
			<LogoHeader />
			<main class="container">
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

				<a
					href={`/project/create`}
					style={{
						borderRadius: '100%',
						color: 'white',
						backgroundColor: '#198754',
						display: 'block',
						height: '48px',
						width: '48px',
						boxShadow: '0 0 8px 0 #00000075',
						position: 'fixed',
						right: '10px',
						bottom: '70px',
					}}
					class="d-flex align-items-center justify-content-center"
				>
					<AddIcon />
				</a>
			</main>
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

	return (
		<div class="mb-2">
			{id}
			<div class="d-flex align-items-center justify-content-between">
				{!colorsVisible && (
					<>
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
								class="btn btn-sm btn-outline-secondary me-2"
								disabled={pos === 0}
								onClick={() => {
									bumpProject(id)
								}}
							>
								<UpIcon />
							</button>
						)}
						<ProjectAlias
							currentValue={getProjectPersonalization(id).name}
							onAlias={(alias) => {
								personalizeProject(id, {
									name: alias.length > 0 ? alias : name ?? id,
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
						{role === Role.OWNER && (
							<a
								href={`/project/${encodeURIComponent(id)}/invite`}
								title={'Invite a user'}
							>
								<MembersIcon />
							</a>
						)}
					</>
				)}
				{colorsVisible && (
					<Colorpicker
						onColor={(color) => {
							setColorsVisible(false)
							return personalizeProject(id, { color })
						}}
						color={getProjectPersonalization(id).color}
					/>
				)}
			</div>
		</div>
	)
}

const ProjectAlias = ({
	currentValue,
	onAlias,
}: {
	currentValue: string
	onAlias: (alias: string) => void
}) => {
	const [alias, setAlias] = useState(currentValue)
	return (
		<input
			type="text"
			class="form-control"
			value={alias}
			onInput={(e) => {
				setAlias((e.target as HTMLInputElement).value)
			}}
			onBlur={() => {
				onAlias(alias)
			}}
		/>
	)
}
