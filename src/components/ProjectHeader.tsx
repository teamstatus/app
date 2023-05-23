import Color from 'color'
import { Building, Sprout } from 'lucide-preact'
import { type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'

export const ProjectHeader = ({ project }: { project: Project }) => {
	const { getProjectPersonalization } = useSettings()
	const { color, name } = getProjectPersonalization(project.id)
	return (
		<header
			style={{
				color: new Color(color).negate().hex(),
				backgroundColor: color,
			}}
			class="d-flex align-items-center justify-content-between p-2 mb-2"
		>
			<h1>{name}</h1>
			<div>
				<Sprout /> <abbr id={project.id}>{project.name ?? project.id}</abbr>
				<br />
				<small>
					<Building /> {project.organization.name ?? project.organization.id}
				</small>
			</div>
		</header>
	)
}
