import { useAuth } from '#context/Auth.js'
import { useOpenmoji } from '#context/Openmoji.js'
import {
	ReactionRole,
	type PersistedReaction,
	type Reaction as TReaction,
} from '#context/Status.js'
import {
	AuthorIcon,
	PersistencePendingIcon,
	QuestionIcon,
	SignificantIcon,
} from './Icons.js'

export const bugFix: TReaction = {
	description: 'A bug was fixed',
	emoji: '🐞',
	role: ReactionRole.SIGNIFICANT,
}

export const newVersionRelease: TReaction = {
	description: 'A new version was released',
	emoji: '🚀',
	role: ReactionRole.SIGNIFICANT,
}

export const decision: TReaction = {
	description: 'A decision was made',
	emoji: '✍️',
	role: ReactionRole.SIGNIFICANT,
}

export const importantEvent: TReaction = {
	description: 'An important event occurred',
	emoji: '📆',
	role: ReactionRole.SIGNIFICANT,
}

export const question: TReaction = {
	description: 'This item needs to be elaborated during the next sync meeting',
	emoji: '🙋',
	role: ReactionRole.QUESTION,
}

export const praise: TReaction = {
	emoji: '🌟',
	description: 'This is amazing!',
}

export const thumbsUp = {
	emoji: '👍️',
}

export const reactionPresets: TReaction[] = [
	newVersionRelease,
	decision,
	importantEvent,
	question,
	praise,
	thumbsUp,
]

export const SelectReaction = ({
	onReaction,
}: {
	onReaction: (reaction: TReaction) => void
}) => (
	<>
		{reactionPresets.map((reaction) => (
			<Reaction reaction={reaction} onClick={() => onReaction(reaction)} />
		))}
	</>
)

export const Reaction = ({
	reaction,
	onClick,
}: {
	reaction: TReaction | PersistedReaction
	onClick?: () => void
}) => {
	const { user } = useAuth()
	const byUser = 'author' in reaction && reaction.author === user?.id
	return <ReactionView byUser={byUser} reaction={reaction} onClick={onClick} />
}

export const ReactionView = ({
	reaction,
	byUser,
	onClick,
	class: c,
}: {
	byUser?: boolean
	onClick?: () => void
	reaction: TReaction
	class?: string
}) => {
	const { svgFromEmoji } = useOpenmoji()
	const { emoji, description } = reaction
	const role = 'role' in reaction ? reaction.role : undefined
	return (
		<button
			type="button"
			class={`btn me-1 text-nowrap btn-light reaction ${c}`}
			style={byUser === true ? { borderColor: 'goldenrod' } : {}}
			title={description}
			onClick={() => onClick?.()}
			disabled={onClick === undefined}
		>
			{role !== undefined && <Role role={role} />}
			{svgFromEmoji(emoji, { title: reaction.description })}
			{byUser === true && <AuthorIcon size={18} strokeWidth={1} class="ms-1" />}
			{'persisted' in reaction && reaction.persisted === false && (
				<PersistencePendingIcon class="ms-1" size={18} strokeWidth={1} />
			)}
		</button>
	)
}

export const Role = ({ role }: { role: ReactionRole }) => {
	switch (role) {
		case ReactionRole.SIGNIFICANT:
			return (
				<SignificantIcon class="me-1" size={20} strokeWidth={2} color="green" />
			)
		case ReactionRole.QUESTION:
			return <QuestionIcon class="me-1" size={20} strokeWidth={2} color="red" />
		default:
			return null
	}
}
