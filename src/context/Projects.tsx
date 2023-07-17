import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { parseInvitationId, parseProjectId } from '../proto/ids.js'
import { useAuth } from './Auth.js'
import { InternalError } from './InternalError.js'
import { type ProblemDetail } from './ProblemDetail.js'
import { handleResponse } from './handleResponse.js'
import { throttle } from '../api/throttle.js'

export type Organization = {
	id: string
	name?: string
	persisted?: boolean
}

export enum Role {
	OWNER = 'owner',
	MEMBER = 'member',
	WATCHER = 'watcher',
}

export type Project = {
	id: string
	name?: string
	icon?: string
	organization: Organization
	role: Role
	persisted?: boolean
}

export type Invitation = {
	id: string
	inviter: string
	role: Role
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
		role: Role,
	) => Promise<{ error: ProblemDetail } | { success: boolean }>
	acceptProjectInvitation: (
		invitationId: string,
	) => Promise<{ error: ProblemDetail } | { success: boolean }>
	addOrganization: (
		id: string,
		name?: string,
	) => { error: string } | { success: boolean }
	invitations: Invitation[]
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
	invitations: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [projects, setProjects] = useState<Record<string, Project>>({})
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const { user } = useAuth()
	const [projectsListFetchId, setProjectsListId] = useState(ulid())
	const [invitations, setInvitations] = useState<Invitation[]>([])

	const refreshProjects = () => {
		setProjectsListId(ulid())
	}

	useEffect(() => {
		if (user?.id === undefined) return
		throttle(async () =>
			fetch(`${API_ENDPOINT}/organizations`, {
				headers: {
					Accept: 'application/json; charset=utf-8',
				},
				mode: 'cors',
				credentials: 'include',
			})
				.then(handleResponse<{ organizations: Organization[] }>)
				.then(async (res) => {
					if ('error' in res) {
						console.error(res)
					} else {
						setOrganizations(res.result?.organizations ?? [])
					}
				}),
		)().catch(console.error)
	}, [])

	useEffect(() => {
		if (user?.id === undefined) return
		throttle(async () =>
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
				}),
		)().catch(console.error)
	}, [projectsListFetchId])

	// Fetch invites
	useEffect(() => {
		throttle(async () =>
			fetch(`${API_ENDPOINT}/invitations`, {
				headers: {
					Accept: 'application/json; charset=utf-8',
				},
				mode: 'cors',
				credentials: 'include',
			})
				.then(handleResponse<{ invitations: Invitation[] }>)
				.then(async (res) => {
					if ('error' in res) {
						console.error(res)
					} else {
						setInvitations(res.result?.invitations ?? [])
					}
				}),
		)().catch(console.error)
	}, [projectsListFetchId])

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
						role: Role.OWNER,
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
				inviteToProject: async (id, invitedUserId, role) =>
					fetch(`${API_ENDPOINT}/project/${encodeURIComponent(id)}/member`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						body: JSON.stringify({ invitedUserId, role }),
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
							refreshProjects()
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
				invitations,
			}}
		>
			{children}
		</ProjectsContext.Provider>
	)
}

export const Consumer = ProjectsContext.Consumer

export const useProjects = () => useContext(ProjectsContext)

export const canCreateStatus = (role: Role) =>
	[Role.OWNER, Role.MEMBER].includes(role)
