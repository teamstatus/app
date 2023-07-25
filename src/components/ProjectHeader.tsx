import Color from 'color'
import { type Project } from '#context/Projects.js'
import { useSettings } from '#context/Settings.js'
import { MenuIcon } from '#components/Icons.js'
import { useState } from 'preact/hooks'
import { OffsetMenu } from '#navigation/OffsetMenu.js'
import { ProjectName } from '#components/ProjectName.js'

export const ProjectHeader = ({ project }: { project: Project }) => {
	const { getProjectPersonalization } = useSettings()
	const { color } = getProjectPersonalization(project.id)
	const [collapsed, setCollapsed] = useState(true)
	return (
		<>
			<header
				class="mb-3"
				style={{
					color:
						new Color(color ?? '#212529').luminosity() > 0.5
							? 'black'
							: 'white',
					backgroundColor: color ?? '#212529',
				}}
			>
				<div class="container">
					<div class="row">
						<div class="col d-flex align-items-center justify-content-between">
							<h1 class="pt-2 pb-2 pt-md-4 pb-md-4 fs-5 mb-0">
								<ProjectName project={project} />
							</h1>
							<button
								type="button"
								class="btn btn-outline-secondary btn-sm"
								style={{ color: 'inherit', borderColor: 'inherit' }}
								onClick={() => setCollapsed((c) => !c)}
							>
								<MenuIcon />
							</button>
						</div>
					</div>
				</div>
			</header>
			{!collapsed && <OffsetMenu onClick={() => setCollapsed((c) => !c)} />}
		</>
	)
}
