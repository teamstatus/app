import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useProjects, type Project } from './Projects.js'
import { orderIds } from '../util/orderIds.js'

export type ProjectPersonalization = {
	icon?: string
	alias?: string
	color?: string
	hidden?: boolean
}

export const SettingsContext = createContext<{
	visibleProjects: {
		project: Project
		personalization: ProjectPersonalization
	}[]
	orderedProjects: {
		project: Project
		personalization: ProjectPersonalization
	}[]
	showProject: (id: string) => void
	hideProject: (id: string) => void
	toggleProject: (id: string) => void
	bumpProject: (id: string, direction: 'up' | 'down') => void
	getProjectPersonalization: (id: string) => ProjectPersonalization
	personalizeProject: (
		id: string,
		personalization: Partial<Omit<ProjectPersonalization, 'order'>>,
	) => void
}>({
	visibleProjects: [],
	orderedProjects: [],
	hideProject: () => undefined,
	showProject: () => undefined,
	toggleProject: () => undefined,
	bumpProject: () => undefined,
	getProjectPersonalization: () => ({}),
	personalizeProject: () => undefined,
})

const projectPersonalizationStorageKey =
	'teamstatus:settings:projectPersonalization'

type ProjectPersonalizationWithOrder = ProjectPersonalization & {
	order: number
}

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projectPersonalizations, setProjectPersonalizations] = useState<
		Record<string, ProjectPersonalizationWithOrder>
	>({})
	const { projects } = useProjects()

	useEffect(() => {
		const storedProjectPersonalizations = localStorage.getItem(
			projectPersonalizationStorageKey,
		)
		if (storedProjectPersonalizations === null) return
		try {
			setProjectPersonalizations(JSON.parse(storedProjectPersonalizations))
		} catch {
			// Pass
		}
	}, [])

	// Persist to local storage
	useEffect(() => {
		localStorage.setItem(
			projectPersonalizationStorageKey,
			JSON.stringify(projectPersonalizations),
		)
	}, [projectPersonalizations])

	// Build forced ranked ordered list
	const orderedProjects: {
		project: Project
		personalization: ProjectPersonalization
	}[] = Object.keys(projects)
		.map<[string, number]>((id) => [
			id,
			projectPersonalizations[id]?.order ?? Number.MAX_SAFE_INTEGER,
		])
		.sort(([, o1], [, o2]) => o1 - o2)
		.map(([id]) => id)
		.filter((id) => projects[id] !== undefined)
		.map((id) => ({
			project: projects[id] as Project,
			personalization: projectPersonalizations[id] ?? {
				alias: projects[id]?.name ?? id,
				color: '#212529',
				order: 0,
			},
		}))

	const visibleProjects = orderedProjects.filter(
		({ project: { id } }) =>
			(projectPersonalizations[id]?.hidden ?? false) !== true,
	)

	return (
		<SettingsContext.Provider
			value={{
				visibleProjects,
				orderedProjects,
				showProject: (id) => {
					setProjectPersonalizations((personalizations) => ({
						...personalizations,
						[id]: {
							...(personalizations[id] ?? {
								order: visibleProjects.length,
							}),
							hidden: false,
						},
					}))
				},
				hideProject: (id) => {
					setProjectPersonalizations((personalizations) => ({
						...personalizations,
						[id]: {
							...(personalizations[id] ?? {
								order: visibleProjects.length,
							}),
							hidden: true,
						},
					}))
				},
				toggleProject: (id) => {
					setProjectPersonalizations((personalizations) => ({
						...personalizations,
						[id]: {
							...(personalizations[id] ?? {
								order: visibleProjects.length,
							}),
							hidden: !(personalizations[id]?.hidden ?? false),
						},
					}))
				},
				getProjectPersonalization: (id) =>
					projectPersonalizations[id] ?? {
						alias: projects[id]?.name ?? id,
						color: '#212529',
						order: 0,
					},
				personalizeProject: (id, personalization) => {
					setProjectPersonalizations((personalizations) => ({
						...personalizations,
						[id]: {
							...(personalizations[id] ?? {
								order: visibleProjects.length,
							}),
							...personalization,
						},
					}))
				},
				bumpProject: (id, direction) => {
					setProjectPersonalizations((currentPersonalizations) => {
						const orderedIds = orderedProjects.map(({ project: { id } }) => id)
						return orderIds(orderedIds, id, direction).reduce<
							Record<string, ProjectPersonalizationWithOrder>
						>(
							(personalizations, id, order) => ({
								...personalizations,
								[id]: {
									...(currentPersonalizations[id] ?? {
										order,
									}),
									order,
								},
							}),
							{},
						)
					})
				},
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}

export const Consumer = SettingsContext.Consumer

export const useSettings = () => useContext(SettingsContext)
