import format from 'rehype-format'
import html from 'rehype-stringify'
import { remark } from 'remark'
import remark2rehype from 'remark-rehype'

const parseMarkdown = remark().use(remark2rehype).use(format).use(html)

export const Markdown = ({ markdown }: { markdown: string }) => (
	<div
		class="markdown"
		// rome-ignore  lint/security/noDangerouslySetInnerHtml: needed
		dangerouslySetInnerHTML={{
			__html: parseMarkdown.processSync(markdown).value.toString('utf-8'),
		}}
	/>
)
