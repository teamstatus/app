import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { BackIcon, SubmitIcon } from '#components/Icons.js'
import { useProjects } from '#context/Projects.js'
import { isOrganizationId, slugPart } from '#proto/ids.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'

export const CreateOrganization = () => {
	const [name, setName] = useState<string>('')
	const { addOrganization } = useProjects()
	const [error, setError] = useState<string | undefined>()
	const [id, setId] = useState('')

	const orgId = `$${id}`
	const isValid = isOrganizationId(orgId)
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-4">
					<section>
						<h1>Create a new organization</h1>
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<div class="mb-3 ">
							<label for="idInput" class="form-label">
								ID
							</label>
							<div class="input-group">
								<span class="input-group-text">$</span>
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
						<div class="d-flex align-items-center justify-content-between">
							<a href={`/projects`} class="btn btn-outline-danger">
								<BackIcon />
							</a>
							<button
								class={cx('btn', {
									'btn-primary': isValid,
									'btn-secondary': !isValid,
								})}
								disabled={!isValid}
								onClick={() => {
									const res = addOrganization(
										orgId,
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
					</section>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
