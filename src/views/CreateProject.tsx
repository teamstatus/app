import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { BackIcon, SubmitIcon } from '../components/Icons.js'
import { useProjects } from '../context/Projects.js'
import { isProjectId, slugPart } from '../proto/ids.js'
import { LogoHeader } from '../components/LogoHeader.js'

export const CreateProject = () => {
	const [name, setName] = useState<string>('')
	const { addProject, organizations } = useProjects()
	const [organizationId, setOrganization] = useState<string>(
		organizations[0]?.id ?? '',
	)
	const [error, setError] = useState<string | undefined>()
	const [id, setId] = useState('')

	const projectId = `${organizationId}#${id}`
	const isValid = isProjectId(projectId)
	return (
		<>
			<LogoHeader />
			<main class="container">
				<div class="card col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4">
					<div class="card-header">
						<h1>Create a new project</h1>
					</div>
					<div class="card-body">
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<div class="mb-3">
							<label for="organization" class="form-label">
								Organization
							</label>
							<select
								class="form-select"
								aria-label="Default select example"
								id="organization"
								value={organizationId}
								onChange={(e) =>
									setOrganization((e.target as HTMLSelectElement).value)
								}
							>
								{organizations.map(({ id, name }) => (
									<option value={id}>
										{name !== undefined ? `${name} (${id})` : id}
									</option>
								))}
							</select>
						</div>
						<div class="mb-3 ">
							<label for="idInput" class="form-label">
								ID
							</label>
							<div class="input-group">
								<span class="input-group-text">#</span>
								<input
									type="text"
									class="form-control"
									id="idInput"
									onInput={(e) => setId((e.target as HTMLInputElement).value)}
									value={id}
									placeholder='e.g. "teamstatus"'
									pattern={`^${slugPart}$`}
									required
								/>
							</div>
							<div class="form-text">(required)</div>
						</div>
						<div class="mb-3">
							<label for="nameInput" class="form-label">
								Name
							</label>
							<input
								type="text"
								class="form-control"
								id="nameInput"
								onInput={(e) => setName((e.target as HTMLInputElement).value)}
								value={name}
								placeholder='e.g. "Teamstatus"'
							/>
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
								const res = addProject(
									projectId,
									name.length > 0 ? name : undefined,
								)
								if ('error' in res) {
									setError(res.error)
								} else {
									route(`/projects`)
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
