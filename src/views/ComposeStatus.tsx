import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { BackIcon, SubmitIcon } from '../components/Icons.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { useProjects } from '../context/Projects.js'
import { useStatus } from '../context/Status.js'

export const ComposeStatus = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => {
	const [message, setMessage] = useState<string>('')
	const { projects } = useProjects()
	const { addProjectStatus } = useStatus()
	const [error, setError] = useState<string | undefined>()

	const project = projects[id]
	if (project === undefined) {
		return (
			<main class="container">
				<div class="alert alert-danger" role="alert">
					Project not found: {id}
				</div>
			</main>
		)
	}

	const isValid = message.length > 0
	return (
		<>
			<ProjectHeader project={project} />
			<main class="container">
				<div class="card col-md-6 offset-md-3 mt-3">
					<div class="card-header">
						<h1>Compose a new status</h1>
					</div>
					<div class="card-body">
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
								onInput={(e) =>
									setMessage((e.target as HTMLTextAreaElement).value)
								}
								autoFocus
							></textarea>
							<div class="form-text">Markdown is supported.</div>
						</div>
					</div>
					<div class="card-footer d-flex align-items-center justify-content-between">
						<a
							href={`/project/${encodeURIComponent(id)}`}
							class="btn btn-outline-danger"
						>
							<BackIcon />
						</a>
						<button
							class={cx('btn', {
								'btn-primary': isValid,
								'btn-secondary': !isValid,
							})}
							disabled={!isValid}
							onClick={() => {
								const res = addProjectStatus(id, message)
								if ('error' in res) {
									setError(res.error)
								} else {
									route(
										`/project/${encodeURIComponent(id)}?${new URLSearchParams({
											newStatus: res.id,
										}).toString()}`,
									)
								}
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
