import type { Reaction as TReaction } from '#context/Status.js'
import { ReactionRole } from '#context/Status.js'
import { OpenmojiIcon } from './OpenmojiIcon.js'
import { Reaction, ReactionView, Role, reactionPresets } from './Reactions.js'

export const ReactionsHelp = () => (
	<>
		<h2>Reactions</h2>
		<p>
			Reactions are a way to add annotations to a status. Besides simple
			reactions, for example a <OpenmojiIcon emoji="👍️" /> to indicate that you
			like a status, reactions can have two special roles:
		</p>
		<ol>
			<li>
				<Role role={ReactionRole.SIGNIFICANT} />
				Significant: this makes the status stand out, and in syncs will
				highlight the status to make it stand out from regular status.
			</li>
			<li>
				<Role role={ReactionRole.QUESTION} /> Question: signals that this status
				should be discussed during the sync meeting.
			</li>
		</ol>
		<p>
			A user icon marks reactions given by you:{' '}
			<ReactionView
				byUser={true}
				reaction={{
					emoji: '👍️',
				}}
			/>
		</p>
		<section class="mb-3">
			<h3>Reaction examples</h3>
			{reactionPresets.map((reaction) => (
				<div class="d-flex align-items-center justify-content-start">
					<Reaction reaction={reaction} />
					<span>
						{reaction.description !== undefined ? (
							<>
								{reaction.description}
								<br />
							</>
						) : (
							''
						)}
						<ExplainRole reaction={reaction} />
					</span>
				</div>
			))}
		</section>
	</>
)

export const ExplainRole = ({ reaction }: { reaction: TReaction }) => {
	switch ('role' in reaction && reaction.role) {
		case ReactionRole.QUESTION:
			return (
				<em>
					Marks the status as a question to be discussed during the sync
					meeting.
				</em>
			)
		case ReactionRole.SIGNIFICANT:
			return <em>Denotes a significant update that should be reviewed.</em>
		default:
			return <em>This reaction has no special role.</em>
	}
}
