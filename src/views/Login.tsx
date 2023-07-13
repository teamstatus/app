import cx from 'classnames'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
import { InternalError } from '../context/InternalError.js'
import { type ProblemDetail } from '../context/ProblemDetail.js'
import { LogoHeader } from './LogoHeader.js'
import { ProgressBar } from '../components/ProgressBar.js'

export const Login = () => {
	const { setUser, autoLoginState } = useAuth()
	const [success, setSuccess] = useState<string | undefined>()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<ProblemDetail>()
	const [email, setEmail] = useState('')
	const [pin, setPIN] = useState('')

	const isPINValid = /^[0-9]{8}$/.test(pin)
	const isEmailValid = /.@./.test(email)

	return (
		<>
			<LogoHeader animated />
			<main class="container">
				<div class="row mt-3">
					<section class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<div class="card">
							<div class="card-header">
								<h1>Login</h1>
							</div>
							<div class="card-body">
								{autoLoginState === 'in_progress' && (
									<ProgressBar title="Logging you in ..." />
								)}
								{success !== undefined && (
									<div class="alert alert-success" role="alert">
										{success}
									</div>
								)}
								{error && (
									<div class="alert alert-danger" role="alert">
										An error occured ({error.title})!
									</div>
								)}
								{autoLoginState === 'failed' && (
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
													onInput={(e) =>
														setEmail((e.target as HTMLInputElement).value)
													}
													value={email}
													placeholder='e.g. "alex@example.com"'
													autoComplete="email"
													pattern=".+@.+"
													aria-describedby="emailHelpBlock"
												/>
											</div>
											<div class="ms-3">
												<button
													type="button"
													class={cx('btn text-nowrap', {
														'btn-outline-primary': isEmailValid,
														'btn-outline-secondary': !isEmailValid,
													})}
													disabled={!isEmailValid || loading}
													onClick={() => {
														setLoading(true)
														setSuccess(undefined)
														setError(undefined)
														setPIN('')
														fetch(`${API_ENDPOINT}/login/email`, {
															method: 'POST',
															body: JSON.stringify({ email }),
															headers: {
																'Content-Type':
																	'application/json; charset=utf-8',
																Accept: 'application/json; charset=utf-8',
															},
															mode: 'cors',
															credentials: 'include',
														})
															.then(async (res) => {
																if (res.ok) {
																	setSuccess(
																		'Please check your mailbox for a mail from notification@teamstatus.space.',
																	)
																} else {
																	setError(await res.json())
																}
															})
															.catch((error) => {
																console.error(error)
																setError(InternalError(error.message))
															})
															.finally(() => {
																setLoading(false)
															})
													}}
												>
													Request PIN
												</button>
											</div>
										</div>
										<div>
											<div id="emailHelpBlock" class="form-text">
												If you are a new user, you can <strong>sign up</strong>{' '}
												using you email.
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
													onInput={(e) =>
														setPIN((e.target as HTMLInputElement).value)
													}
													value={pin}
													placeholder='e.g. "12345678"'
													maxLength={8}
													minLength={8}
													aria-describedby="pinHelpBlock"
												/>
											</div>
											<div class="ms-3">
												<button
													type="submit"
													disabled={!isPINValid || loading}
													class={cx('btn text-nowrap', {
														'btn-primary': isPINValid,
														'btn-secondary': !isPINValid,
													})}
													onClick={() => {
														setLoading(true)
														setError(undefined)
														setSuccess(undefined)
														fetch(`${API_ENDPOINT}/login/email/pin`, {
															method: 'POST',
															body: JSON.stringify({ email, pin }),
															headers: {
																'Content-Type':
																	'application/json; charset=utf-8',
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
																	setError(await res.json())
																}
															})
															.catch((error) => {
																console.error(error)
																setError(InternalError(error.message))
															})

															.finally(() => {
																setLoading(false)
															})
													}}
												>
													Sign in
												</button>
											</div>
										</div>
										<div>
											<div id="pinHelpBlock" class="form-text">
												You will receive a PIN within a minute or two after you
												have requested it above.
											</div>
										</div>
									</form>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
		</>
	)
}

const noop = (e: Event) => {
	e.preventDefault()
	return false
}
