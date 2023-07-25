import { decodeTime } from 'ulid'
import { ReactionRole, type Status } from '#context/Status.js'
import { Markdown } from './Markdown.js'
import { ShortDate } from './ShortDate.js'
import { Author } from './Author.js'

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
			<div class="d-flex align-items-start justify-content-between">
				<div class="d-flex align-items-end justify-content-start me-2 flex-row text-muted">
					<small class="text-nowrap">
						<a
							href={`/project/${encodeURIComponent(
								status.project,
							)}/status/${encodeURIComponent(status.id)}`}
							class="text-muted"
						>
							<ShortDate date={ts} />
						</a>
					</small>
					<small class="mx-1">&middot;</small>
					<Author id={status.author} />
				</div>
			</div>
			{signficantReactionsByAuthor.map((reaction) => (
				<div>
					{reaction.emoji}{' '}
					<em>{reaction.description ?? 'No description available.'}</em>
				</div>
			))}
			<Markdown markdown={status.message} />
		</div>
	)
}
