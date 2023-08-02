import { useOpenmoji } from '#context/Openmoji.js'

export const OpenmojiIcon = ({
	emoji,
	black,
}: {
	emoji: string
	black?: true
}) => {
	const { fromEmoji } = useOpenmoji()
	return fromEmoji(emoji, black)
}
