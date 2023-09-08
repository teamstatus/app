import cx from 'classnames'
import { useState } from 'preact/hooks'
import { useAuth } from '#context/Auth.js'
import { isUserId, slugPart } from '#proto/ids.js'
import { InFlightIcon, UpdateIcon } from './Icons.js'
import { Aside } from './Aside.js'
import { FormContainer } from './FormContainer.js'
import { AsHeadline } from './HeadlineFont.js'

export const PickID = () => {
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [pronouns, setPronouns] = useState('')
	const [error, setError] = useState<string | undefined>()
	const { selectID } = useAuth()
	const userId = `@${id}`
	const isValid = isUserId(userId)
	const [submitting, setSubmitting] = useState<boolean>(false)
	return (
		<Aside class="container">
			<div class="row mt-sm-4">
				<div class="col-12 col-lg-8 offset-lg-2">
					<FormContainer header={<h2>Pick a user ID</h2>}>
						<p>
							In <AsHeadline>teamstatus.space</AsHeadline>, all users need are
							identified using an ID, like <code>@alex</code>. Please pick one
							for yourself:
						</p>
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
						<p>
							Optionally you can provide your name and your pronouns to make it
							easier for others to identify you:
						</p>
						<div class="mb-3 ">
							<label for="nameInput" class="form-label">
								Name
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
						<div class="mb-3 ">
							<label for="pronounsInput" class="form-label">
								Pronouns
							</label>
							<input
								type="text"
								class="form-control"
								id="pronounsInput"
								onInput={(e) =>
									setPronouns((e.target as HTMLInputElement).value)
								}
								value={pronouns}
								placeholder='e.g. "they/them"'
							/>
						</div>
						{error !== undefined && (
							<div class="alert alert-danger" role="alert">
								An error occured ({error})!
							</div>
						)}
						<div class="d-flex align-items-center justify-content-end">
							<button
								type="button"
								class={cx('btn', {
									'btn-primary': isValid,
									'btn-secondary': !isValid,
								})}
								disabled={!isValid || submitting}
								onClick={() => {
									setSubmitting(true)
									selectID({
										id: userId,
										pronouns: pronouns.length > 0 ? pronouns : undefined,
										name: name.length > 0 ? name : undefined,
									})
										.fail((problem) => setError(problem.title))
										.anyway(() => {
											setSubmitting(false)
										})
								}}
							>
								{submitting ? <InFlightIcon /> : <UpdateIcon />}
							</button>
						</div>
					</FormContainer>
				</div>
			</div>
		</Aside>
	)
}
