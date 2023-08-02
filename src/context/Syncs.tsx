import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { useAuth } from './Auth.js'
import { GET, CREATE, DELETE } from '#api/client.js'
import { notReady } from '#api/notReady.js'

export type Sync = {
	id: string
	projectIds: string[]
	title?: string
	inclusiveStartDate?: Date
	inclusiveEndDate?: Date
	persisted?: boolean
	owner: string
	version: number
}

export type SyncsContext = {
	addSync: (
		projectIds: string[],
		title?: string,
		inclusiveStartDate?: Date,
		inclusiveEndDate?: Date,
	) => { error: string } | { id: string }
	syncs: Record<string, Sync>
	deleteSync: (sync: Sync) => ReturnType<typeof DELETE>
}

export const SyncsContext = createContext<SyncsContext>({
	addSync: () => ({ error: 'Not ready.' }),
	syncs: {},
	deleteSync: notReady,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [syncs, setSyncs] = useState<Record<string, Sync>>({})
	const { user } = useAuth()

	useEffect(() => {
		if (user === undefined) return
		GET<{ syncs: Sync[] }>(`/syncs`).ok(({ syncs }) => {
			setSyncs(
				syncs.reduce(
					(syncs, sync) => ({
						...syncs,
						[sync.id]: {
							...sync,
							inclusiveStartDate:
								sync.inclusiveStartDate !== undefined
									? new Date(sync.inclusiveStartDate)
									: undefined,
							inclusiveEndDate:
								sync.inclusiveEndDate !== undefined
									? new Date(sync.inclusiveEndDate)
									: undefined,
						},
					}),
					{},
				),
			)
		})
	}, [user])

	return (
		<SyncsContext.Provider
			value={{
				addSync: (projectIds, title, inclusiveStartDate, inclusiveEndDate) => {
					if (user?.id === undefined) return { error: `Not authorized!` }
					const id = ulid()
					const newSync: Sync = {
						id,
						projectIds,
						title,
						inclusiveStartDate,
						inclusiveEndDate,
						owner: user.id,
						version: 1,
					}
					setSyncs((syncs) => ({
						[newSync.id]: newSync,
						...syncs,
					}))

					CREATE(`/sync`, {
						...newSync,
						inclusiveStartDate:
							newSync.inclusiveStartDate !== undefined
								? newSync.inclusiveStartDate.toISOString()
								: undefined,
						inclusiveEndDate:
							newSync.inclusiveEndDate !== undefined
								? newSync.inclusiveEndDate.toISOString()
								: undefined,
					}).ok(() => {
						setSyncs((syncs) => ({
							...syncs,
							[id]: {
								...(syncs[id] as Sync),
								persisted: true,
							},
						}))
					})
					return { id }
				},
				syncs,
				deleteSync: (sync) =>
					DELETE(`/sync/${sync.id}`, sync.version).ok(() => {
						setSyncs((syncs) => {
							delete syncs[sync.id]
							return { ...syncs }
						})
					}),
			}}
		>
			{children}
		</SyncsContext.Provider>
	)
}

export const useSyncs = () => useContext(SyncsContext)
