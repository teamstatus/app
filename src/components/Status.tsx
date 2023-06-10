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
	const actionsVisible = reactionsVisible || operationsVisible
	const canEdit = userId === status.author
	const hasOperations = canEdit
	return (
		<>
			<div class="mt-2 mb-2">
				<Markdown markdown={status.message} />
			</div>
			<div class="clearfix">
				{status.reactions.length > 0 && (
					<div class="float-start mb-2">
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
			</div>
			{!actionsVisible && (
				<div class="d-flex align-items-center justify-content-between">
					<small class="text-muted d-flex flex-wrap">
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
					<span class={'text-nowrap'}>
						{status.persisted === false && (
							<PersistencePendingIcon class="me-1" />
						)}
						{hasOperations && (
							<button
								type="button"
								class="btn btn-sm btn-light me-1"
								onClick={() => showOperations(true)}
							>
								<SubMenuIcon />
							</button>
						)}
						<button
							type="button"
							class="btn btn-sm btn-light"
							onClick={() => showReactions(true)}
						>
							<AddReactionIcon />
						</button>
					</span>
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
						<CollapseRightIcon />
					</button>
				</div>
			)}
			{operationsVisible && (
				<div class="d-flex align-items-center justify-content-end">
					{canEdit && (
						<>
							<button
								type="button"
								class="btn btn-sm btn-outline-danger me-1"
								onClick={() => {
									deleteStatus(status)
								}}
							>
								<DeleteIcon />
							</button>
							<a
								class="btn btn-sm btn-outline-secondary me-1"
								href={`/status/${encodeURIComponent(status.id)}/edit`}
							>
								<EditIcon />
							</a>
						</>
					)}
					<button
						type="button"
						class="btn btn-sm btn-light"
						onClick={() => showOperations(false)}
					>
						<CollapseRightIcon />
					</button>
				</div>
			)}
		</>
	)
}
