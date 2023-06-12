import { useAuth } from '../context/Auth.js'
import type { Reaction as TReaction } from '../context/Status.js'
import { ReactionRole } from '../context/Status.js'
import { Reaction, reactionPresets } from './Reactions.js'

export const ReactionsHelp = () => {
	const { user } = useAuth()
	return (
		<section>
			<div class="row mt-3">
				<div class="col-12 col-md-6 offset-md-3">
					<h2>Reactions</h2>
				</div>
			</div>

			<div class="row mt-1">
				<div class="col-12 col-md-6 offset-md-3">
					A user icon marks reactions given by you:{' '}
					<Reaction
						reaction={{
							author: user?.id ?? '@alex',
							emoji: '👍',
						}}
					/>
				</div>
			</div>

			<div class="row mt-3">
				{reactionPresets.map((reaction) => (
					<div class="col-12 col-md-3 mb-3">
						<div class="card">
							<div class="card-header">
								<h3>
									<Reaction reaction={reaction} />
								</h3>
							</div>
							<div class="card-body">
								<dl>
									<dt>Description</dt>
									<dd>{reaction.description ?? 'N/A'}</dd>
									<dt>Role</dt>
									<dd>
										<ExplainRole reaction={reaction} />
									</dd>
								</dl>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

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
