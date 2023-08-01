import { useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { useAuth } from '#context/Auth.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import { Ago } from './Ago.js'
import {
	AddReactionIcon,
	CloseIcon,
	DeleteIcon,
	EditIcon,
	PersistencePendingIcon,
	SubMenuIcon,
} from './Icons.js'
import { Markdown } from './Markdown.js'
import { Reaction, SelectReaction } from './Reactions.js'
import { UserProfile } from '#components/UserProfile.js'

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
			<div>
				<small class="text-muted d-flex me-2">
					<span class="text-nowrap d-flex align-items-center">
						<a
							href={`/project/${encodeURIComponent(
								status.project,
							)}/status/${encodeURIComponent(status.id)}`}
							class="text-muted"
						>
							<Ago date={new Date(decodeTime(status.id))} />
						</a>
						{status.version > 1 && (
							<>
								<EditIcon size={20} class={'ms-1'} /> {status.version}
							</>
						)}
					</span>
					<span class="mx-1">&middot;</span>
					<span class="text-nowrap d-flex align-items-center">
						<UserProfile id={status.author} />
					</span>
				</small>
			</div>
			<Markdown markdown={status.message} />
			<div class="d-flex align-items-center justify-content-between mb-2 flex-wrap">
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
				{!reactionsVisible && (
					<div class="text-nowrap">
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
											href={`/project/${encodeURIComponent(
												status.project,
											)}/status/${encodeURIComponent(status.id)}/edit`}
										>
											<EditIcon size={18} />
										</a>
									</>
								)}
								<button
									type="button"
									class="btn btn-sm btn-light me-1"
									onClick={() => showOperations(false)}
								>
									<CloseIcon size={18} />
								</button>
							</>
						)}
						{!reactionsVisible && (
							<button
								type="button"
								class="btn btn-sm btn-light"
								onClick={() => showReactions(true)}
							>
								<AddReactionIcon size={18} />
							</button>
						)}
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
							class="btn btn-sm btn-light"
							onClick={() => showReactions(false)}
						>
							<CloseIcon size={18} />
						</button>
					</div>
				)}
			</div>
		</>
	)
}
