import cx from 'classnames'
import { useState } from 'preact/hooks'
import { Colorpicker } from '#components/Colorpicker.js'
import {
	ColorsIcon,
	DownIcon,
	HiddenIcon,
	ProjectsIcon,
	UpIcon,
	VisibleIcon,
} from '#components/Icons.js'
import { useProjects, type Project } from '#context/Projects.js'
import { useSettings, type ProjectPersonalization } from '#context/Settings.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { ProjectId } from '#components/ProjectId.js'
import { Main } from '#components/Main.js'
import Color from 'color'

export const PersonalizeProjects = () => {
	const { projects } = useProjects()
	const { orderedProjects } = useSettings()

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>Personalize Projects</h1>
								<ProjectsIcon />
							</div>
							<p>
								Here you can personalize the projects for you. You can decide
								whether to include them in the project menu, their order, color
								and icon.
							</p>
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
			</Main>
			<ProjectMenu
				actions={[
					{
						href: '/project/create',
					},
				]}
			/>
		</>
	)
}

const ProjectInfo = ({
	project: { id, name },
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
		<div class="mb-2">
			<div class="d-flex align-items-center">
				<ProjectId id={id} />
				{name !== undefined && <small class="text-muted ms-2">({name})</small>}
			</div>
			<div class="d-flex align-items-center justify-content-between mt-1">
				<div class="flex-row d-flex">
					<button
						type="button"
						class="btn btn-outline-secondary me-1"
						onClick={() => setColorsVisible((v) => !v)}
						disabled={!visible}
						style={{
							backgroundColor: color,
							color:
								new Color(color ?? '#212529').luminosity() > 0.5
									? 'black'
									: 'white',
						}}
					>
						<ColorsIcon />
					</button>
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
					<input
						type="text"
						class="form-control me-1"
						value={alias ?? ''}
						onInput={(e) => {
							const alias = (e.target as HTMLInputElement).value
							personalizeProject(id, {
								alias: alias.length > 0 ? alias : undefined,
							})
						}}
						disabled={!visible}
						placeholder={'your alias'}
					/>
				</div>
				<div class="flex-shrink-0">
					<button
						type="button"
						class={cx('btn btn-sm btn-outline-secondary')}
						onClick={() => toggleProject(id)}
					>
						{visible ? <VisibleIcon /> : <HiddenIcon />}
					</button>
					<button
						type="button"
						class="btn btn-sm btn-outline-secondary ms-1"
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
				</div>
			</div>
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
