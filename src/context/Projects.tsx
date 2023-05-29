import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { parseInvitationId, parseProjectId } from '../proto/ids.js'
import { useAuth } from './Auth.js'

export type Organization = {
	id: string
	name?: string
	persisted?: boolean
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
	) => { error: string } | { success: boolean }
	inviteToProject: (
		id: string,
		user: string,
	) => Promise<{ error: ProblemDetail } | { success: boolean }>
	acceptProjectInvitation: (
		invitationId: string,
	) => Promise<{ error: ProblemDetail } | { success: boolean }>
	addOrganization: (
		id: string,
		name?: string,
	) => { error: string } | { success: boolean }
}

export const ProjectsContext = createContext<ProjectsContext>({
	projects: {},
	addProject: () => ({ error: 'Not ready.' }),
	addOrganization: () => ({ error: 'Not ready.' }),
	inviteToProject: async () => ({
		error: InternalError('Not ready.'),
	}),
	acceptProjectInvitation: async () => ({
		error: InternalError('Not ready.'),
	}),
	organizations: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projects, setProjects] = useState<Record<string, Project>>({})
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const { user } = useAuth()
	const [projectsListId, setProjectsListId] = useState(ulid())

	useEffect(() => {
		if (user?.id === undefined) return
		fetch(`${API_ENDPOINT}/organizations`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then<{ organizations: Organization[] }>(async (res) => res.json())
			.then(async ({ organizations }) => setOrganizations(organizations))
			.catch(console.error)
	}, [])

	useEffect(() => {
		if (user?.id === undefined) return
		fetch(`${API_ENDPOINT}/projects`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then<{ projects: Project[] }>(async (res) => res.json())
			.then(({ projects }) => {
				setProjects(
					projects.reduce(
						(projects, project) => ({
							...projects,
							[project.id]: project,
						}),
						{},
					),
				)
			})
			.catch(console.error)
	}, [projectsListId])

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
				inviteToProject: async (id, invitedUserId) =>
					fetch(`${API_ENDPOINT}/project/${encodeURIComponent(id)}/member`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						body: JSON.stringify({ invitedUserId }),
					})
						.then(async (res) => handleResponse(res))
						.then(async (res) => {
							if ('error' in res) return res
							return { success: true }
						})
						.catch((error) => ({ error: InternalError(error.message) })),
				acceptProjectInvitation: async (invitationId) =>
					fetch(
						`${API_ENDPOINT}/project/${encodeURIComponent(
							parseInvitationId(invitationId).projectId ?? 'null',
						)}/invitation`,
						{
							method: 'POST',
							headers: {
								Accept: 'application/json; charset=utf-8',
							},
							mode: 'cors',
							credentials: 'include',
						},
					)
						.then(async (res) => handleResponse(res))
						.then(async (res) => {
							if ('error' in res) return res
							setProjectsListId(ulid())
							return { success: true }
						})
						.catch((error) => ({ error: InternalError(error.message) })),
				addOrganization: (id, name) => {
					const newOrg: Organization = {
						id,
						name,
						persisted: false,
					}
					setOrganizations((organizations) => [...organizations, newOrg])

					fetch(`${API_ENDPOINT}/organizations`, {
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
							setOrganizations((organizations) => [
								...organizations.filter(({ id: orgId }) => orgId !== id),
								{
									id,
									name,
								},
							])
						})
						.catch(console.error)

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

const handleResponse = async <Result extends Record<string, any>>(
	res: Response,
): Promise<{ error: ProblemDetail } | { result: Result | null }> => {
	if (
		res.headers.get('content-type')?.includes('application/problem+json') ??
		false
	) {
		const problem = await res.json()
		return { error: problem }
	}
	if (
		(res.headers.get('content-type')?.includes('application/json') ?? false) &&
		parseInt(res.headers.get('content-length') ?? '0', 10) > 0
	) {
		return { result: (await res.json()) as Result }
	}
	return { result: null }
}

/**
 * Problem Details Object
 *
 * @see https://datatracker.ietf.org/doc/draft-ietf-httpapi-rfc7807bis/
 */
export type ProblemDetail = {
	type: URL
	status: number
	title: string
	detail?: string
}

export const InternalError = (message?: string): ProblemDetail => ({
	type: new URL(`https://teamstatus.space/error/InternalError`),
	status: 500,
	title: message ?? 'An internal error occurred.',
})
