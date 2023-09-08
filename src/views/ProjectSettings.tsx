import cx from 'classnames'
import { useState } from 'preact/hooks'
import { UpdateIcon } from '#components/Icons.js'
import { type ProblemDetail } from '#context/ProblemDetail.js'
import { useProjects } from '#context/Projects.js'
import { ProjectHeader } from '#components/ProjectHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { ProgressBar } from '#components/ProgressBar.js'
import { Main } from '#components/Main.js'
import { WithProject } from '#components/WithProject.js'

export const ProjectSettings = ({
	id,
}: {
	id: string // e.g. '$teamstatus#development'
}) => (
	<WithProject id={id}>
		{({ project }) => {
			const { updateProject } = useProjects()
			const [name, setName] = useState<string>(project?.name ?? '')
			const [error, setError] = useState<ProblemDetail | undefined>()
			const [inviting, setUpdating] = useState(false)
			const [success, setSuccess] = useState<string>()

			const isValid = name.length > 0

			return (
				<>
					<ProjectHeader project={project} />
					<Main class="container mt-3">
						<div class="col-12 col-lg-8 offset-lg-2 mt-sm-4">
							<section>
								<h1>Update {project.id}</h1>
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
								{inviting && (
									<ProgressBar title={`Updating ${project.id} ...`} />
								)}
								<div class="mb-3 ">
									<label for="nameInput" class="form-label">
										Name
									</label>
									<input
										type="text"
										class="form-control"
										id="nameInput"
										onInput={(e) =>
											setName((e.target as HTMLInputElement).value)
										}
										value={name}
										placeholder='e.g. "ACME Inc."'
										minLength={1}
										required
									/>
									<div class="form-text">(required)</div>
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
											setUpdating(true)
											setSuccess(undefined)
											updateProject(project, { name })
												.fail(setError)
												.ok(() => {
													setSuccess(`${project.id} updated successfully.`)
												})
												.anyway(() => {
													setUpdating(false)
												})
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
		}}
	</WithProject>
)
