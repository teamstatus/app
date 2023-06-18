import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { ulid } from 'ulid'

export type Sync = {
	id: string
	projectIds: string[]
	title?: string
	inclusiveStartDate?: Date
	inclusiveEndDate?: Date
	persisted?: boolean
}

export type SyncsContext = {
	addSync: (
		projectIds: string[],
		title?: string,
		inclusiveStartDate?: Date,
		inclusiveEndDate?: Date,
	) => { error: string } | { id: string }
	syncs: Record<string, Sync>
}

export const SyncsContext = createContext<SyncsContext>({
	addSync: () => ({ error: 'Not ready.' }),
	syncs: {},
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [syncs, setSyncs] = useState<Record<string, Sync>>({})
	return (
		<SyncsContext.Provider
			value={{
				addSync: (projectIds, title, inclusiveStartDate, inclusiveEndDate) => {
					const id = ulid()
					const newSync: Sync = {
						id,
						projectIds,
						title,
						inclusiveStartDate,
						inclusiveEndDate,
					}
					setSyncs((syncs) => ({
						...syncs,
						[newSync.id]: newSync,
					}))

					fetch(`${API_ENDPOINT}/sync`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						body: JSON.stringify({
							...newSync,
							inclusiveStartDate:
								newSync.inclusiveStartDate !== undefined
									? newSync.inclusiveStartDate.toISOString()
									: undefined,
							inclusiveEndDate:
								newSync.inclusiveEndDate !== undefined
									? newSync.inclusiveEndDate.toISOString()
									: undefined,
						}),
					})
						.then(() => {
							setSyncs((syncs) => ({
								...syncs,
								[id]: {
									...(syncs[id] as Sync),
									persisted: true,
								},
							}))
						})
						.catch(console.error)

					return { id }
				},
				syncs,
			}}
		>
			{children}
		</SyncsContext.Provider>
	)
}

export const Consumer = SyncsContext.Consumer

export const useSyncs = () => useContext(SyncsContext)
