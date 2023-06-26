import { useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { useAuth } from '../context/Auth.js'
import { useStatus, type Status as TStatus } from '../context/Status.js'
import { Ago } from './Ago.js'
import {
	AddReactionIcon,
	CalendarIcon,
	CollapseRightIcon,
	DeleteIcon,
	EditIcon,
	PersistencePendingIcon,
	SubMenuIcon,
	UserIcon,
} from './Icons.js'
import { Markdown } from './Markdown.js'
import { Reaction, SelectReaction } from './Reactions.js'

export const Status = ({ status }: { status: TStatus }) => {
	const [reactionsVisible, showReactions] = useState(false)
	const [operationsVisible, showOperations] = useState(false)
	const { user } = useAuth()
	const userId = user?.id
	const { addReaction, deleteReaction, deleteStatus } = useStatus()
	const canEdit = userId === status.author
	const hasOperations = canEdit
	return (
		<>
			<Markdown markdown={status.message} />
			{!reactionsVisible && (
				<div class="d-flex align-items-center justify-content-between mb-1">
					<small class="text-muted d-flex me-2">
						<span class="text-nowrap me-2 d-flex align-items-center">
							<UserIcon size={20} class="me-1" /> {status.author}
						</span>
						<span class="text-nowrap d-flex align-items-center">
							<CalendarIcon size={20} class="me-1" />{' '}
							<Ago date={new Date(decodeTime(status.id))} />
							{status.version > 1 && (
								<>
									<EditIcon size={20} class={'ms-1'} /> {status.version}
								</>
							)}
						</span>
					</small>
					<div>
						{status.persisted === false && (
							<PersistencePendingIcon class="me-1" />
						)}
						{hasOperations && !operationsVisible && (
							<button
								type="button"
								class="btn btn-sm btn-light me-1"
								onClick={() => showOperations(true)}
							>
								<SubMenuIcon size={18} />
							</button>
						)}
						{operationsVisible && (
							<>
								{canEdit && (
									<>
										<button
											type="button"
											class="btn btn-sm btn-outline-danger me-1"
											onClick={() => {
												deleteStatus(status)
											}}
										>
											<DeleteIcon size={18} />
										</button>
										<a
											class="btn btn-sm btn-outline-secondary me-1"
											href={`/status/${encodeURIComponent(status.id)}/edit`}
										>
											<EditIcon size={18} />
										</a>
									</>
								)}
								<button
									type="button"
									class="btn btn-sm btn-light"
									onClick={() => showOperations(false)}
								>
									<CollapseRightIcon size={18} />
								</button>
							</>
						)}
						{!reactionsVisible && !operationsVisible && (
							<button
								type="button"
								class="btn btn-sm btn-light"
								onClick={() => showReactions(true)}
							>
								<AddReactionIcon size={18} />
							</button>
						)}
					</div>
				</div>
			)}
			{reactionsVisible && (
				<div class="d-flex align-items-center justify-content-end">
					<SelectReaction
						onReaction={(reaction) => {
							addReaction(status, reaction)
						}}
					/>
					<button
						type="button"
						class="btn btn-sm btn-light mb-1"
						onClick={() => showReactions(false)}
					>
						<CollapseRightIcon size={18} />
					</button>
				</div>
			)}
			{status.reactions.length > 0 && (
				<div>
					{status.reactions.map((reaction) => {
						const isAuthor = reaction.author === userId
						return (
							<Reaction
								reaction={reaction}
								onClick={() => {
									if (isAuthor) {
										deleteReaction(status, reaction)
									}
								}}
							/>
						)
					})}
				</div>
			)}
		</>
	)
}
