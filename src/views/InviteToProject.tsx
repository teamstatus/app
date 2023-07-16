import cx from 'classnames'
import { useState } from 'preact/hooks'
import { BackIcon, SubmitIcon } from '../components/Icons.js'
import { type ProblemDetail } from '../context/ProblemDetail.js'
import { Role, useProjects } from '../context/Projects.js'
import { isUserId, slugPart } from '../proto/ids.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { ProgressBar } from '../components/ProgressBar.js'

export const InviteToProject = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => {
	const { inviteToProject, projects } = useProjects()
	const [invitee, setInvitee] = useState<string>('')
	const [role, setRole] = useState<Role>(Role.MEMBER)
	const [error, setError] = useState<ProblemDetail | undefined>()
	const [inviting, setInviting] = useState(false)
	const [success, setSuccess] = useState<string>()

	const userId = `@${invitee}`
	const isValid =
		isUserId(userId) && [Role.OWNER, Role.MEMBER, Role.WATCHER].includes(role)
	const project = projects[id]

	return (
		<>
			{project !== undefined && <ProjectHeader project={project} />}
			<main class="container">
				<div class="card col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4">
					<div class="card-header">
						<h1>Invite a member</h1>
					</div>
					<div class="card-body">
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
							<label class="form-label">Role</label>
							{[
								{
									role: Role.OWNER,
									description:
										'Owner: has full permission, may invite other users',
								},
								{ role: Role.MEMBER, description: 'Member: can create status' },
								{
									role: Role.WATCHER,
									description: 'Watcher: can read status, and create reactions',
								},
							].map(({ role: r, description }) => (
								<div class="form-check">
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
					</div>
					<div class="card-footer d-flex align-items-center justify-content-between">
						<a href={`/projects/`} class="btn btn-outline-danger">
							<BackIcon />
						</a>
						<button
							class={cx('btn', {
								'btn-primary': isValid,
								'btn-secondary': !isValid,
							})}
							disabled={!isValid}
							onClick={() => {
								setInviting(true)
								setSuccess(undefined)
								inviteToProject(id, userId, role)
									.then((res) => {
										setInviting(false)
										if ('error' in res) {
											setError(res.error)
										} else {
											setSuccess(`${userId} invited successfully.`)
											setInvitee('')
										}
									})
									.catch(setError)
							}}
						>
							<SubmitIcon />
						</button>
					</div>
				</div>
			</main>
			<ProjectMenu />
		</>
	)
}
