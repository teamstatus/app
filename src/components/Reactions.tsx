import type { PersistedReaction } from '../context/Status.js'
import {
	AuthorIcon,
	PersistencePendingIcon,
	QuestionIcon,
	SignificantIcon,
} from './Icons.js'

// Reactions can have special roles
export enum ReactionRole {
	// A significant thing happened, makes the status stand out from others in the list of status
	SIGNIFICANT = 'SIGNIFICANT',
	// The status needs to be discussed during the next sync meeting, this will collect this status in a separate list of open questions during the next sync meeting
	QUESTION = 'QUESTION',
}

export type Reaction =
	| {
			role: ReactionRole
			emoji: string
			description: string
	  }
	| {
			emoji: string
			description?: string
	  }

export const bugFix: Reaction = {
	description: 'A bug was fixed',
	emoji: '🐞',
	role: ReactionRole.SIGNIFICANT,
}

export const newVersionRelease: Reaction = {
	description: 'A new version was released',
	emoji: '🚀',
	role: ReactionRole.SIGNIFICANT,
}

export const question: Reaction = {
	description: 'This item needs to be discussed during the next sync meeting',
	emoji: '🙋',
	role: ReactionRole.QUESTION,
}

export const praise: Reaction = {
	emoji: '🌟',
	description: 'This is amazing!',
}

export const thumbsUp = {
	emoji: '👍',
}

const reactionPresets: Reaction[] = [
	newVersionRelease,
	question,
	praise,
	thumbsUp,
]

export const SelectReaction = ({
	onReaction,
}: {
	onReaction: (reaction: Reaction) => void
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
	byUser,
}: {
	reaction: Reaction | PersistedReaction
	onClick?: () => void
	byUser?: boolean
}) => {
	const role = 'role' in reaction ? reaction.role : undefined
	const { emoji, description } = reaction
	return (
		<button
			type="button"
			class={'btn btn-sm me-1 text-nowrap btn-light'}
			style={byUser === true ? { borderColor: 'goldenrod' } : {}}
			title={description}
			onClick={() => onClick?.()}
		>
			{role !== undefined && <Role role={role} />}
			<span>{emoji}</span>
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
