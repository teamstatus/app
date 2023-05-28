import { useState } from 'preact/hooks'
import {
	AddIcon,
	ColorsIcon,
	MembersIcon,
	PersistencePendingIcon,
	ProjectsIcon,
} from '../components/Icons.js'
import { useProjects } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'

export const Projects = () => {
	const {
		toggleProject,
		isVisible,
		personalizeProject,
		getProjectPersonalization,
	} = useSettings()

	const { projects } = useProjects()

	return (
		<main class="container">
			<h1 class="fw-light">Projects</h1>
			{Object.values(projects).map(({ id, name, persisted }) => (
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						id={id}
						onClick={() => toggleProject(id)}
						checked={isVisible(id)}
						placeholder="a short alias"
					/>
					<ProjectAlias
						currentValue={getProjectPersonalization(id).name ?? ''}
						onAlias={(alias) => {
							personalizeProject(id, {
								name: alias.length > 0 ? alias : name ?? id,
							})
						}}
					/>
					<Colorpicker
						onColor={(color) => {
							return personalizeProject(id, { color })
						}}
					/>
					{persisted === false && <PersistencePendingIcon />}
					<a
						href={`/project/${encodeURIComponent(id)}/invite`}
						title={'Invite a user'}
					>
						<MembersIcon />
					</a>
					<br />
					<small>
						<ProjectsIcon /> {id}
					</small>
				</div>
			))}
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

const Colorpicker = ({ onColor }: { onColor: (color: string) => void }) => {
	const [expanded, setExpanded] = useState<boolean>(false)
	const colors = [
		'#AD1457',
		'#F4511E',
		'#E4C441',
		'#0B8043',
		'#3F51B5',
		'#8E24AA',
		'#D81B60',
		'#EF6C00',
		'#C0CA33',
		'#009688',
		'#7986CB',
		'#795548',
		'#D50000',
		'#F09300',
		'#7CB342',
		'#039BE5',
		'#B39DDB',
		'#616161',
		'#E67C73',
		'#F6BF26',
		'#33B679',
		'#4285F4',
		'#9E69AF',
		'#A79B8E',
	]
	return (
		<>
			<button type="button" class="btn" onClick={() => setExpanded((x) => !x)}>
				<ColorsIcon />
			</button>
			{expanded && (
				<ul>
					{colors
						.sort((a, b) => parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16))
						.map((color) => (
							<button
								type="button"
								class="btn px-3 py-3 mx-1 my-1"
								style={{ backgroundColor: color }}
								onClick={() => {
									onColor(color)
									setExpanded(false)
								}}
							></button>
						))}
				</ul>
			)}
		</>
	)
}
