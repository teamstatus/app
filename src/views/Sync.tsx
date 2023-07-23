import { useEffect, useState } from 'preact/hooks'
import { ProjectSync } from '../components/ProjectSync.js'
import { SyncTitle } from '../components/SyncTitle.js'
import { useProjects, type Project } from '../context/Projects.js'
import { useSyncs, type Sync as TSync } from '../context/Syncs.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { type ProblemDetail } from '../context/ProblemDetail.js'
import { ReactionRole, type Status } from '../context/Status.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'
import { decodeTime } from 'ulid'
import { GET } from '../api/client.js'

type ProjectStatusMap = Record<string, Status[]>

export const Sync = ({ id }: { id: string }) => {
	const { syncs } = useSyncs()
	const { projects } = useProjects()
	const [problem, setProblem] = useState<ProblemDetail>()
	const [sync, setSync] = useState<TSync | undefined>(syncs[id])
	const [status, setStatus] = useState<ProjectStatusMap>({})

	useEffect(() => {
		if (sync !== undefined) return
		GET<{ sync: TSync }>(`/sync/${encodeURIComponent(id)}`)
			.fail(setProblem)
			.ok(({ sync }) => {
				setSync({
					...sync,
					inclusiveStartDate:
						sync.inclusiveStartDate !== undefined
							? new Date(sync.inclusiveStartDate)
							: undefined,
					inclusiveEndDate:
						sync.inclusiveEndDate !== undefined
							? new Date(sync.inclusiveEndDate)
							: undefined,
				})
			})
	}, [id])

	useEffect(() => {
		if (sync === undefined) return
		GET<{ status: Status[] }>(`/sync/${encodeURIComponent(id)}/status`).ok(
			({ status }) => {
				setStatus(
					status.reduce<ProjectStatusMap>(
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
			},
		)
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

	const projectsInSync = Object.values(projects)
		.filter((project) => sync.projectIds.includes(project.id))
		.sort(byMostRecentUpdate(status))
		.sort(byNumberOfSignificant(status))
		.sort(byNumberOfQuestions(status))

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

const byReactionsWithRole =
	(role: ReactionRole, status: ProjectStatusMap) =>
	(p1: Project, p2: Project) => {
		console.log(p2.id, getNumberOfReactionsWithRole(role, status[p2.id] ?? []))
		return (
			(getNumberOfReactionsWithRole(role, status[p2.id] ?? []) ?? 0) -
			(getNumberOfReactionsWithRole(role, status[p1.id] ?? []) ?? 0)
		)
	}

const byNumberOfSignificant = (status: ProjectStatusMap) =>
	byReactionsWithRole(ReactionRole.SIGNIFICANT, status)

const byNumberOfQuestions = (status: ProjectStatusMap) =>
	byReactionsWithRole(ReactionRole.QUESTION, status)

const byMostRecentUpdate =
	(status: ProjectStatusMap) => (p1: Project, p2: Project) =>
		(getLastUpdate(status[p2.id] ?? []) ?? 0) -
		(getLastUpdate(status[p1.id] ?? []) ?? 0)

const getLastUpdate = (status: Status[]): number | null => {
	const lastUpdated = [...status]
		.map(({ id }) => decodeTime(id))
		.sort((d1, d2) => d1 - d2)[0]
	return lastUpdated ?? null
}

const getNumberOfReactionsWithRole = (role: ReactionRole, status: Status[]) =>
	status
		.map(
			({ reactions }) =>
				reactions.filter(
					(reaction) => 'role' in reaction && reaction.role === role,
				).length,
		)
		.reduce(sum, 0)

const sum = (total: number, count: number): number => total + count
