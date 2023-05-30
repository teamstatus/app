import { useState } from 'preact/hooks'
import { AcceptProjectInvitation } from '../components/AcceptProjectInvitation.js'
import {
	AddIcon,
	ColorsIcon,
	MembersIcon,
	PersistencePendingIcon,
} from '../components/Icons.js'
import { Role, useProjects, type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'

export const Projects = () => {
	const { projects } = useProjects()
	return (
		<main class="container">
			<div class="row mt-3">
				<div class="col">
					<div class="card">
						<div class="card-header">
							<h1>Projects</h1>
						</div>
						<div class="card-body">
							{Object.values(projects).map((project) => (
								<ProjectInfo project={project} />
							))}
							{Object.values(projects).length === 0 && (
								<div class="row">
									<div class="col">
										<p>You have no projects,yet.</p>
										<p>
											<a href="/project/create">Create a new project</a>, or ask
											to be invited to an existing one.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div class="row mt-3">
				<div class="col">
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
	} = useSettings()

	const [colorsVisible, setColorsVisible] = useState(false)

	return (
		<div class="mb-3">
			<div class="form-check">
				<label htmlFor={id}>
					<input
						class="form-check-input"
						type="checkbox"
						id={id}
						onClick={() => toggleProject(id)}
						checked={isVisible(id)}
						placeholder="a short alias"
					/>{' '}
					{id}
				</label>
			</div>
			<div class="d-flex align-items-center justify-content-between">
				{!colorsVisible && (
					<>
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

export const colors = [
	'#6a3d9a',
	'#666666',
	'#386cb0',
	'#984ea3',
	'#a65628',
	'#1f78b4',
	'#e31a1c',
	'#d53e4f',
	'#bf5b17',
	'#7570b3',
	'#377eb8',
	'#f0027f',
	'#a6761d',
	'#3288bd',
	'#d95f02',
	'#33a02c',
	'#bc80bd',
	'#f46d43',
	'#999999',
	'#4daf4a',
	'#ff7f00',
	'#fb8072',
	'#f781bf',
	'#80b1d3',
	'#66c2a5',
	'#fb9a99',
	'#e6ab02',
	'#beaed4',
	'#7fc97f',
	'#cab2d6',
	'#bebada',
	'#fdae61',
	'#fdb462',
	'#fbb4ae',
	'#8dd3c7',
	'#a6cee3',
	'#b3cde3',
	'#fdbf6f',
	'#fdc086',
	'#b3de69',
	'#abdda4',
	'#decbe4',
	'#b2df8a',
	'#d9d9d9',
	'#e5d8bd',
	'#fccde5',
	'#fed9a6',
	'#fee08b',
	'#ccebc5',
	'#fddaec',
	'#ffed6f',
	'#e6f598',
	'#f2f2f2',
	'#ffff33',
	'#ffffb3',
	'#ffffcc',
]

const Colorpicker = ({ onColor }: { onColor: (color: string) => void }) => (
	<ul class="ps-0">
		{colors
			.sort((a, b) => parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16))
			.map((color) => (
				<button
					type="button"
					class="btn px-3 py-3 mx-1 my-1"
					style={{ backgroundColor: color }}
					onClick={() => {
						onColor(color)
					}}
				></button>
			))}
	</ul>
)
