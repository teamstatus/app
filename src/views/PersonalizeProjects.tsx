import cx from 'classnames'
import { useEffect, useState } from 'preact/hooks'
import { Colorpicker } from '#components/Colorpicker.js'
import {
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
import {
	useOpenmoji,
	type OpenmojiIcon as OpenmojiIconType,
} from '#context/Openmoji.js'
import { OpenmojiIcon } from '#components/OpenmojiIcon.js'

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
			<ProjectMenu />
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

	const [iconStyleVisible, setIconStyleVisible] = useState(false)
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
						onClick={() => setIconStyleVisible((v) => !v)}
						disabled={!visible}
						style={{
							backgroundColor: color,
							color:
								new Color(color ?? '#212529').luminosity() > 0.5
									? 'black'
									: 'white',
						}}
					>
						{icon === undefined && (
							<img
								src="/static/heart.svg"
								alt="❤️ teamstatus"
								width="20"
								height="20"
							/>
						)}
						{icon !== undefined && <OpenmojiIcon emoji={icon} />}
					</button>
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
			{iconStyleVisible && (
				<>
					<IconPicker
						onIcon={(icon) => {
							setIconStyleVisible(false)
							return personalizeProject(id, {
								icon,
							})
						}}
					/>
					<Colorpicker
						onColor={(color) => {
							setIconStyleVisible(false)
							return personalizeProject(id, {
								color,
							})
						}}
						color={color ?? '#212529'}
					/>
				</>
			)}
		</div>
	)
}

const IconPicker = ({ onIcon }: { onIcon: (icon: string) => void }) => {
	const { icons } = useOpenmoji()
	const [search, setSearch] = useState<string>('')
	const [match, setMatch] = useState<OpenmojiIconType[]>([])
	useEffect(() => {
		if (search.length < 3) return
		setMatch(
			icons
				.filter(({ search: s }) =>
					s.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
				)
				.slice(0, 10),
		)
	}, [search])
	return (
		<>
			<div class="ps-0">
				<label class="d-flex align-items-center justify-content-start">
					Pick your icon:
					<input
						type="search"
						class="form-control form-control-sm mx-1 my-1"
						value={search}
						onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
					/>
				</label>
			</div>
			{match.map((icon) => (
				<button
					type="button"
					class="btn btn-sm btn-outline-secondary me-1 mb-1"
					onClick={() => {
						onIcon(icon.emoji)
					}}
				>
					<OpenmojiIcon emoji={icon.emoji} />
				</button>
			))}
		</>
	)
}
