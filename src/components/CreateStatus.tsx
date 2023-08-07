import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AddIcon } from '#components/Icons.js'
import type { Project } from '#context/Projects.js'
import { useStatus, type Status } from '#context/Status.js'
import { useAuth } from '#context/Auth.js'

export const CreateStatus = ({
	onStatus,
	project,
}: {
	onStatus: (status: Status) => void
	project: Project
}) => {
	const { user } = useAuth()
	const [message, setMessage] = useState<string>('')
	const isValid = message.length > 0
	const [error, setError] = useState<string | undefined>()
	const { addProjectStatus } = useStatus()
	if (user?.id === undefined) return null
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				return false
			}}
		>
			{error !== undefined && (
				<div class="alert alert-danger" role="alert">
					An error occured ({error})!
				</div>
			)}
			<div class="mb-3">
				<label for="statusUpdate" class="form-label">
					Describe your status update
				</label>
				<textarea
					class="form-control"
					id="statusUpdate"
					rows={3}
					placeholder='e.g. "Implemented the validation for the UI"'
					minLength={1}
					value={message}
					onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
					autoFocus
				></textarea>
				<div class="form-text">Markdown is supported.</div>
			</div>
			<div class="d-flex align-items-center justify-content-end">
				<button
					class={cx('btn', {
						'btn-primary': isValid,
						'btn-secondary': !isValid,
					})}
					disabled={!isValid}
					onClick={() => {
						const res = addProjectStatus(project.id, message)
						if ('error' in res) {
							setError(res.error)
						} else {
							onStatus({
								author: user.id as string,
								id: res.id,
								message,
								project: project.id,
								reactions: [],
								version: 1,
							})
						}
					}}
				>
					<AddIcon />
				</button>
			</div>
		</form>
	)
}
