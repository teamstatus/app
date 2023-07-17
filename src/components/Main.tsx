import type { ComponentChildren } from 'preact'
import { useUI } from '../context/UI.js'

export const Main = ({
	children,
	class: c,
}: {
	children: ComponentChildren
	class?: string
}) => {
	const { projectsMenuVisible } = useUI()

	return (
		<main
			class={c}
			style={{
				filter: projectsMenuVisible ? 'blur(5px)' : undefined,
			}}
		>
			{children}
		</main>
	)
}
