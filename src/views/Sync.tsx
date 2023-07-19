import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '../components/ProjectSync.js'
import { SyncTitle } from '../components/SyncTitle.js'
import { useProjects } from '../context/Projects.js'
import { useSyncs, type Sync as TSync } from '../context/Syncs.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { handleResponse } from '../context/handleResponse.js'
import { type ProblemDetail } from '../context/ProblemDetail.js'
import type { Status } from '../context/Status.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'

export const Sync = ({ id }: { id: string }) => {
	const { syncs } = useSyncs()
	const { projects } = useProjects()
	const [problem, setProblem] = useState<ProblemDetail>()
	const [sync, setSync] = useState<TSync | undefined>(syncs[id])
	const [status, setStatus] = useState<Record<string, Status[]>>({})

	useEffect(() => {
		if (sync !== undefined) return
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

	useEffect(() => {
		if (sync === undefined) return
		fetch(`${API_ENDPOINT}/sync/${encodeURIComponent(id)}/status`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then(handleResponse<{ status: Status[] }>)
			.then((res) => {
				if ('error' in res) {
					console.error(res)
					return
				}
				setStatus(
					res.result?.status?.reduce<Record<string, Status[]>>(
						(projectStatus, status) => ({
							...projectStatus,
							[status.project]: [
								...(projectStatus[status.project] ?? []),
								status,
							],
						}),
						{},
					) ?? {},
				)
			})
			.catch(console.error)
	}, [sync])

	if (problem !== undefined) {
		return (
			<>
				<LogoHeader />
				<Main class="container">
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
				</Main>
				<ProjectMenu />
			</>
		)
	}

	if (sync === undefined) {
		return (
			<>
				<LogoHeader />
				<Main class="container">
					<div class="row mt-3">
						<div class="col">
							<div class="alert alert-danger" role="alert">
								Sync not found: {id}
							</div>
						</div>
					</div>
				</Main>
				<ProjectMenu />
			</>
		)
	}

	const projectsInSync = Object.values(projects).filter((project) =>
		sync.projectIds.includes(project.id),
	)

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<header class="mt-3">
					<div class="row">
						<div class="col-12 col-md-6 offset-md-3">
							<SyncTitle sync={sync} />
						</div>
					</div>
				</header>
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						{projectsInSync.map((project) => (
							<ProjectSync
								key={project.id}
								project={project}
								status={status[project.id] ?? []}
								startDate={sync.inclusiveStartDate}
							/>
						))}
					</div>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
