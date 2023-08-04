import cx from 'classnames'
import { useState } from 'preact/hooks'
import { SubmitIcon } from '#components/Icons.js'

export const ComposeStatusForm = ({
	onMessage,
}: {
	onMessage: (message: string) => unknown
}) => {
	const [message, setMessage] = useState<string>('')
	const isValid = message.length > 0
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				return false
			}}
		>
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
						onMessage(message)
					}}
				>
					<SubmitIcon />
				</button>
			</div>
		</form>
	)
}
