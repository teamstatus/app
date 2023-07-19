export const AsHeadline = ({ children }: { children: ChildNode | string }) => (
	<span
		style={{
			fontFamily: 'var(--headline-font)',
			fontWeight: 700,
		}}
	>
		{children}
	</span>
)
