import { decodeTime } from 'ulid'
import { ReactionRole, type Status } from '../context/Status.js'
import { Markdown } from './Markdown.js'

export const StatusSync = ({ status }: { status: Status }) => {
	const ts = new Date(decodeTime(status.id))
	const signficantReactionsByAuthor = status.reactions.filter(
		(reaction) =>
			'role' in reaction &&
			reaction.role === ReactionRole.SIGNIFICANT &&
			reaction.author === status.author,
	)
	return (
		<div class="mb-1 mt-2">
			{signficantReactionsByAuthor.map((reaction) => (
				<div>
					{reaction.emoji}{' '}
					<em>{reaction.description ?? 'No description available.'}</em>
				</div>
			))}
			<div class="d-flex align-items-center justify-content-start">
				<div class="d-flex align-items-center justify-content-start me-2 flex-column">
					<small class="float-start me-1 text-muted mt-1 text-nowrap">
						(
						<time dateTime={ts.toISOString()}>
							{ts.toISOString().slice(0, 10)}
						</time>
						)
					</small>
				</div>
				<Markdown markdown={status.message} />
			</div>
		</div>
	)
}
