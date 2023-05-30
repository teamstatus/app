import Color from 'color'
import { type Project } from '../context/Projects.js'
import { useSettings } from '../context/Settings.js'
import { parseProjectId } from '../proto/ids.js'

export const ProjectHeader = ({ project }: { project: Project }) => {
	const { getProjectPersonalization } = useSettings()
	const { color } = getProjectPersonalization(project.id)
	const { organization, project: projectId } = parseProjectId(project.id)
	return (
		<header
			style={{
				color: new Color(color).luminosity() > 0.5 ? 'black' : 'white',
				backgroundColor: color,
			}}
			class="p-2 mb-3"
		>
			<div class="container">
				<div class="row">
					<div class="col d-flex align-items-center justify-content-between">
						<h1 class="pt-2 pb-2 fs-5 mb-0">
							<span style={{ opacity: 0.75 }}>{organization}</span>
							<strong>{projectId}</strong>
						</h1>
					</div>
				</div>
			</div>
		</header>
	)
}
