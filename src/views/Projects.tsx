import { Building, Palette } from 'lucide-preact'
import { useState } from 'preact/hooks'
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
			<h1>Projects</h1>
			{Object.values(projects).map(({ id, name, organization }) => (
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						id={id}
						onClick={() => toggleProject(id)}
						checked={isVisible(id)}
					/>
					<label class="form-check-label" for={id}>
						{name ?? id}
						<br />
						<small>
							<Building /> {organization.name ?? organization.id}
						</small>
					</label>
					<Colorpicker
						onColor={(color) => {
							return personalizeProject(id, { color })
						}}
					/>
					<ProjectAlias
						currentValue={getProjectPersonalization(id).name ?? ''}
						onAlias={(alias) => {
							personalizeProject(id, { name: alias })
						}}
					/>
				</div>
			))}
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
			onChange={(e) => {
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
				<Palette />
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
