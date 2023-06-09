import cx from 'classnames'
import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
import { isUserId, slugPart } from '../proto/ids.js'
import { SubmitIcon } from './Icons.js'

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
			<div class="card">
				<div class="card-header">
					<h2>Please select a user ID</h2>
				</div>
				<div class="card-body">
					<p>
						All users need a user ID, like <code>@alex</code>. Please select one
						for yourself:
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
				</div>
				<div class="card-footer d-flex align-items-center justify-content-end">
					<button
						class={cx('btn', {
							'btn-primary': isValid,
							'btn-secondary': !isValid,
						})}
						disabled={!isValid}
						onClick={() => {
							fetch(`${API_ENDPOINT}/me/user`, {
								method: 'PUT',
								headers: {
									Accept: 'application/json; charset=utf-8',
									'Content-Type': 'application/json; charset=utf-8',
								},
								mode: 'cors',
								credentials: 'include',
								body: JSON.stringify({ id: userId, name }),
							})
								.then(() => {
									setUser({
										email: user.email,
										id: userId,
									})
									route(`/projects`)
								})
								.catch((error) => setError(error.message))
						}}
					>
						<SubmitIcon />
					</button>
				</div>
			</div>
		</section>
	)
}
