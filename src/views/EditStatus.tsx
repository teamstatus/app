import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { UpdateIcon } from '#components/Icons.js'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { useStatus, type Status } from '#context/Status.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { WithStatus } from '#components/WithStatus.js'
import { WithProject } from '#components/WithProject.js'

export const EditStatus = ({
	statusId,
	projectId,
}: {
	statusId: string // e.g. '01H1XVCVQXR8619Z4NVVCFD20F'
	projectId: string // e.g. '$acme#project'
}) => (
	<WithProject id={projectId}>
		{({ project }) => (
			<WithStatus id={statusId} project={project}>
				{({ status }) => (
					<>
						<ProjectHeader project={project} />
						<EditStatusForm status={status} />
					</>
				)}
			</WithStatus>
		)}
	</WithProject>
)

const EditStatusForm = ({ status }: { status: Status }) => {
	const { updateStatus } = useStatus()
	const [message, setMessage] = useState<string>(status.message)
	const [error, setError] = useState<string | undefined>()
	const isValid = message.length > 0
	return (
		<>
			<Main class="container">
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-3">
					<section>
						<h1>Edit status</h1>
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
						<div class="d-flex align-items-center justify-content-end">
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
								<UpdateIcon />
							</button>
						</div>
					</section>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
