import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

type Organization = {
	id: string
	name?: string
}

export type Project = {
	id: string
	name?: string
	organization: Organization
}

export type ProjectsContext = {
	projects: Record<string, Project>
}

export const ProjectsContext = createContext<ProjectsContext>({
	projects: {},
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projects, setProjects] = useState<Record<string, Project>>({})

	useEffect(() => {
		fetch(`${API_ENDPOINT}/organizations`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then<{ organizations: Organization[] }>(async (res) => res.json())
			.then(async ({ organizations }) =>
				Promise.all(
					organizations.map(async (organization) =>
						fetch(`${API_ENDPOINT}/organization/${organization.id}/projects`, {
							headers: {
								Accept: 'application/json; charset=utf-8',
							},
							mode: 'cors',
							credentials: 'include',
						})
							.then<{ projects: { id: string; name?: string }[] }>(
								async (res) => res.json(),
							)
							.then(async ({ projects }) =>
								projects.map((project) => ({ ...project, organization })),
							),
					),
				),
			)
			.then((organizationProjects) =>
				setProjects(
					organizationProjects
						.flat()
						.reduce(
							(projects, project) => ({ ...projects, [project.id]: project }),
							{},
						),
				),
			)
			.catch(console.error)
	}, [])

	return (
		<ProjectsContext.Provider
			value={{
				projects,
			}}
		>
			{children}
		</ProjectsContext.Provider>
	)
}

export const Consumer = ProjectsContext.Consumer

export const useProjects = () => useContext(ProjectsContext)
