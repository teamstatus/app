import { useOpenmoji } from '#context/Openmoji.js'

export const OpenmojiIcon = ({ emoji }: { emoji: string }) => {
	const { svgFromEmoji } = useOpenmoji()
	return svgFromEmoji(emoji)
}
