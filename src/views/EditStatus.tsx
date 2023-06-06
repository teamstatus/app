import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { BackIcon, SubmitIcon } from '../components/Icons.js'
import { ProjectHeader } from '../components/ProjectHeader.js'
import { useProjects } from '../context/Projects.js'
import { useStatus, type Status } from '../context/Status.js'

export const EditStatus = ({
	id,
}: {
	id: string // e.g. '01H1XVCVQXR8619Z4NVVCFD20F'
}) => {
	const { statusById } = useStatus()
	const { projects } = useProjects()

	const status = statusById(id)

	if (status === undefined) {
		return (
			<main class="container">
				<div class="alert alert-danger" role="alert">
					Status not found: {id}
				</div>
			</main>
		)
	}

	const project = projects[status.project]

	if (project === undefined) {
		return (
			<main class="container">
				<div class="alert alert-danger" role="alert">
					Project not found: {status.project}
				</div>
			</main>
		)
	}

	return (
		<>
			<ProjectHeader project={project} />
			<EditStatusForm status={status} />
		</>
	)
}

const EditStatusForm = ({ status }: { status: Status }) => {
	const { updateStatus } = useStatus()
	const [message, setMessage] = useState<string>(status.message)
	const [error, setError] = useState<string | undefined>()
	const isValid = message.length > 0
	return (
		<main class="container">
			<div class="card col-md-6 offset-md-3 mt-3">
				<div class="card-header">
					<h1>Edit status</h1>
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
						href={`/project/${encodeURIComponent(status.project)}`}
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
							const res = updateStatus(status, message)
							if ('error' in res) {
								setError(res.error)
							} else {
								route(
									`/project/${encodeURIComponent(
										status.project,
									)}?${new URLSearchParams({
										updatedStatus: status.id,
										version: res.version.toString(),
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
	)
}
