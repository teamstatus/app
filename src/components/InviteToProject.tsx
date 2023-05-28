import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { BackIcon, ProjectsIcon, SubmitIcon } from '../components/Icons.js'
import { useProjects } from '../context/Projects.js'
import { isUserId, slugPart } from '../proto/ids.js'

export const InviteToProject = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => {
	const { inviteToProject, projects } = useProjects()
	const [invitee, setInvitee] = useState<string>('')
	const [error, setError] = useState<string | undefined>()

	const userId = `@${invitee}`
	const isValid = isUserId(userId)

	return (
		<>
			<main class="container">
				<div class="card col-md-6 offset-md-3 mt-4">
					<div class="card-header">
						<h1>Invite a member</h1>
						<p>
							<small>
								<ProjectsIcon /> {projects[id]?.id}
							</small>
						</p>
					</div>
					<div class="card-body">
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
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
								inviteToProject(id, userId)
									.then((res) => {
										if ('error' in res) {
											setError(res.error)
										} else {
											route(`/projects`)
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
		</>
	)
}
