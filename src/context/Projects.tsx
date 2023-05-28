import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { parseProjectId } from '../proto/ids.js'

export type Organization = {
	id: string
	name?: string
}

export type Project = {
	id: string
	name?: string
	organization: Organization
	persisted?: boolean
}

export type ProjectsContext = {
	organizations: Organization[]
	projects: Record<string, Project>
	addProject: (
		id: string,
		name?: string,
	) => { error: string } | { success: true }
	inviteToProject: (
		id: string,
		user: string,
	) => { error: string } | { success: true }
}

export const ProjectsContext = createContext<ProjectsContext>({
	projects: {},
	addProject: () => ({ error: 'Not ready.' }),
	inviteToProject: () => ({ error: 'Not ready.' }),
	organizations: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projects, setProjects] = useState<Record<string, Project>>({})
	const organizations: Organization[] = [
		...new Set(Object.values(projects).map(({ organization }) => organization)),
	]

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
				addProject: (id, name) => {
					const orgId = parseProjectId(id).organization
					const organization = organizations.find(({ id }) => id === orgId)
					if (organization === undefined)
						return { error: `Unknown organization: ${orgId}` }
					const newProject: Project = {
						id,
						name,
						organization,
						persisted: false,
					}
					setProjects((projects) => ({
						...projects,
						[newProject.id]: newProject,
					}))

					fetch(`${API_ENDPOINT}/projects`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						body: JSON.stringify({ id, name }),
					})
						.then(() => {
							setProjects((projects) => ({
								...projects,
								[id]: {
									...(projects[id] as Project),
									persisted: true,
								},
							}))
						})
						.catch(console.error)

					return { success: true }
				},
				organizations,
				inviteToProject: (id, invitedUserId) => {
					fetch(`${API_ENDPOINT}/project/${encodeURIComponent(id)}/member`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						body: JSON.stringify({ invitedUserId }),
					}).catch(console.error)

					return { success: true }
				},
			}}
		>
			{children}
		</ProjectsContext.Provider>
	)
}

export const Consumer = ProjectsContext.Consumer

export const useProjects = () => useContext(ProjectsContext)
