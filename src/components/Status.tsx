import { UserProfile } from '#components/UserProfile.js'
import { useAuth } from '#context/Auth.js'
import { useStatus, type Status as TStatus } from '#context/Status.js'
import cx from 'classnames'
import { useEffect, useState } from 'preact/hooks'
import { decodeTime } from 'ulid'
import { Ago } from './Ago.js'
import {
	AddIcon,
	AddReactionIcon,
	CloseIcon,
	DeleteIcon,
	EditIcon,
	PersistencePendingIcon,
	SubMenuIcon,
} from './Icons.js'
import { Markdown } from './Markdown.js'
import { Reaction, SelectReaction } from './Reactions.js'
import { CustomReaction } from './CustomReaction.js'

export const Status = ({
	status,
	onReactionsVisible,
}: {
	status: TStatus
	onReactionsVisible?: (visible: boolean) => void
}) => {
	const [reactionsVisible, showReactions] = useState(false)
	const [customReactionVisible, showCustomReaction] = useState(false)
	const [operationsVisible, showOperations] = useState(false)
	const { user } = useAuth()
	const { addReaction, deleteReaction, deleteStatus } = useStatus()
	const canEdit = user?.id === status.author
	const hasOperations = canEdit

	useEffect(() => {
		onReactionsVisible?.(reactionsVisible)
	}, [reactionsVisible])

	useEffect(() => {
		if (!reactionsVisible) return

		const t = setTimeout(() => {
			showReactions(false)
		}, 5000)

		return () => {
			clearTimeout(t)
		}
	}, [reactionsVisible])

	useEffect(() => {
		if (!operationsVisible) return

		const t = setTimeout(() => {
			showOperations(false)
		}, 5000)

		return () => {
			clearTimeout(t)
		}
	}, [operationsVisible])

	return (
		<>
			<div>
				<small class="text-muted opacity-75 d-flex me-2 mb-2 flex-wrap">
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
			<div
				class={cx(
					'd-flex align-items-center justify-content-between mb-3 flex-wrap',
					{
						'mt-2': status.reactions.length > 0,
					},
				)}
			>
				<div>
					{status.reactions.map((reaction) => {
						const isAuthor = reaction.author === user?.id
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
				{reactionsVisible && (
					<div>
						<button
							type="button"
							class="btn btn-light me-1"
							onClick={() => {
								showReactions(false)
								showCustomReaction(true)
							}}
						>
							<AddIcon size={18} />
						</button>
						<button
							type="button"
							class="btn btn-light"
							onClick={() => showReactions(false)}
						>
							<CloseIcon size={18} />
						</button>
					</div>
				)}
				{!reactionsVisible && (
					<div class="text-nowrap">
						{status.persisted === false && (
							<PersistencePendingIcon class="me-1" />
						)}
						{hasOperations && !operationsVisible && (
							<button
								type="button"
								class="btn btn-light me-1"
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
											class="btn btn-outline-danger me-1"
											onClick={() => {
												deleteStatus(status)
											}}
										>
											<DeleteIcon size={18} />
										</button>
										<a
											class="btn btn-outline-secondary me-1"
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
									class="btn btn-light me-1"
									onClick={() => showOperations(false)}
								>
									<CloseIcon size={18} />
								</button>
							</>
						)}
						{!reactionsVisible && (
							<button
								type="button"
								class="btn btn-light"
								onClick={() => showReactions(true)}
							>
								<AddReactionIcon size={18} />
							</button>
						)}
					</div>
				)}
				{reactionsVisible && (
					<>
						<div class="d-flex align-items-end justify-content-end flex-wrap">
							<SelectReaction
								onReaction={(reaction) => {
									addReaction(status, reaction)
								}}
							/>
						</div>
					</>
				)}
			</div>
			{customReactionVisible && (
				<CustomReaction
					onReaction={(reaction) => {
						addReaction(status, reaction)
						showCustomReaction(false)
					}}
					onClose={() => {
						showCustomReaction(false)
					}}
				/>
			)}
		</>
	)
}
