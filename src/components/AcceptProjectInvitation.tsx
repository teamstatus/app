import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { type ProblemDetail } from '#context/ProblemDetail.js'
import { useProjects } from '#context/Projects.js'
import { isInvitationId, slugPart } from '#proto/ids.js'
import { SubmitIcon } from './Icons.js'

export const AcceptProjectInvitation = () => {
	const [invitationId, setInvitationId] = useState('')
	const [error, setError] = useState<ProblemDetail | undefined>()
	const isValid = isInvitationId(invitationId)
	const { acceptProjectInvitation } = useProjects()
	return (
		<section>
			<h1>Accept project invitation</h1>
			{error !== undefined && (
				<div class="alert alert-danger" role="alert">
					An error occured ({error.title})!
				</div>
			)}
			<div class="mb-3 ">
				<label for="invitationIdInput" class="form-label">
					Invitation ID
				</label>
				<input
					type="text"
					class="form-control"
					id="invitationIdInput"
					onInput={(e) => setInvitationId((e.target as HTMLInputElement).value)}
					value={invitationId}
					placeholder={`e.g. "$team#project@userid"`}
					pattern={`^${slugPart}$`}
					required
				/>
				<div class="form-text">(required)</div>
			</div>
			<div class="d-flex align-items-center justify-content-end">
				<button
					class={cx('btn', {
						'btn-primary': isValid,
						'btn-secondary': !isValid,
					})}
					disabled={!isValid}
					onClick={() => {
						acceptProjectInvitation(invitationId)
							.ok(() => {
								route(`/projects?accepted=${encodeURIComponent(invitationId)}`)
							})
							.fail((problem) => {
								setError(problem)
							})
					}}
				>
					<SubmitIcon />
				</button>
			</div>
		</section>
	)
}
