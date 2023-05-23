import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { useAuth } from './Auth.js'
import { useSettings } from './Settings.js'

export enum ReactionRole {
	SIGNIFICANT = 'SIGNIFICANT',
	QUESTION = 'QUESTION',
}
export type Reaction = {
	id: string // '01H0ZTWDBCN3RSG0ZV4P97AACY'

	author: string // '@coderbyheart'
	status: string // '01H0ZTK03XXT2FD5ND5E6DH7KD'
} & (
	| {
			emoji: string // '🚀'
			description: string // 'A new feature was implemented'
			role: ReactionRole // 'SIGNIFICANT'
	  }
	| {
			emoji: string // '🚀'
			description?: string // 'A new feature was implemented'
	  }
)
export type Status = {
	project: string // '$teamstatus#development'
	author: string // '@coderbyheart'
	message: string // 'Added Reaction API.'
	id: string // '01H0ZTK03XXT2FD5ND5E6DH7KD'
	version: number // 1
	reactions: Reaction[]
	persisted?: boolean
}

export type StatusContext = {
	projectStatus: (projectId: string) => Status[]
	addProjectStatus: (
		projectId: string,
		message: string,
	) => { error: string } | { id: string }
	deleteStatus: (status: Status) => { error: string } | { success: true }
}

export const StatusContext = createContext<StatusContext>({
	projectStatus: () => [],
	addProjectStatus: () => ({ error: 'Not ready.' }),
	deleteStatus: () => ({ error: 'Not ready.' }),
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [status, setStatus] = useState<Record<string, Status[]>>({})
	const { visibleProjects } = useSettings()
	const { user } = useAuth()

	useEffect(() => {
		Promise.all(
			visibleProjects.map(async (projectId) =>
				fetch(
					`${API_ENDPOINT}/project/${encodeURIComponent(projectId)}/status`,
					{
						headers: {
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
					},
				)
					.then<{ status: Status[] }>(async (res) => res.json())
					.then(({ status }) => ({ projectId, status })),
			),
		)
			.then((projectStatus) =>
				setStatus(
					projectStatus.reduce(
						(allStatus, { projectId, status }) => ({
							...allStatus,
							[projectId]: status,
						}),
						{},
					),
				),
			)
			.catch(console.error)
	}, [visibleProjects])

	return (
		<StatusContext.Provider
			value={{
				projectStatus: (projectId) => status[projectId] ?? [],
				addProjectStatus: (projectId, message) => {
					console.log(projectId, message)
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

					fetch(
						`${API_ENDPOINT}/project/${encodeURIComponent(projectId)}/status`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json; charset=utf-8',
								Accept: 'application/json; charset=utf-8',
							},
							mode: 'cors',
							credentials: 'include',
							body: JSON.stringify({ id, message }),
						},
					)
						.then(() => {
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
						.catch(console.error)

					return { id }
				},
				deleteStatus: (statusToDelete: Status) => {
					const exists = status[statusToDelete.project]?.find(
						({ id }) => statusToDelete.id,
					)
					if (!exists) return { error: `Status ${status.id} not found` }

					setStatus((status) => ({
						...status,
						[statusToDelete.project]: (
							status[statusToDelete.project] ?? []
						).filter(({ id }) => id !== statusToDelete.id),
					}))

					fetch(
						`${API_ENDPOINT}/status/${encodeURIComponent(statusToDelete.id)}`,
						{
							method: 'DELETE',
							headers: {
								Accept: 'application/json; charset=utf-8',
							},
							mode: 'cors',
							credentials: 'include',
						},
					).catch(console.error)

					return { success: true }
				},
			}}
		>
			{children}
		</StatusContext.Provider>
	)
}

export const Consumer = StatusContext.Consumer

export const useStatus = () => useContext(StatusContext)
