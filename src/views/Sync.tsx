import { ProjectSync } from '../components/ProjectSync.js'
import { SyncTitle } from '../components/SyncTitle.js'
import { useProjects } from '../context/Projects.js'
import { useSyncs } from '../context/Syncs.js'

export const Sync = ({ id }: { id: string }) => {
	const { syncs } = useSyncs()
	const { projects } = useProjects()
	const sync = syncs[id]
	if (sync === undefined) {
		return (
			<main class="container">
				<div class="alert alert-danger" role="alert">
					Sync not found: {id}
				</div>
			</main>
		)
	}

	const projectsInSync = Object.values(projects).filter((project) =>
		sync.projectIds.includes(project.id),
	)

	return (
		<main class="container">
			<header class="mt-3">
				<div class="row">
					<div class="col-md-8 offset-md-2">
						<SyncTitle sync={sync} />
					</div>
				</div>
			</header>
			<div class="row mt-3">
				<div class="col-md-8 offset-md-2">
					{projectsInSync.map((project) => (
						<ProjectSync
							key={project.id}
							project={project}
							startDate={sync.inclusiveStartDate}
							endDate={sync.inclusiveEndDate}
						/>
					))}
				</div>
			</div>
		</main>
	)
}
