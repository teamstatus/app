import { ReactionRole, type Reaction as TReaction } from '#context/Status.js'
import { useState } from 'preact/hooks'
import { IconPicker } from './IconPicker.js'
import { CloseIcon, QuestionIcon, SignificantIcon } from './Icons.js'
import { Reaction } from './Reactions.js'
import { FormContainer } from './FormContainer.js'

export const CustomReaction = ({
	onReaction,
	onClose,
}: {
	onReaction: (reaction: TReaction) => unknown
	onClose: () => unknown
}) => {
	const [icon, setIcon] = useState<string>('❔')
	const [description, setDescription] = useState<string>('')
	const [role, setRole] = useState<ReactionRole | undefined>()

	const reaction: TReaction = {
		emoji: icon,
		role,
	}

	return (
		<FormContainer
			header={
				<header class="d-flex justify-content-between">
					<h2 class="fs-5">Custom Reaction</h2>
					<button
						type="button"
						class="btn btn-outline-secondary btn-sm"
						onClick={onClose}
					>
						<CloseIcon />
					</button>
				</header>
			}
		>
			<div>
				<Reaction
					reaction={reaction}
					onClick={() => {
						onReaction(reaction)
					}}
				/>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					return false
				}}
			>
				<div class="mt-2 mb-2">
					<IconPicker
						onIcon={(icon) => {
							setIcon(icon)
						}}
					/>
				</div>
				<div class="mb-2">
					<label for="descriptionInput" class="form-label">
						Name
					</label>
					<input
						type="text"
						class="form-control"
						id="descriptionInput"
						onInput={(e) =>
							setDescription((e.target as HTMLInputElement).value)
						}
						value={description}
						placeholder='e.g. "Amazing work!"'
					/>
				</div>
				<div>
					<label class="form-label">Role</label>
				</div>
				<div
					class="btn-group"
					role="group"
					aria-label="Basic radio toggle button group"
				>
					<input
						type="radio"
						class="btn-check"
						name="role"
						id="noRole"
						autocomplete="off"
						checked={role === undefined}
						onClick={() => setRole(undefined)}
					/>
					<label class="btn btn-outline-primary" for="noRole">
						None
					</label>
					<input
						type="radio"
						class="btn-check"
						name="role"
						id="questionRole"
						autocomplete="off"
						checked={role === ReactionRole.QUESTION}
						onClick={() => setRole(ReactionRole.QUESTION)}
					/>
					<label class="btn btn-outline-primary" for="questionRole">
						<QuestionIcon strokeWidth={2} /> Question
					</label>
					<input
						type="radio"
						class="btn-check"
						name="role"
						id="significantRole"
						autocomplete="off"
						checked={role === ReactionRole.SIGNIFICANT}
						onClick={() => setRole(ReactionRole.SIGNIFICANT)}
					/>
					<label class="btn btn-outline-primary" for="significantRole">
						<SignificantIcon strokeWidth={2} /> Significant
					</label>
				</div>
			</form>
		</FormContainer>
	)
}
