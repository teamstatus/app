import { GET } from '#api/client.js'
import { type ProblemDetail } from '#context/ProblemDetail.js'
import { useProjects, type Project } from '#context/Projects.js'
import { ReactionRole, type Status } from '#context/Status.js'
import { useSyncs, type Sync, type Sync as TSync } from '#context/Syncs.js'
import type { VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { NotFound } from '#components/NotFound.js'
import { Problem } from '#components/Problem.js'

export type ProjectStatusMap = Record<string, Status[]>

export const isStatus = (item: Status | undefined): item is Status =>
	item !== undefined

export const WithSync = ({
	id,
	children,
}: {
	id: string
	children: (args: {
		sync: Sync
		projectsWithStatus: { project: Project; status: Status[] }[]
		statusWithQuestions: Status[]
	}) => VNode<any>
}) => {
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
		return <Problem problem={problem} />
	}

	if (sync === undefined) {
		return <NotFound>Sync not found: {id}</NotFound>
	}

	const projectsInSync = Object.values(projects)
		.filter((project) => sync.projectIds.includes(project.id))
		.sort(byMostRecentUpdate(status))
		.sort(byNumberOfSignificant(status))
		.sort(byNumberOfQuestions(status))

	const statusWithQuestions: Status[] = projectsInSync
		.map(({ id }) => status[id])
		.flat()
		.filter(isStatus)
		.filter(
			({ reactions }) =>
				(reactions ?? []).find(
					(r) => 'role' in r && r.role === ReactionRole.QUESTION,
				) !== undefined,
		)

	return children({
		sync,
		projectsWithStatus: projectsInSync.map((project) => ({
			project,
			status: status[project.id] ?? [],
		})),
		statusWithQuestions,
	})
}

export const byReactionsWithRole =
	(role: ReactionRole, status: ProjectStatusMap) =>
	(p1: Project, p2: Project) =>
		(getNumberOfReactionsWithRole(role, status[p2.id] ?? []) ?? 0) -
		(getNumberOfReactionsWithRole(role, status[p1.id] ?? []) ?? 0)

export const byNumberOfSignificant = (status: ProjectStatusMap) =>
	byReactionsWithRole(ReactionRole.SIGNIFICANT, status)

export const byNumberOfQuestions = (status: ProjectStatusMap) =>
	byReactionsWithRole(ReactionRole.QUESTION, status)

export const byMostRecentUpdate =
	(status: ProjectStatusMap) => (p1: Project, p2: Project) =>
		(getLastUpdate(status[p2.id] ?? []) ?? 0) -
		(getLastUpdate(status[p1.id] ?? []) ?? 0)

export const getLastUpdate = (status: Status[]): number | null => {
	const lastUpdated = [...status]
		.map(({ id }) => decodeTime(id))
		.sort((d1, d2) => d1 - d2)[0]
	return lastUpdated ?? null
}

export const getNumberOfReactionsWithRole = (
	role: ReactionRole,
	status: Status[],
) =>
	status
		.map(
			({ reactions }) =>
				reactions.filter(
					(reaction) => 'role' in reaction && reaction.role === role,
				).length,
		)
		.reduce(sum, 0)

export const sum = (total: number, count: number): number => total + count
