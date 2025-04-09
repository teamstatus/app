import cx from 'classnames'
import { useEffect, useState } from 'preact/hooks'
import { AddIcon, DeleteIcon } from '#components/Icons.tsx'
import type { ProblemDetail } from '#context/ProblemDetail.tsx'
import { Role, useProjects, type Project } from '#context/Projects.tsx'
import { isUserId, slugPart } from '#proto/ids.ts'
import { ProjectHeader } from '#components/ProjectHeader.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { ProgressBar } from '#components/ProgressBar.tsx'
import { Main } from '#components/Main.tsx'
import { WithProject } from '#components/WithProject.tsx'
import { useAuth } from '#context/Auth'
import { RolePill } from '#components/RolePill'
import { FormContainer } from '#components/FormContainer'

export const InviteToProject = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => (
	<WithProject id={id}>
		{({ project }) => {
			const { user } = useAuth()
			const { inviteToProject } = useProjects()
			const [invitee, setInvitee] = useState<string>('')
			const [role, setRole] = useState<Role>(Role.MEMBER)
			const [error, setError] = useState<ProblemDetail | undefined>()
			const [inviting, setInviting] = useState(false)
			const [success, setSuccess] = useState<string>()

			const userId = `@${invitee}`
			const isValid =
				userId !== user?.id &&
				isUserId(userId) &&
				[Role.OWNER, Role.MEMBER, Role.WATCHER].includes(role)

			return (
				<>
					<ProjectHeader project={project} />
					<Main class="container mt-3">
						<div class="col-12 col-lg-8 offset-lg-2 mt-sm-4">
							<FormContainer header={<h1>Invite a member</h1>}>
								{success !== undefined && (
									<div class="alert alert-success" role="alert">
										{success}
									</div>
								)}
								{error !== undefined && (
									<div class="alert alert-danger" role="alert">
										An error occured ({error.title})!
									</div>
								)}
								{inviting && <ProgressBar title={`Inviting ${userId} ...`} />}
								<div class="mb-3 ">
									<label for="idInput" class="form-label">
										ID
									</label>
									<div class="input-group">
										<span class="input-group-text">@</span>
										<input
											type="text"
											class="form-control"
											id="idInput"
											onInput={(e) =>
												setInvitee((e.target as HTMLInputElement).value)
											}
											value={invitee}
											placeholder='e.g. "alex"'
											pattern={`^${slugPart}$`}
											required
										/>
									</div>
									<div class="form-text">(required)</div>
								</div>
								<div class="mb-3">
									<span class="form-label">Role</span>
									{[
										{
											role: Role.OWNER,
											description:
												'Owner: has full permission, may invite other users',
										},
										{
											role: Role.MEMBER,
											description: 'Member: can create status',
										},
										{
											role: Role.WATCHER,
											description:
												'Watcher: can read status, and create reactions',
										},
									].map(({ role: r, description }) => (
										<div key={r} class="form-check">
											<input
												class="form-check-input"
												type="radio"
												name={r}
												id={r}
												onInput={() => setRole(r)}
												checked={role === r}
											/>
											<label class="form-check-label" for={r}>
												{description}
											</label>
										</div>
									))}
									<div class="form-text">(required)</div>
								</div>
								<div class="d-flex align-items-center justify-content-end">
									<button
										type="button"
										class={cx('btn', {
											'btn-primary': isValid,
											'btn-secondary': !isValid,
										})}
										disabled={!isValid}
										onClick={() => {
											setInviting(true)
											setSuccess(undefined)
											inviteToProject(id, userId, role)
												.fail(setError)
												.ok(() => {
													setSuccess(`${userId} invited successfully.`)
													setInvitee('')
												})
												.anyway(() => {
													setInviting(false)
												})
										}}
									>
										<AddIcon />
									</button>
								</div>
							</FormContainer>
							<Members project={project} />
						</div>
					</Main>
					<ProjectMenu />
				</>
			)
		}}
	</WithProject>
)

type ProjectMember = {
	id: string // e.g. "$teamstatus#feedback:@coderbyheart"
	project: string // e.g. "$teamstatus#feedback",
	role: Role // e.g. "owner",
	user: string // e.g. "@coderbyheart"
}

const Members = ({ project }: { project: Project }) => {
	const { listMembers } = useProjects()
	const [members, setMembers] = useState<ProjectMember[]>([])

	useEffect(() => {
		listMembers(project).ok(({ members }) => {
			setMembers(members as ProjectMember[])
		})
	}, [project, listMembers])

	if (members.length === 0) return null

	return (
		<section class="mt-4">
			<h2>Members</h2>
			{members.map((member) => (
				<div
					key={member.id}
					class="d-flex align-items-center justify-content-between mb-2"
				>
					<div class={'me-2'}>
						{member.user}
						<RolePill role={member.role} class="ms-1" />
					</div>
					<button
						type="button"
						class="btn btn-outline-primary btn-sm"
						disabled={true}
					>
						<DeleteIcon />
					</button>
				</div>
			))}
		</section>
	)
}
