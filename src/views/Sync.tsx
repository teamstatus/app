import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '../components/ProjectSync.js'
import { SyncTitle } from '../components/SyncTitle.js'
import { useProjects } from '../context/Projects.js'
import { useSyncs, type Sync as TSync } from '../context/Syncs.js'
import { LogoHeader } from './LogoHeader.js'
import { handleResponse } from '../context/handleResponse.js'
import { type ProblemDetail } from '../context/ProblemDetail.js'

export const Sync = ({ id }: { id: string }) => {
	const { syncs } = useSyncs()
	const { projects } = useProjects()
	const [problem, setProblem] = useState<ProblemDetail>()
	const [sync, setSync] = useState<TSync | undefined>(syncs[id])

	useEffect(() => {
		fetch(`${API_ENDPOINT}/sync/${encodeURIComponent(id)}`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then(handleResponse<{ sync: TSync }>)
			.then((maybeSync) => {
				if ('error' in maybeSync) {
					setProblem(maybeSync.error)
				} else if (maybeSync.result !== null) {
					console.log(maybeSync.result.sync)
					setSync({
						...maybeSync.result.sync,
						inclusiveStartDate:
							maybeSync.result.sync.inclusiveStartDate !== undefined
								? new Date(maybeSync.result.sync.inclusiveStartDate)
								: undefined,
						inclusiveEndDate:
							maybeSync.result.sync.inclusiveEndDate !== undefined
								? new Date(maybeSync.result.sync.inclusiveEndDate)
								: undefined,
					})
				}
			})
			.catch(console.error)
	}, [id])

	if (problem !== undefined) {
		return (
			<>
				<LogoHeader />
				<main class="container">
					<div class="row mt-3">
						<div class="col">
							<div class="alert alert-danger" role="alert">
								{problem.title} ({problem.status})
								{problem.detail !== undefined && (
									<>
										<br />
										{problem.detail}
									</>
								)}
							</div>
						</div>
					</div>
				</main>
			</>
		)
	}

	if (sync === undefined) {
		return (
			<>
				<LogoHeader />
				<main class="container">
					<div class="row mt-3">
						<div class="col">
							<div class="alert alert-danger" role="alert">
								Sync not found: {id}
							</div>
						</div>
					</div>
				</main>
			</>
		)
	}

	const projectsInSync = Object.values(projects).filter((project) =>
		sync.projectIds.includes(project.id),
	)

	return (
		<>
			<LogoHeader />
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
		</>
	)
}
