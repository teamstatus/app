import { micromark } from 'micromark'

export const Markdown = ({ markdown }: { markdown: string }) => (
	<div
		class="markdown"
		// biome-ignore  lint/security/noDangerouslySetInnerHtml: needed
		dangerouslySetInnerHTML={{
			__html: micromark(markdown),
		}}
	/>
)
