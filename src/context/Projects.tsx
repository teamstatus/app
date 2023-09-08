import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ulid } from 'ulid'
import { parseInvitationId, parseProjectId } from '#proto/ids.js'
import { useAuth } from './Auth.js'
import { CREATE, DELETE, GET, UPDATE } from '#api/client.js'
import { notReady } from '#api/notReady.js'

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
	organizationId: string
	name?: string
	icon?: string
	role: Role
	persisted?: boolean
	version: number
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
	) => ReturnType<typeof CREATE>
	acceptProjectInvitation: (invitationId: string) => ReturnType<typeof CREATE>
	addOrganization: (
		id: string,
		name?: string,
	) => { error: string } | { success: boolean }
	invitations: Invitation[]
	updateProject: (
		project: Project,
		update: { name: string },
	) => ReturnType<typeof UPDATE>
	deleteProject: (project: Project) => ReturnType<typeof DELETE>
}

export const ProjectsContext = createContext<ProjectsContext>({
	projects: {},
	addProject: () => ({ error: 'Not ready.' }),
	addOrganization: () => ({ error: 'Not ready.' }),
	inviteToProject: notReady<Record<string, never>>,
	acceptProjectInvitation: notReady<Record<string, never>>,
	organizations: [],
	invitations: [],
	updateProject: notReady<Record<string, never>>,
	deleteProject: notReady<Record<string, never>>,
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
		if (user === undefined) return
		GET<{ organizations: Organization[] }>(`/organizations`).ok(
			({ organizations }) => {
				setOrganizations(organizations)
			},
		)
	}, [user])

	useEffect(() => {
		if (user === undefined) return
		GET<{ projects: Project[] }>(`/projects`, { cache: false }).ok(
			({ projects }) => {
				setProjects(
					projects.reduce(
						(projects, project) => ({
							...projects,
							[project.id]: {
								...project,
								organizationId: parseProjectId(project.id).organization,
							},
						}),
						{},
					),
				)
			},
		)
	}, [projectsListFetchId, user])

	// Fetch invites
	useEffect(() => {
		if (user === undefined) return
		GET<{ invitations: Invitation[] }>(`/invitations`, { cache: false }).ok(
			({ invitations }) => {
				setInvitations(invitations ?? [])
			},
		)
	}, [projectsListFetchId, user])

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
						organizationId: organization.id,
						name,
						persisted: false,
						role: Role.OWNER,
						version: 1,
					}
					setProjects((projects) => ({
						...projects,
						[newProject.id]: newProject,
					}))
					CREATE(`/projects`, { id, name })
						.ok(() => {
							setProjects((projects) => ({
								...projects,
								[id]: {
									...(projects[id] as Project),
									persisted: true,
								},
							}))
						})
						.fail(() => {
							setProjects((projects) => {
								delete projects[id]
								return Object.entries(projects)
									.filter(([projectId]) => projectId !== id)
									.reduce<Record<string, Project>>(
										(projects, [id, project]) => ({
											...projects,
											[id]: project,
										}),
										{},
									)
							})
						})

					return { success: true }
				},
				organizations,
				inviteToProject: (id, invitedUserId, role) =>
					CREATE(`/project/${encodeURIComponent(id)}/member`, {
						invitedUserId,
						role,
					}),
				acceptProjectInvitation: (invitationId) =>
					CREATE(
						`/project/${encodeURIComponent(
							parseInvitationId(invitationId).projectId ?? 'null',
						)}/invitation`,
						{},
					).ok(() => {
						refreshProjects()
					}),
				addOrganization: (id, name) => {
					const newOrg: Organization = {
						id,
						name,
						persisted: false,
					}
					setOrganizations((organizations) => [...organizations, newOrg])

					CREATE(`/organizations`, { id, name }).ok(() => {
						setOrganizations((organizations) => [
							...organizations.filter(({ id: orgId }) => orgId !== id),
							{
								id,
								name,
							},
						])
					})

					return { success: true }
				},
				invitations,
				updateProject: (project, update) =>
					UPDATE(
						`/project/${encodeURIComponent(project.id)}`,
						update,
						project.version,
					).ok(() => {
						setProjects((projects) => ({
							...projects,
							[project.id]: {
								...(projects[project.id] as Project),
								...update,
								version: project.version + 1,
							},
						}))
					}),
				deleteProject: (project) =>
					DELETE(
						`/project/${encodeURIComponent(project.id)}`,
						project.version,
					).ok(() => {
						setProjects((projects) => {
							delete projects[project.id]
							return { ...projects }
						})
					}),
			}}
		>
			{children}
		</ProjectsContext.Provider>
	)
}

export const useProjects = () => useContext(ProjectsContext)

export const canCreateStatus = (role: Role) =>
	[Role.OWNER, Role.MEMBER].includes(role)
