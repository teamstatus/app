import Color from 'color'
import { type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { ProjectsIcon } from './Icons.js'

export const ProjectHeader = ({ project }: { project: Project }) => {
	const { getProjectPersonalization } = useSettings()
	const { color, name } = getProjectPersonalization(project.id)
	return (
		<header
			style={{
				color: new Color(color).luminosity() > 0.5 ? 'black' : 'white',
				backgroundColor: color,
			}}
			class="d-flex align-items-center justify-content-between p-2 mb-2"
		>
			<h1 class={'mb-0 fw-light'}>{name}</h1>
			<div class={'fw-light'}>
				<ProjectsIcon /> {project.id}
			</div>
		</header>
	)
}
