import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AddIcon } from '#components/Icons.js'
import type { Project } from '#context/Projects.js'
import { useStatus } from '#context/Status.js'
import { useAuth } from '#context/Auth.js'
import { ResizingTextarea } from '#components/ResizingTextarea.js'
import { slugPart } from '#proto/ids'

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
	const [attributeTo, setAttributeTo] = useState<string>('')
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
			<div>
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
			<div class="mb-3">
				<label for="attributeTo" class="form-label">
					Attribute this status to someone else
				</label>
				<input
					type="text"
					class="form-control"
					id="attributeTo"
					onInput={(e) => setAttributeTo((e.target as HTMLInputElement).value)}
					value={attributeTo}
					placeholder='e.g. "blake"'
					pattern={`^${slugPart}$`}
					required
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
						const res = addProjectStatus(
							project.id,
							message,
							attributeTo.length > 0 ? attributeTo : undefined,
						)
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
