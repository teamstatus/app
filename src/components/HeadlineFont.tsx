import type { ComponentChildren } from 'preact'

export const AsHeadline = ({
	children,
}: {
	children: ComponentChildren | string
}) => (
	<span
		style={{
			fontFamily: 'var(--headline-font)',
			fontWeight: 700,
		}}
	>
		{children}
	</span>
)
