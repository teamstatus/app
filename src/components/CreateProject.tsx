import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AddIcon } from '#components/Icons.js'
import {
	useProjects,
	type Organization,
	type Project,
	Role,
} from '#context/Projects.js'
import { isProjectId, slugPart } from '#proto/ids.js'

export const CreateProject = ({
	organization,
	onProject,
}: {
	organization?: Organization
	onProject: (project: Project) => void
}) => {
	const [name, setName] = useState<string>('')
	const { addProject, organizations, projects } = useProjects()
	const [organizationId, setOrganization] = useState<string>(
		organizations[0]?.id ?? organization?.id ?? '',
	)
	const [error, setError] = useState<string | undefined>()
	const [id, setId] = useState('')

	const projectId = `${organizationId}#${id}`
	const isValid = isProjectId(projectId) && projects[projectId] === undefined
	return (
		<>
			{error !== undefined && (
				<div class="alert alert-danger" role="alert">
					An error occured ({error})!
				</div>
			)}
			{organization === undefined && (
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
			)}
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
			<div class="d-flex align-items-center justify-content-end">
				<button
					type="button"
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
							onProject({
								id: projectId,
								name: name.length > 0 ? name : undefined,
								organizationId,
								version: 1,
								role: Role.OWNER,
							})
						}
					}}
				>
					<AddIcon />
				</button>
			</div>
		</>
	)
}
