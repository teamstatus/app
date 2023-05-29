import { merge } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useProjects } from './Projects.js'

export type ProjectPersonalization = {
	name: string
	color: string
}

export const SettingsContext = createContext<{
	visibleProjects: string[]
	showProject: (id: string) => void
	hideProject: (id: string) => void
	toggleProject: (id: string) => void
	isVisible: (id: string) => boolean
	getProjectPersonalization: (id: string) => ProjectPersonalization
	personalizeProject: (
		id: string,
		personalization: Partial<ProjectPersonalization>,
	) => void
}>({
	visibleProjects: [],
	hideProject: () => undefined,
	showProject: () => undefined,
	toggleProject: () => undefined,
	isVisible: () => false,
	getProjectPersonalization: () => ({ name: '', color: 'black' }),
	personalizeProject: () => undefined,
})

const visibleProjectsStorageKey = 'teamstatus:settings:visibleProjects'
const projectPersonalizationStorageKey =
	'teamstatus:settings:projectPersonalization'

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [visibleProjects, setVisibleProjects] = useState<string[]>([])
	const [projectPersonalizations, setProjectPersonalizations] = useState<
		Record<string, ProjectPersonalization>
	>({})
	const { projects } = useProjects()

	useEffect(() => {
		const storedvisibleProjects = localStorage.getItem(
			visibleProjectsStorageKey,
		)
		if (storedvisibleProjects === null) return
		try {
			setVisibleProjects(JSON.parse(storedvisibleProjects))
		} catch {
			// Pass
		}

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
			visibleProjectsStorageKey,
			JSON.stringify(visibleProjects),
		)
	}, [visibleProjects])
	useEffect(() => {
		localStorage.setItem(
			projectPersonalizationStorageKey,
			JSON.stringify(projectPersonalizations),
		)
	}, [projectPersonalizations])

	return (
		<SettingsContext.Provider
			value={{
				visibleProjects,
				showProject: (id) => {
					setVisibleProjects((visibleProjects) => [
						...new Set([...visibleProjects, id]),
					])
				},
				hideProject: (id) => {
					setVisibleProjects((visibleProjects) =>
						visibleProjects.filter((projectId) => projectId !== id),
					)
				},
				toggleProject: (id) => {
					setVisibleProjects((visibleProjects) => {
						const visible = visibleProjects.includes(id)
						if (visible) {
							return visibleProjects.filter((projectId) => projectId !== id)
						} else {
							return [...visibleProjects, id]
						}
					})
				},
				isVisible: (id) => visibleProjects.includes(id),
				getProjectPersonalization: (id) =>
					projectPersonalizations[id] ?? {
						name: projects[id]?.name ?? id,
						color: 'grey',
					},
				personalizeProject: (id, { name, color }) => {
					setProjectPersonalizations((personalizations) => ({
						...personalizations,
						[id]: merge(personalizations[id], { name, color }),
					}))
				},
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}

export const Consumer = SettingsContext.Consumer

export const useSettings = () => useContext(SettingsContext)
