import { InfoIcon } from 'lucide-preact'
import type { Reaction as TReaction } from '#context/Status.js'
import { ReactionRole } from '#context/Status.js'
import { Reaction, ReactionView, Role, reactionPresets } from './Reactions.js'
import { redirectAfterLogin } from './redirectAfterLogin.js'
import { ThumbsUp } from '#openmoji/1F44D.js'

export const ReactionsHelp = () => (
	<section>
		<div class="row mt-3">
			<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
				<h2>Reactions</h2>
				<p>
					Reactions are a way to add annotations to a status. Besides simple
					reactions, for example a <ThumbsUp /> to indicate that you like a
					status, reactions can have two special roles:
				</p>
				<ol>
					<li>
						<Role role={ReactionRole.SIGNIFICANT} />
						Significant: this makes the status stand out, and in syncs will
						highlight the status to make it stand out from regular status.
					</li>
					<li>
						<Role role={ReactionRole.QUESTION} /> Question: signals that this
						status should be discussed during the sync meeting.
					</li>
				</ol>
			</div>
		</div>

		<div class="row mt-1">
			<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
				A user icon marks reactions given by you:{' '}
				<ReactionView
					byUser={true}
					reaction={{
						emoji: '👍️',
					}}
				/>
			</div>
		</div>

		<div class="row mt-3">
			<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
				<h3>Available reactions</h3>
				<p>
					<InfoIcon strokeWidth={1} size={20} class="me-1" />
					You can customize your reactions{' '}
					<a href={redirectAfterLogin('/reactions')}>here</a>.
				</p>
			</div>
		</div>

		{reactionPresets.map((reaction) => (
			<div class="row mb-1">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 d-flex align-items-center justify-content-star">
					<Reaction reaction={reaction} />
					<span>
						{reaction.description ?? 'N/A'} <br />
						<ExplainRole reaction={reaction} />
					</span>
				</div>
			</div>
		))}
	</section>
)

export const ExplainRole = ({ reaction }: { reaction: TReaction }) => {
	switch ('role' in reaction && reaction.role) {
		case ReactionRole.QUESTION:
			return (
				<span>
					Marks the status as a question to be discussed during the sync
					meeting.
				</span>
			)
		case ReactionRole.SIGNIFICANT:
			return <span>Denotes a significant update that should be reviewed.</span>
		default:
			return <span>This reaction has no special role.</span>
	}
}
