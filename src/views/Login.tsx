import cx from 'classnames'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
export const Login = () => {
	const { setUser } = useAuth()
	const [success, setSuccess] = useState<string | undefined>()
	const [error, setError] = useState<Error>()
	const [email, setEmail] = useState('')
	const [pin, setPIN] = useState('')

	const isPINValid = /^[0-9]{8}$/.test(pin)
	const isEmailValid = /.@./.test(email)

	return (
		<main class="container">
			<section>
				<div class="row">
					<div class="col-12">
						<h1 class="fw-light">Login</h1>
					</div>
				</div>
				{success !== undefined && (
					<div class="alert alert-success" role="alert">
						{success}
					</div>
				)}
				{error && (
					<div class="alert alert-danger" role="alert">
						An error occured ({error.message})!
					</div>
				)}
				<form onSubmit={noop}>
					<div class="d-flex d-flex align-items-end justify-content-between ">
						<div class="flex-grow-1">
							<label for="emailInput" class="form-label">
								Email
							</label>
							<input
								type="email"
								class="form-control"
								id="emailInput"
								onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
								value={email}
								placeholder='e.g. "alex@example.com"'
								autoComplete="email"
								pattern=".+@.+"
							/>
						</div>
						<div class="ms-3">
							<button
								type="button"
								class={cx('btn', {
									'btn-outline-primary': isEmailValid,
									'btn-outline-secondary': !isEmailValid,
								})}
								disabled={!isEmailValid}
								onClick={() => {
									fetch(`${API_ENDPOINT}/login/email`, {
										method: 'POST',
										body: JSON.stringify({ email }),
										headers: {
											'Content-Type': 'application/json; charset=utf-8',
											Accept: 'application/json; charset=utf-8',
										},
										mode: 'cors',
										credentials: 'include',
									})
										.then(async (res) => {
											if (res.ok) {
												setSuccess('Please check your mailbox.')
											} else {
												console.error(await res.json())
											}
										})
										.catch((error) => {
											console.error(error)
											setError(error)
										})
								}}
							>
								Confirm email
							</button>
						</div>
					</div>
					<div class="mt-3 d-flex d-flex align-items-end justify-content-between ">
						<div class="flex-grow-1">
							<label for="pinInput" class="form-label">
								PIN
							</label>
							<input
								type="text"
								class="form-control"
								id="pinInput"
								onInput={(e) => setPIN((e.target as HTMLInputElement).value)}
								value={pin}
								placeholder='e.g. "12345678"'
								maxLength={8}
								minLength={8}
							/>
						</div>
						<div class="ms-3">
							<button
								type="submit"
								disabled={!isPINValid}
								class={cx('btn', {
									'btn-primary': isPINValid,
									'btn-secondary': !isPINValid,
								})}
								onClick={() => {
									fetch(`${API_ENDPOINT}/login/email/pin`, {
										method: 'POST',
										body: JSON.stringify({ email, pin }),
										headers: {
											'Content-Type': 'application/json; charset=utf-8',
											Accept: 'application/json; charset=utf-8',
										},
										mode: 'cors',
										credentials: 'include',
									})
										.then(async (res) => {
											if (res.ok) {
												setSuccess('Logged in.')
												setPIN('')
												return fetch(`${API_ENDPOINT}/me`, {
													headers: {
														Accept: 'application/json; charset=utf-8',
													},
													mode: 'cors',
													credentials: 'include',
												})
													.then(async (res) => res.json())
													.then((user) => {
														setUser(user)
													})
											} else {
												console.error(await res.json())
											}
										})
										.catch((error) => {
											console.error(error)
											setError(error)
										})
								}}
							>
								Sign in
							</button>
						</div>
					</div>
				</form>
			</section>
		</main>
	)
}

const noop = (e: Event) => {
	e.preventDefault()
	return false
}
