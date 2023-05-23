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
						<h1>Login</h1>
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
					<div class="row g-3">
						<div class="col-8">
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
								pattern="/.+@.+/"
							/>
						</div>
						<div class="col-4">
							<button
								type="button"
								class="btn btn-primary"
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
					<div class="col-12">
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
					<div class="col-12">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={!isPINValid}
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
				</form>
			</section>
		</main>
	)
}

const noop = (e: Event) => {
	e.preventDefault()
	return false
}
