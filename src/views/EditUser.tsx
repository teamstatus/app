import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { useState } from 'preact/hooks'
import { UpdateIcon } from '#components/Icons.js'
import cx from 'classnames'
import { route } from 'preact-router'
import type { ProblemDetail } from '#context/ProblemDetail.js'
import { useAuth, type UserContext } from '#context/Auth.js'

export const EditUser = () => {
	const { user } = useAuth()

	if (user === undefined) return null

	return <EditUserProfile user={user} />
}

const EditUserProfile = ({ user }: { user: UserContext }) => {
	const { update } = useAuth()
	const [edited, setEdited] = useState<{ name: string; pronouns?: string }>({
		name: user.name ?? '',
		pronouns: user.pronouns,
	})
	const [error, setError] = useState<ProblemDetail>()
	const isValid = edited.name.length > 0
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<section>
							<h1>Edit your details</h1>
							{error !== undefined && (
								<div class="alert alert-danger" role="alert">
									An error occured ({error.title})!
								</div>
							)}
							<div class="mb-3">
								<label for="email" class="form-label">
									Your email
								</label>
								<input
									type="email"
									class="form-control"
									id="email"
									placeholder='e.g. "alex@example.com"'
									minLength={1}
									required
									value={user.email ?? ''}
									disabled
								/>
							</div>
							<div class="mb-3">
								<label for="username" class="form-label">
									Your username
								</label>
								<input
									type="text"
									class="form-control"
									id="username"
									placeholder='e.g. "@alex"'
									minLength={1}
									required
									value={user.id ?? ''}
									disabled
								/>
							</div>
							<div class="mb-3">
								<label for="name" class="form-label">
									Your name
								</label>
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder='e.g. "Alex Doe"'
									minLength={1}
									required
									value={edited.name}
									onInput={(e) => {
										setEdited((profile) => {
											if (profile === undefined) return profile
											return {
												...profile,
												name: (e.target as HTMLTextAreaElement).value,
											}
										})
									}}
								/>
							</div>
							<div class="mb-3">
								<label for="pronouns" class="form-label">
									Your pronouns
								</label>
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder='e.g. "they/them"'
									value={edited.pronouns ?? ''}
									onInput={(e) => {
										const v = (e.target as HTMLTextAreaElement).value
										setEdited((profile) => ({
											...profile,
											pronouns: v.length > 0 ? v : undefined,
										}))
									}}
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
										update({
											name: edited.name,
											pronouns: edited.pronouns,
										})
											.ok(() => {
												route(`/user`)
											})
											.fail(setError)
									}}
								>
									<UpdateIcon />
								</button>
							</div>
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
