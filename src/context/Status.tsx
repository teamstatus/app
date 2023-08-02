import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { useAuth } from './Auth.js'
import { CREATE, DELETE, GET, UPDATE } from '#api/client.js'

// Reactions can have special roles
export enum ReactionRole {
	// A significant thing happened, makes the status stand out from others in the list of status
	SIGNIFICANT = 'SIGNIFICANT',
	// The status needs to be discussed during the next sync meeting, this will collect this status in a separate list of open questions during the next sync meeting
	QUESTION = 'QUESTION',
}
export type Reaction =
	| {
			emoji: string // '🚀'
			description: string // 'A new feature was implemented'
			role: ReactionRole // 'SIGNIFICANT'
	  }
	| {
			emoji: string // '🚀'
			description?: string // 'A new feature was implemented'
	  }
export type PersistedReaction = {
	id: string // '01H0ZTWDBCN3RSG0ZV4P97AACY'
	author: string // '@coderbyheart'
	status: string // '01H0ZTK03XXT2FD5ND5E6DH7KD'
	persisted?: boolean
} & Reaction
export type Status = {
	project: string // '$teamstatus#development'
	author: string // '@coderbyheart'
	message: string // 'Added Reaction API.'
	id: string // '01H0ZTK03XXT2FD5ND5E6DH7KD'
	version: number // 1
	reactions: PersistedReaction[]
	persisted?: boolean
}

export type StatusContext = {
	projectStatus: Record<string, Status[]>
	addProjectStatus: (
		projectId: string,
		message: string,
	) => { error: string } | { id: string }
	updateStatus: (
		status: Status,
		message: string,
	) => { error: string } | { version: number }
	deleteStatus: (status: Status) => { error: string } | { success: true }
	addReaction: (
		status: Status,
		reaction: Reaction,
	) => { error: string } | { id: string }
	deleteReaction: (
		status: Status,
		reaction: PersistedReaction,
	) => { error: string } | { success: true }
	observe: (id: string) => void
	hasMore: (id: string) => boolean
	fetchMore: (id: string) => void
}

export const StatusContext = createContext<StatusContext>({
	projectStatus: {},
	addProjectStatus: () => ({ error: 'Not ready.' }),
	updateStatus: () => ({ error: 'Not ready.' }),
	deleteStatus: () => ({ error: 'Not ready.' }),
	addReaction: () => ({ error: 'Not ready.' }),
	deleteReaction: () => ({ error: 'Not ready.' }),
	observe: () => undefined,
	hasMore: () => false,
	fetchMore: () => undefined,
})

type Page<Result extends Record<string, any>> = {
	nextStartKey?: string
} & Result

const projectStatusPromiseMap: Record<
	string,
	ReturnType<typeof GET<Page<{ status: Status[] }>>>
