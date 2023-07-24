import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { useAuth } from '#context/Auth.js'
import { isUserId, slugPart } from '#proto/ids.js'
import { SubmitIcon } from './Icons.js'
import { CREATE } from '#api/client.js'

export const SelectID = () => {
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState<string | undefined>()
	const { setUser, user } = useAuth()
	if (user === undefined) return null
	const userId = `@${id}`
	const isValid = isUserId(userId)
	return (
		<section>
			<h2>Please select a user ID</h2>
			<p>
				All users need a user ID, like <code>@alex</code>. Please select one for
				yourself:
			</p>
			<form>
				<div class="mb-3 ">
					<label for="idInput" class="form-label">
						ID
					</label>
					<div class="input-group">
						<span class="input-group-text">@</span>
						<input
							type="text"
							class="form-control"
							id="idInput"
							onInput={(e) => setId((e.target as HTMLInputElement).value)}
							value={id}
							placeholder='e.g. "alex"'
							pattern={`^${slugPart}$`}
							required
						/>
					</div>

					<div class="form-text">(required)</div>
				</div>
				<div class="mb-3 ">
					<label for="nameInput" class="form-label">
						Your name
					</label>
					<input
						type="text"
						class="form-control"
						id="nameInput"
						onInput={(e) => setName((e.target as HTMLInputElement).value)}
						value={name}
						placeholder='e.g. "Alex Doe"'
					/>
				</div>
			</form>
			{error !== undefined && (
				<div class="alert alert-danger" role="alert">
					An error occured ({error})!
				</div>
			)}
			<div class="d-flex align-items-center justify-content-end">
				<button
					class={cx('btn', {
						'btn-primary': isValid,
						'btn-secondary': !isValid,
					})}
					disabled={!isValid}
					onClick={() => {
						CREATE(`/me/user`, { id: userId, name })
							.ok(() => {
								setUser({
									email: user.email,
									id: userId,
								})
								route(`/projects`)
							})
							.fail((problem) => setError(problem.title))
					}}
				>
					<SubmitIcon />
				</button>
			</div>
		</section>
	)
}
