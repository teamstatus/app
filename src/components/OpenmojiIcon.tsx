import { useOpenmoji } from '#context/Openmoji.js'

export const OpenmojiIcon = ({
	emoji,
	width,
	height,
	title,
	class: c,
}: {
	emoji: string
	width?: number
	height?: number
	title?: string
	class?: string
}) => {
	const { svgFromEmoji } = useOpenmoji()
	return svgFromEmoji(emoji, {
		width,
		height,
		title,
		class: c,
	})
}
