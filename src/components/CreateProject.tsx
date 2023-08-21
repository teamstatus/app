import { AddIcon } from '#components/Icons.js'
import { Role, useProjects, type Project } from '#context/Projects.js'
import { isProjectId, slugPart } from '#proto/ids.js'
import cx from 'classnames'
import { useState } from 'preact/hooks'

export const CreateProject = ({
	organizationId,
	onProject,
}: {
	organizationId: string
	onProject: (project: Project) => void
}) => {
	const [name, setName] = useState<string>('')
	const { addProject, projects } = useProjects()
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
