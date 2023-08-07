import cx from 'classnames'
import { useState } from 'preact/hooks'
import { AddIcon } from '#components/Icons.js'
import { useProjects, type Organization } from '#context/Projects.js'
import { isOrganizationId, slugPart } from '#proto/ids.js'

export const CreateOrganization = ({
	onOrganization,
}: {
	onOrganization?: (organization: Organization) => unknown
}) => {
	const [name, setName] = useState<string>('')
	const { addOrganization } = useProjects()
	const [error, setError] = useState<string | undefined>()
	const [id, setId] = useState('')

	const orgId = `$${id}`
	const isValid = isOrganizationId(orgId)
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
				<div class="form-text">
					The ID is a globally unique identifier for this
					organization.(required)
				</div>
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
							onOrganization?.({
								id: orgId,
								name: name.length > 0 ? name : undefined,
							})
						}
					}}
				>
					<AddIcon />
				</button>
			</div>
		</form>
	)
}
