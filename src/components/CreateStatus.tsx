import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AddIcon } from '#components/Icons.js'
import type { Project } from '#context/Projects.js'
import { useStatus } from '#context/Status.js'
import { useAuth } from '#context/Auth.js'
import { ResizingTextarea } from '#components/ResizingTextarea.js'

export const CreateStatus = ({
	onStatus,
	project,
}: {
	onStatus: (id: string) => void
	project: Project
}) => {
	const { user } = useAuth()
	const [message, setMessage] = useState<string>('')
	const isValid = message.length > 0
	const [error, setError] = useState<string | undefined>()
	const { addProjectStatus } = useStatus()
	if (user === undefined) return null
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
				<ResizingTextarea
					value={message}
					id="statusUpdate"
					placeholder='e.g. "Implemented the validation for the UI"'
					onInput={setMessage}
				/>
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
						const res = addProjectStatus(project.id, message)
						if ('error' in res) {
							setError(res.error)
						} else {
							onStatus(res.id)
						}
					}}
				>
					<AddIcon />
				</button>
			</div>
		</form>
	)
}
