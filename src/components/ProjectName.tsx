import type { Project } from '#context/Projects.tsx'
import { ProjectId } from './ProjectId.tsx'

export const ProjectName = ({ project }: { project: Project }) => (
	<>
		{project.name !== undefined && (
			<>
				<span>{project.name}</span>
				<br />
				<small class="opacity-75">
					<ProjectId id={project.id} />
				</small>
			</>
		)}
		{project.name === undefined && <ProjectId id={project.id} />}
	</>
)
