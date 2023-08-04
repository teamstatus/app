import type { ComponentChild } from 'preact'

export const FormContainer = ({
	children,
	class: c,
}: {
	class?: string
	children: ComponentChild
}) => (
	<div
		style={{
			backgroundColor: '#eee',
			borderRadius: '10px',
		}}
		class={`p-2 p-lg-4 mb-3 ${c}`}
	>
		{children}
	</div>
)
