import { createContext, type ComponentChildren } from 'preact'
import { ulid } from 'ulid'
import { useAuth } from './Auth.tsx'
import { CREATE, DELETE, GET, UPDATE } from '#api/client.ts'
import { useContext, useRef, useState } from 'preact/hooks'

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
	attributeTo?: string // '@blake'
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
		attributeTo?: string,
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

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [status, setStatus] = useState<Record<string, Status[]>>({})
	const { user } = useAuth()
	const observedProjects = useRef<Map<string, string | undefined | null>>(
		new Map(),
	)

	const fetchStatus = (id: string) => {
		const startKey = observedProjects.current.get(id)
		if (startKey === null) return
		GET<Page<{ status: Status[] }>>(
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
			observedProjects.current.set(id, nextStartKey ?? null)
		})
	}

	const addProjectStatus = (
		projectId: string,
		message: string,
		attributeTo?: string,
	) => {
		const author = user?.id
		if (author === undefined) return { error: 'Not authorized!' }
		const id = ulid()
		const newStatus: Status = {
			id,
			message,
			attributeTo,
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
			attributeTo,
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
	}

	const deleteStatus = (
		statusToDelete: Status,
	): { success: true } | { error: string } => {
		const exists = status[statusToDelete.project]?.find(
			({ id }) => id === statusToDelete.id,
		)
		if (!exists) return { error: `Status ${status.id} not found` }

		setStatus((status) => ({
			...status,
			[statusToDelete.project]: (status[statusToDelete.project] ?? []).filter(
				({ id }) => id !== statusToDelete.id,
			),
		}))

		DELETE(`/status/${encodeURIComponent(statusToDelete.id)}`, exists.version)

		return { success: true }
	}

	const addReaction = (status: Status, reaction: Reaction) => {
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
	}

	const deleteReaction = (
		status: Status,
		reaction: PersistedReaction,
	): { success: true } | { error: string } => {
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
						reactions: st.reactions.filter(({ id }) => id !== reaction.id),
					}
				}),
			}
		})
		if (deleted) {
			DELETE(`/reaction/${encodeURIComponent(reaction.id)}`, 1)
		}
		return { success: true }
	}

	const updateStatus = (status: Status, message: string) => {
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
	}

	const observe = (id: string) => {
		if (observedProjects.current.has(id)) return
		observedProjects.current.set(id, undefined)
		fetchStatus(id)
	}

	const hasMore = (id: string) =>
		typeof observedProjects.current.get(id) === 'string'

	const fetchMore = (id: string) => {
		const startKey = observedProjects.current.get(id)
		if (startKey === null) return
		fetchStatus(id)
	}

	return (
		<StatusContext.Provider
			value={{
				projectStatus: status,
				addProjectStatus: (projectId, message, attributeTo) =>
					addProjectStatus(projectId, message, attributeTo),
				deleteStatus: (statusToDelete) => deleteStatus(statusToDelete),
				addReaction: (status, reaction) => addReaction(status, reaction),
				deleteReaction: (status, reaction) => deleteReaction(status, reaction),
				updateStatus: (status, message) => updateStatus(status, message),
				observe: (id) => observe(id),
				hasMore: (id) => hasMore(id),
				fetchMore: (id) => fetchMore(id),
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
