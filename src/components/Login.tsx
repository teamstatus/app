import cx from 'classnames'
import { useState } from 'preact/hooks'
import { useAuth } from '#context/Auth.js'
import { type ProblemDetail } from '#context/ProblemDetail.js'
import { ProgressBar } from './ProgressBar.js'
import { AsHeadline } from './HeadlineFont.js'
import { FormContainer } from './FormContainer.js'

export const Login = ({ redirect }: { redirect?: string }) => {
	const { autoLoginState, loginRequest, pinLogin, loggedIn } = useAuth()
	const [success, setSuccess] = useState<string | undefined>()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<ProblemDetail>()
	const [email, setEmail] = useState('')
	const [pin, setPIN] = useState('')

	const isPINValid = /^[0-9]{8}$/.test(pin)
	const isEmailValid = /.@./.test(email)

	if (loggedIn) return null

	return (
		<>
			{redirect !== undefined && (
				<div class="alert alert-warning" role="alert">
					Hei, you first need to log in in order to access{' '}
					<AsHeadline>teamstatus.space</AsHeadline>
					.<br />
					If you don't have an account yet, just use your email to request a
					login token.
				</div>
			)}
			<FormContainer header={<h1>Login</h1>}>
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
					<>
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
										loginRequest(email)
											.ok(() => {
												setSuccess(
													'Please check your mailbox for a mail from notification@teamstatus.space.',
												)
											})
											.fail((problem) => {
												setError(problem)
											})
											.anyway(() => {
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
								If you are a new user, you can <strong>sign up</strong> using
								your email.
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
										pinLogin(email, pin)
											.ok((user) => {
												setSuccess('Logged in.')
												setPIN('')
											})
											.fail((problem) => {
												console.error(error)
												setError(problem)
											})
											.anyway(() => {
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
								You will receive a PIN within a minute or two after you have
								requested it above.
							</div>
						</div>
					</>
				)}
			</FormContainer>
		</>
	)
}
