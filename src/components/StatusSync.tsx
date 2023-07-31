import { decodeTime } from 'ulid'
import { ReactionRole, type Reaction, type Status } from '#context/Status.js'
import { Markdown } from './Markdown.js'
import { ShortDate } from './ShortDate.js'
import { UserProfile } from '#components/UserProfile.js'

export const StatusSync = ({ status }: { status: Status }) => (
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
						<ShortDate date={new Date(decodeTime(status.id))} />
					</a>
				</small>
				<small class="mx-1">&middot;</small>
				<UserProfile id={status.author} />
			</div>
		</div>
		{signficantReactionsByAuthor(status).map((reaction) => (
			<div>
				{reaction.emoji}{' '}
				<em>{reaction.description ?? 'No description available.'}</em>
			</div>
		))}
		<Markdown markdown={status.message} />
	</div>
)

export const signficantReactionsByAuthor = (status: Status): Reaction[] =>
	status.reactions.filter(
		(reaction) =>
			'role' in reaction &&
			reaction.role === ReactionRole.SIGNIFICANT &&
			reaction.author === status.author,
	)