> = {}

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [status, setStatus] = useState<Record<string, Status[]>>({})
	const { user } = useAuth()
	const [observedProjects, setObservedProjects] = useState<
		{ id: string; startKey?: string }[]
	>([])
	const [nextStartKey, setNextStartKey] = useState<Record<string, string>>({})

	useEffect(() => {
		for (const { id, startKey } of observedProjects) {
			const k = `${id}:${startKey ?? 'initial'}`
			if (projectStatusPromiseMap[k] !== undefined) continue
			projectStatusPromiseMap[k] = GET<Page<{ status: Status[] }>>(
				`/project/${encodeURIComponent(id)}/status${
					startKey === undefined
						? ''
						: `?${new URLSearchParams({ startKey }).toString()}`
				}`,
			).ok(({ status, nextStartKey }) => {
				setStatus((projectStatus) => ({
					...projectStatus,
					[id]: [...(projectStatus[id] ?? []), ...status],
				}))

				setNextStartKey((keys) => {
					if (nextStartKey !== undefined) {
						return { ...keys, [id]: nextStartKey }
					} else {
						delete keys[id]
						return { ...keys }
					}
				})
			})
		}
	}, [observedProjects])

	return (
		<StatusContext.Provider
			value={{
				projectStatus: status,
				addProjectStatus: (projectId, message) => {
					const author = user?.id
					if (author === undefined) return { error: 'Not authorized!' }
					const id = ulid()
					const newStatus: Status = {
						id,
						message,
						author,
						project: projectId,
						reactions: [],
						version: 1,
						persisted: false,
					}
					setStatus((status) => ({
						...status,
						[projectId]: [newStatus, ...(status[projectId] ?? [])],
					}))
					CREATE(`/project/${encodeURIComponent(projectId)}/status`, {
						id,
						message,
					}).ok(() => {
						setStatus((status) => {
							const projectStatus = status[projectId] ?? []
							const persistedStatus = projectStatus.find(
								({ id: statusId }) => id === statusId,
							)

							let updatedStatus = projectStatus.filter(
								({ id: statusId }) => statusId !== id,
							)
							if (persistedStatus !== undefined) {
								updatedStatus = [
									{ ...persistedStatus, persisted: true },
									...updatedStatus,
								]
							}
							return {
								...status,
								[projectId]: updatedStatus,
							}
						})
					})

					return { id }
				},
				deleteStatus: (statusToDelete: Status) => {
					const exists = status[statusToDelete.project]?.find(
						({ id }) => id === statusToDelete.id,
					)
					if (!exists) return { error: `Status ${status.id} not found` }

					setStatus((status) => ({
						...status,
						[statusToDelete.project]: (
							status[statusToDelete.project] ?? []
						).filter(({ id }) => id !== statusToDelete.id),
					}))

					DELETE(
						`/status/${encodeURIComponent(statusToDelete.id)}`,
						exists.version,
					)

					return { success: true }
				},
				addReaction: (status, reaction) => {
					const author = user?.id
					if (author === undefined) return { error: 'Not authorized!' }

					const id = ulid()
					const newReaction: PersistedReaction = {
						id,
						author,
						status: status.id,
						...reaction,
						persisted: false,
					}
					let added = false
					setStatus((s) => {
						const statusToUpdate = s[status.project]?.find(
							({ id }) => id === status.id,
						)
						if (statusToUpdate === undefined) return s

						const reactionHashs = statusToUpdate.reactions.map(reactionHash)
						if (reactionHashs.includes(reactionHash(newReaction))) return s
						added = true
						return {
							...s,
							[status.project]: (s[status.project] ?? []).map((st) => {
								if (st.id !== status.id) return st
								return {
									...st,
									reactions: [...st.reactions, newReaction],
								}
							}),
						}
					})
					if (added) {
						CREATE(`/status/${encodeURIComponent(status.id)}/reaction`, {
							id,
							...reaction,
						}).ok(() => {
							setStatus((s) => ({
								...s,
								[status.project]: (s[status.project] ?? []).map((st) => {
									if (st.id !== status.id) return st
									return {
										...st,
										reactions: st.reactions.map((reaction) => {
											if (reaction.id === id)
												return {
													...reaction,
													persisted: true,
												}
											return reaction
										}),
									}
								}),
							}))
						})
					}
					return { id }
				},
				deleteReaction: (status, reaction) => {
					const author = user?.id
					if (author === undefined) return { error: 'Not authorized!' }
					if (reaction.author !== author) return { error: 'Not author!' }
					let deleted = false
					setStatus((s) => {
						const statusToUpdate = s[status.project]?.find(
							({ id }) => id === status.id,
						)
						if (statusToUpdate === undefined) return s
						deleted = true
						return {
							...s,
							[status.project]: (s[status.project] ?? []).map((st) => {
								if (st.id !== status.id) return st
								return {
									...st,
									reactions: st.reactions.filter(
										({ id }) => id !== reaction.id,
									),
								}
							}),
						}
					})
					if (deleted) {
						DELETE(`/reaction/${encodeURIComponent(reaction.id)}`, 1)
					}
					return { success: true }
				},
				updateStatus: (status, message) => {
					setStatus((allStatus) => {
						let updatedStatus = (allStatus[status.project] ?? [])?.find(
							({ id }) => id === status.id,
						)
						if (updatedStatus === undefined)
							updatedStatus = {
								...status,
							}
						updatedStatus.message = message
						updatedStatus.persisted = false
						const remainingStatus = (allStatus[status.project] ?? []).filter(
							({ id }) => id !== status.id,
						)

						return {
							...allStatus,
							[status.project]: [updatedStatus, ...remainingStatus],
						}
					})
					UPDATE(`/status/${status.id}`, { message }, status.version).ok(() => {
						setStatus((allStatus) => {
							const projectStatus = allStatus[status.project] ?? []
							const persistedStatus = projectStatus.find(
								({ id: statusId }) => status.id === statusId,
							)

							let updatedStatus = projectStatus.filter(
								({ id: statusId }) => statusId !== status.id,
							)
							if (persistedStatus !== undefined) {
								updatedStatus = [
									{
										...persistedStatus,
										persisted: true,
										version: persistedStatus.version + 1,
									},
									...updatedStatus,
								]
							}
							return {
								...allStatus,
								[status.project]: updatedStatus,
							}
						})
					})

					return { version: status.version + 1 }
				},
				observe: (id) => {
					setObservedProjects((observed) => [...new Set([...observed, { id }])])
				},
				hasMore: (id) => nextStartKey[id] !== undefined,
				fetchMore: (id) => {
					const startKey = nextStartKey[id]
					if (startKey === undefined) return
					setObservedProjects((observed) => [
						...new Set([...observed, { id, startKey }]),
					])
				},
			}}
		>
			{children}
		</StatusContext.Provider>
	)
}

export const useStatus = () => useContext(StatusContext)

export const reactionHash = (reaction: Omit<PersistedReaction, 'id'>): string =>
	`${reaction.emoji}:${reaction.description}:${reaction.status}:${
		reaction.author
	}:${'role' in reaction ? reaction.role : 'NO_ROLE'}`
